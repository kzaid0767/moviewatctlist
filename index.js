import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let watchlist = []

const form = document.getElementById('form')
const inputValue = document.getElementById('search')
const resultsDiv = document.querySelector('#results-container')
const watchlistContainer = document.getElementById("watchlist-container")

if(form){form.addEventListener('submit', handleSearch)}

async function handleSearch(e){
    e.preventDefault()
    const title = inputValue.value
    const res = await fetch(`http://www.omdbapi.com/?apikey=6910ebc2&t=${title}`)
    const data  = await res.json()
    data.id = uuidv4()
    watchlist=[]
    watchlist.push(data)
    inputValue.value =''
    render(data)     
}

document.addEventListener('click', handleClick)

function handleClick(e){
    if(e.target.dataset.add){
        handleAdd(e.target.dataset.add)
        console.log(e.target.dataset.add)
    }
    if(e.target.dataset.remove){
        handleRemove(e.target.dataset.remove)
    }
}

function handleAdd(){
    if (!JSON.parse(localStorage.getItem('moviesData'))){
        localStorage.setItem('moviesData', JSON.stringify(watchlist))
    } else{
        let moviesData = JSON.parse(localStorage.getItem('moviesData'))
        moviesData.push(watchlist[0])
        localStorage.setItem('moviesData', JSON.stringify(moviesData))
    }
    watchlist=[]
    alert('Movie was added to watchlist')
}

function handleRemove(key){
    let moviesData = JSON.parse(localStorage.getItem('moviesData'))
    moviesData = moviesData.filter(movie => movie.id !== key)
    localStorage.setItem('moviesData', JSON.stringify(moviesData))
    renderWatchlist()
}

function render(data){
    let html=``
    if(data.Response==='True'){
        html = `
        <div class="movieResult">
            <img class="poster" src=${data.Poster} alt="a poster of movie">
            <div class="movieDetails">
                <div class="title-n-rating">
                    <h3>${data.Title}</h3>
                    <p><i class="fa fa-star" aria-hidden="true"></i> ${data.imdbRating}</p>
                </div>
                <div class="other-details">
                    <p>${data.Runtime}</p>
                    <p>${data.Genre}</p>
                    <div class="add-btn">
                        <p>
                            <i class="sign fa fa-plus-circle" data-add=${data.id} aria-hidden="true"></i> watchlist
                        </p>
                    </div>
                </div>
                <div class="summary">
                <p>${data.Plot}</p>
                </div>
            </div>
        </div>
        `
    } else {
        html = `
        <div  class="no-results ">
            <h3>Unable to find what you're looking for. Please try another search.</h3>
        </div>
        `
    }
    resultsDiv.innerHTML = html
}


function renderWatchlist() {
    let html = `
    <h1  class="placeholder">Your watchlist is looking a little empty..</h1>
    <a href="/index.html"><i class="fa fa-plus-circle " aria-hidden="true"> Let's add some movies</i></a>
    `
    let arr=JSON.parse(localStorage.getItem('moviesData'))
    if(arr.length){
        html=``
        for(let data of arr){
            html += `
            <div class="movieResult">
                <img class="poster" src=${data.Poster} alt="a poster of movie">
                <div class="movieDetails">
                    <div class="title-n-rating">
                        <h3>${data.Title}</h3>
                        <p><i class="fa fa-star" aria-hidden="true"></i> ${data.imdbRating}</p>
                    </div>
                    <div class="other-details">
                        <p>${data.Runtime}</p>
                        <p>${data.Genre}</p>
                        <div class="add-btn">
                            <p>
                                <i class="sign fa fa-minus-circle" data-remove="${data.id}" aria-hidden="true"></i> watchlist
                            </p>
                        </div>
                    </div>
                    <div class="summary">
                    <p>${data.Plot}</p>
                    </div>
                </div>
            </div>
            `
        } 
    }     
    if(watchlistContainer){watchlistContainer.innerHTML = html}
}

renderWatchlist()