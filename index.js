

var resultsContainer = document.getElementById('resultsContainer')
var alertsContainer = document.getElementById('alertsContainer')
var movieData = []
const defaultPhoto = 'no_image.png'

document.addEventListener('DOMContentLoaded',function(){
    resultsContainer.innerHTML = renderMovies(movieData)

    // document.getElementById('search-form').addEventListener('input', searchMovies)
    document.getElementById('search-form').addEventListener('submit', searchMovies)
    
})

function searchMovies (e) {
    e.preventDefault()

    var searchString = document.getElementById('search-input').value
    // var filteredData = movieData.filter(findStringInMovie)
    var urlEncodedSearchString = encodeURIComponent(searchString)
    var omdbAPIURL = 'http://www.omdbapi.com/?apikey=3430a78&s=' + urlEncodedSearchString

    console.log(searchString)
    console.log('getting JSON data')
    movieData = $.getJSON(omdbAPIURL, translateJSONResponse)

    function translateJSONResponse (response){
        resultsContainer.innerHTML = renderMovies(response.Search)
    }    
}

function renderMovies (movies) {
    console.log(movies)
    var resultsHTML = movies.map(function (currentMovie){        
        var posterPhoto = currentMovie.Poster
        if (posterPhoto == "N/A"){posterPhoto = defaultPhoto}
        var resultsHTML = `
        <div class="col-lg-4 col-md-6 col-sm-12 results">
            <div class="card bg-dark text-white text-center" style="width: 18rem; margin: auto;" onclick="saveToWatchlist('${currentMovie.imdbID}')">
                <img class="card-img img-responsive" src=${posterPhoto} alt=${currentMovie.Title} alt="Card image cap">
                <div class="overlay btn"></div>
                <div class="btn1 btn"><p>+</p></div>
                <div class="card-body">
                    <h5 class="card-title">${currentMovie.Title}</h5>
                    <p class="card-text">${currentMovie.Year}</p>
                </div>
                <div class="card-footer text-white-50 btn">
                    Save to Collection
                </div>
            </div>
        </div>
        `
    return resultsHTML 

    })
    
    return resultsHTML.join('')

    
  }



function saveToWatchlist (movieID) {
    var savedMovie = movieData.find(function(currentMovie){
        return currentMovie.imdbID == movieID
    })

    // Get the watchlist from local storage as JSON & parse it
    var watchlistJSON = localStorage.getItem('watchlist')
    var watchlist = JSON.parse(watchlistJSON)

    if (watchlist == null){watchlist = []}

    // ~~~ if the movie is not already in watchlist, then push it in ~~~~~
    if (watchlist.find(function(currentMovie){
        return currentMovie.imdbID == movieID
    })==null) {
        watchlist.push(savedMovie)
        alertSuccess(savedMovie)
    } else {
        alertFailure(savedMovie)
    }

    // Convert watchlist back into JSON & save it to local storage
    watchlistJSON = JSON.stringify(watchlist)
    localStorage.setItem('watchlist',watchlistJSON)

}

function alertSuccess (movie) {
    alertsContainer.innerHTML = `
    <div class="alert alert-success" role="alert">
        You have saved ${movie.Title} ${movie.Year} to your watchlist!
    </div>`
    setTimeout(clearAlerts, 3000)
}

function alertFailure (movie) {
    alertsContainer.innerHTML = `
    <div class="alert alert-danger" role="alert">
        ${movie.Title} ${movie.Year} is already in your watchlist
    </div>`
    setTimeout(clearAlerts, 3000)
}

function clearAlerts () {
    console.log('clearing alert')
    alertsContainer.innerHTML = ""
}

