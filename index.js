import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const watchlist = []

const form = document.getElementById('form')
const inputValue = document.getElementById('search')
const resultsDiv = document.querySelector('#results-container')

form.addEventListener('submit', handleSearch)

async function handleSearch(e){
    e.preventDefault()
    const title = inputValue.value
    const res = await fetch(`http://www.omdbapi.com/?apikey=6910ebc2&t=${title}`)
    const data  = await res.json()
    data.id = uuidv4()
    inputValue.value =''
    console.log(data)
    render(data)     
}

document.addEventListener('click', handleClick)

function handleClick(e){
    console.log(e.target.dataset)
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
                            <i class="fa fa-plus-circle" data-add=${data.id} aria-hidden="true"></i> watchlist
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