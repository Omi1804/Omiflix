

// constants 
const apiKey = "642207126e5956fcff0e2832c3b25770"
const apiEndpoint = "https://api.themoviedb.org/3"
const imgPath = "https://image.tmdb.org/t/p/original"
const apiPath = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apiKey}&language=en-US`,
    searchOnYoutube: (query)=> `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}%20trailer&key=AIzaSyBlCjurcZq2nu3EuTWM0aF6gOv1wA4e264`
}


//Boots up the app
function init() {
    fetchTrendingMovies()
    fetchAndBuildAllSections(); 

}

function fetchTrendingMovies()
{
    fetchAndBuildMovieSection(apiPath.fetchTrending,'Trending Now')
    .then(list=>{
        const random = parseInt(Math.random()*list.length)
        buildBannerSection(list[random])
    }).catch(err=>{
        console.log(err)
    })
}

function buildBannerSection(movie)
{
    const bannerCont = document.getElementById('banner-section')
    bannerCont.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;
    const div = document.createElement('div')
    div.innerHTML = `
    <h2 class="banner-title">${movie.title}</h2>
    <p class="banner-info">Trending in Movies | Released - ${movie.release_date}</p>
    <p class="banner-overview">${movie.overview}</p>
    <div class="action-button-cont">
        <!-- &nbsp for giving space between the elements -->
        <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard" data-name="Play"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp; Play</button>
        <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard" data-name="Info"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg> &nbsp; More Info</button>
        
    </div>
</div> 
    `

    div.className="banner-content container";
    bannerCont.append(div)
}

function fetchAndBuildAllSections() {
         fetch(apiPath.fetchAllCategories)
        .then(res => res.json())
        .then(res => {
            const Categories = res.genres;
            if (Array.isArray(Categories) && Categories.length) {
                Categories.forEach(category => {
                    fetchAndBuildMovieSection(apiPath.fetchMoviesList(category.id), category.name)

                })
            }
            // console.table(Categories)
        })
        .catch(err => console.log(err))
}

function fetchAndBuildMovieSection(fetchUrl, categoryName) {
    // console.log(fetchUrl, categoryName);
    return fetch(fetchUrl)
        .then(res => res.json())
        .then(res => {
            // console.table(res.results)
            const movies = res.results;
            if (Array.isArray(movies) && movies.length) {
                buildMoviesSection(movies, categoryName)
            }
            return movies
        })
        .catch(err => console.log(err))
}

function buildMoviesSection(list, categoryName) {
    // console.log(list, categoryName)

    const moviesCont = document.getElementById('movies-cont')
    const moviesListHTML = list.map(item => {
        return `
        <div class = "movie-item" onmouseenter="searchMovieTrailer('${item.title}','yt${item.id}')">
        <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}">
        <div class = "iframe-wrap" id="yt${item.id}"></div>
        </div>
    `
    }).join('');

    // console.log(moviesListHTML)

    const moviesSectionHTML = `
 <h2 class="movie-section-heading" >${categoryName}<span class="explore-nudge">Explore All</span></h2>
 <div class="movies-row">
 ${moviesListHTML}
 </div>
`

    // console.log(moviesSectionHTML)
    
    const div = document.createElement('div')
    div.className = 'movies-section'
    div.innerHTML = moviesSectionHTML;
    moviesCont.appendChild(div)

}


function searchMovieTrailer(movieName,iframeId)
{
    if(!movieName){
        return;
    }

    fetch(apiPath.searchOnYoutube(movieName))
    .then(res=>res.json())
    .then(res=>{
        const bestResult = res.items[0];

        // to open the trailer on another window 
        // const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`
        // window.open(youtubeUrl);
        // console.log(youtubeUrl)
        
        const element = document.getElementById(iframeId);
        // console.log(element,iframeId)

        const div = document.createElement('div');
        div.innerHTML = `<iframe width="420" height="315" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&mute=1">
        </iframe>`
        element.append(div);
    })
    .catch(err=> console.log(err))
}



//as the site loads the funtion starts
window.addEventListener('load', function () {
    init();
    window.addEventListener('scroll',function(){
        // updating Header ui 
        const header =  document.getElementById('header')
        if(window.scrollY < 70) {
            header.classList.remove('black-bg')
        }
        else{
            header.classList.add('black-bg')
        }
    })
})