var resultsContainer = document.getElementById('resultsContainer')
var watchlistJSON = localStorage.getItem('watchlist')
var watchlist = JSON.parse(watchlistJSON)

// cleanupWatchlist()

// function cleanupWatchlist () {
//     // todo: remove duplicates from watchlist object and save it back to local storage


//     // Convert watchlist back into JSON & save it to local storage
//     watchlistJSON = JSON.stringify(watchlist)
//     localStorage.setItem('watchlist',watchlistJSON)
// }


document.addEventListener('DOMContentLoaded',function(){
    resultsContainer.innerHTML = renderMovies(watchlist)

    document.getElementById('search-form').addEventListener('input', searchMovies)
    document.getElementById('search-form').addEventListener('submit', searchMovies)

})

function searchMovies (e) {
    e.preventDefault()
    var searchString = e.target.value.toLowerCase();
    var filteredData = watchlist.filter(findStringInMovie)

    function findStringInMovie(movie){
        var foundInName = movie.Title.toLowerCase().indexOf(searchString) > -1;
        var foundInDate = movie.Year.toLowerCase().indexOf(searchString) > -1;
        return foundInName || foundInDate;
    }

    if (e.target.value == ''){
        console.log('rendering movies')
        resultsContainer.innerHTML = renderMovies(watchlist)
    } else {
        console.log(watchlist)
        console.log('rendering search')
        resultsContainer.innerHTML = renderMovies(filteredData) + 
        `<div class="col-12 text-center text-white-50 mt-5 mb-5 pt-3 pb-3" id="pageDivider">
        <h2>Other Movies You Might Enjoy</h2>
        </div>` + 
        renderMovies(watchlist)
    }
}

function renderMovies (movies) {
    var resultsHTML = movies.map(function (currentMovie){
        var resultsHTML = `
        <div class="col-lg-4 col-md-6 col-sm-12 results">
            <div class="card bg-dark text-white text-center" id="${currentMovie.imdbID}" style="width: 18rem; margin: auto;" onclick="removeFromWatchlist('${currentMovie.imdbID}')">
                <img class="card-img img-responsive" src=${currentMovie.Poster} alt=${currentMovie.Title} alt="Card image cap">
                <div class="overlay btn"></div>
                <div class="btn1 btn"><p>-</p></div>
                <div class="card-body">
                    <h5 class="card-title">${currentMovie.Title}</h5>
                    <p class="card-text">${currentMovie.Year}</p>
                </div>
                <div class="card-footer text-white-50 btn">
                    Remove from Collection
                </div>
            </div>
        </div>
        `
    return resultsHTML 

    })
    
    return resultsHTML.join('')

  }

function removeFromWatchlist (movieID) {

    // Get the watchlist from local storage as JSON & parse it
    var watchlistJSON = localStorage.getItem('watchlist')
    var watchlist = JSON.parse(watchlistJSON)

    if (watchlist == null){watchlist = []}

    // ~~~create a new array for all elements in watchlist that do not have selected imbdID~~~~~
    watchlist = watchlist.filter(function(movie){return movie.imdbID !== movieID})

    // Convert watchlist back into JSON & save it to local storage
    watchlistJSON = JSON.stringify(watchlist)
    localStorage.setItem('watchlist',watchlistJSON)

    resultsContainer.innerHTML = renderMovies(watchlist)
}