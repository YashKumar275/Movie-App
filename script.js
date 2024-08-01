const searchForm = document.querySelector('form');
const movieContainer = document.querySelector('.movie');
const moviePoster = document.querySelector('.movie-poster');
const movieDetails = document.querySelector('.movie-details');
const inputBox = document.querySelector('.searchbox');
const latestMoviesContainer = document.getElementById('latest-movies');

const fetchLatestMovies = async () => {
    try {
        const searchTerms = ['Avengers', 'Batman', 'Spider-Man', 'Jurassic', 'Star Wars'];
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
        const myApiKey = "79dbac3d";
        const currentYear = new Date().getFullYear();
        const url = `http://www.omdbapi.com/?apikey=${myApiKey}&s=${randomTerm}&type=movie&y=2022`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to fetch movie data.");
        }

        const data = await response.json();

        if (data.Response === 'True') {
            showLatestMovies(data.Search);
        } else {
            showError('No Latest Movies Found!!!');
        }
    } catch (error) {
        console.error(error);
        showError('Failed to fetch latest movies.');
    }
};

const showLatestMovies = (movies) => {
    latestMoviesContainer.innerHTML = '';

    movies.forEach(movie => {
        const { Title, Poster } = movie;

        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `<img src='${Poster}' alt='${Title}'/>
                               <p>${Title}</p>`;

        movieCard.addEventListener('click', () => handleMovieClick(Title));

        latestMoviesContainer.appendChild(movieCard);
    });
    latestMoviesContainer.classList.remove('hidden');
};

const handleMovieClick = async (movie) => {
    const { Title } = movie;
    showError('Fetching Movie Information...');
    await getMovieInfo(Title);
};

// Function to fetch movie details from OMDB API
const getMovieInfo = async (movie) => { 
    try{
        const myApiKey = "79dbac3d";
        const url = `http://www.omdbapi.com/?apikey=${myApiKey}&t=${movie}`;  //t variable will help in searching movie

        const response = await fetch(url);

        if(!response.ok){
            throw new Error("Unable to fetch movie data.");
        }

        const data = await response.json(); //json to easily extract data

        if (data.Response === 'True') {
            showMovieDetails(data);
        } else {
            showError('No Movie Found!!!');
        }
    }
    catch(error){
        showError('Failed to fetch data.');
    }  
}

//Function to show movie data on screen
const showMovieDetails = (data) => {
    // empty movie container to show new movie details
    movieContainer.innerHTML = "";
    movieContainer.classList.remove('noBackground');

    //Destructuring assignment to extract properties from data object
    const {Title, imdbRating, Genre, Released, Runtime, Actors, Director, Plot, Poster} = data;

    //Creating div 
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie-info'); 
    movieElement.innerHTML= `<h2>${Title}</h2>
                            <p><strong>Rating: &#11088</strong>${imdbRating}</p>`;

    const movieGenreElement = document.createElement('div');
    movieGenreElement.classList.add('movie-genre');   //adding class name

    Genre.split(",").forEach(element => {          //for loop to get every element in genre with removing ','
        const p = document.createElement('p');
        p.innerText = element;
        movieGenreElement.appendChild(p);
    });

    movieElement.appendChild(movieGenreElement);

    movieElement.innerHTML += `<p><strong>Release Date: \u{1F4C5}</strong>${Released}</p>
                            <p><strong>Duration: </strong>${Runtime}</p>
                            <p><strong>Cast: </strong>${Actors}</p>
                            <p><strong>Directed by: </strong>${Director}</p>
                            <p><strong>Plot: </strong>${Plot}</p>`;

    const moviePosterElement = document.createElement('div');
    moviePosterElement.classList.add('movie-poster');
    moviePosterElement.innerHTML = `<img src='${Poster}'/>`;
    movieContainer.appendChild(moviePosterElement);

    movieContainer.appendChild(movieElement);
}

//Display Error message
const showError = (message) => {
    movieContainer.innerHTML = `${message}`;
    movieContainer.classList.add('noBackground');
}

searchForm.addEventListener("submit", (elmnt) => {
    elmnt.preventDefault(); //prevent from submitting form automatically 
    //console.log(inputBox.value);
    const movieName = inputBox.value.trim(); //trim will remove spaces
    if(movieName !== ''){
        showError('Fetching Movie Information...')
        getMovieInfo(movieName);
    }
    else{
       alert('Enter movie name!!');
    }
});

// Load latest movies on page load
window.addEventListener('load', fetchLatestMovies);