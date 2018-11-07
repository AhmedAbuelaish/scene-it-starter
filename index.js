
var resultsContainer = document.getElementById('resultsContainer')
var alertsContainer = document.getElementById('alertsContainer')


document.addEventListener('DOMContentLoaded',function(){
    resultsContainer.innerHTML = renderMovies(movieData)

    document.getElementById('search-form').addEventListener('input', searchMovies)
    document.getElementById('search-form').addEventListener('submit', searchMovies)
    
})



function searchMovies (e) {
    e.preventDefault()




    
    var searchString = e.target.value.toLowerCase();
    var filteredData = movieData.filter(findStringInMovie)
    // var remainderData = movieData.filter(findStringInMovie)
    // ~~~~~todo: need to make this inverse the boolean result of findStringInMovie and return an array of nonsearch results

    function findStringInMovie(movie){
        var foundInName = movie.Title.toLowerCase().indexOf(searchString) > -1;
        var foundInDate = movie.Year.toLowerCase().indexOf(searchString) > -1;
        return foundInName || foundInDate;
    }

    if (e.target.value == ''){
        console.log('rendering movies')
        resultsContainer.innerHTML = renderMovies(movieData)
    } else {
        console.log('rendering search')
        resultsContainer.innerHTML = renderMovies(filteredData) + 
        `<div class="col-12 text-center text-white-50 mt-5 mb-5 pt-3 pb-3" id="pageDivider">
        <h2>Other Movies You Might Enjoy</h2>
        </div>` + 
        renderMovies(movieData)
    }
}

function renderMovies (movies) {
    var resultsHTML = movies.map(function (currentMovie){
        var resultsHTML = `
        <div class="col-lg-4 col-md-6 col-sm-12 results">
            <div class="card bg-dark text-white text-center" style="width: 18rem; margin: auto;" onclick="saveToWatchlist('${currentMovie.imdbID}')">
                <img class="card-img img-responsive" src=${currentMovie.Poster} alt=${currentMovie.Title} alt="Card image cap">
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
