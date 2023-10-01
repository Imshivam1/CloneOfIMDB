// Define constants for DOM elements
const favBtn = document.querySelector(".fav-btn");
const favBox = document.querySelector("#fav-Box");
const closeFavList = document.querySelector("#fav-Box > span a");
const input = document.getElementById("search-input");
const movieContainer = document.querySelector(".movie-list");
const detailBox = document.querySelector("#detail-Box");
const closeDetailList = document.querySelector("#detail-Box > span a");
const boxDetail = document.querySelector(".details-box");

// Initialize an empty array to store favorite movies
let favMovies = [];

// Function to display the favorite box
favBtn.addEventListener('click', () => {
    favBox.classList.add('active');
    // Add animation class for entrance animation
    favBox.classList.add('entrance-animation');
    
    // Set a timeout to remove the animation class after the animation is complete
    setTimeout(() => {
        favBox.classList.remove('entrance-animation');
    }, 1000); // Adjust the time based on your animation duration
});

// Function to close the favorite box
function closeFavBox() {
    // Add animation class for exit animation
    favBox.classList.add('exit-animation');
    
    // Set a timeout to hide the favorite box after the animation is complete
    setTimeout(() => {
        favBox.classList.remove('active', 'exit-animation');
    }, 1000); // Adjust the time based on your animation duration
}

// Event listener to close the favorite box
document.querySelector('#fav-Box > span a').addEventListener('click', closeFavBox);


// Function to close the favorite box
closeFavList.addEventListener('click', () => {
    favBox.classList.remove('active');
});

// Function to close the movie details box
closeDetailList.addEventListener('click', () => {
    detailBox.classList.remove('active');
});

// Function to fetch movie data based on user input
const fetchMovies = async () => {
    const apiKey = '3114934a'; //api key
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${input.value}&page=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        updateMovieList(data.Search);
    } catch (error) {
        console.error(error);
    }
};

// Event listener for input field to trigger movie search
input.addEventListener('keyup', fetchMovies);

// Function to update the movie list
const updateMovieList = (movies) => {
    movieContainer.innerHTML = "";
    movies.forEach((item) => {
        const movieData = {
            name: item.Title,
            year: item.Year,
            img: item.Poster
        };
        const div = document.createElement('div');
        div.classList.add('box');
        div.innerHTML = `
        <img src=${movieData.img} alt="">
        <button class="movie-btn">
            <span>${movieData.name}</span>
            <span>${movieData.year}</span>
        </button>
        `;
        movieContainer.appendChild(div);
    });
};

// Function to fetch movie details
const fetchMovieDetail = async (name, year) => {
    const url = `https://www.omdbapi.com/?apikey=3114934a&t=${name}&y=${year}&plot=full`;

    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
};

// Event listener for clicking on a movie
movieContainer.addEventListener("click", async (e) => {
    const clickedElement = e.target;
    const closestBox = clickedElement.closest('.box');

    if (closestBox) {
        const name = closestBox.querySelector('span:nth-child(1)').textContent.trim();
        const year = closestBox.querySelector('span:nth-child(2)').textContent.trim();
        const movieDetail = await fetchMovieDetail(name, year);
        displayMovieDetail(movieDetail);
    }
});

// Function to display movie details
const displayMovieDetail = (movieData) => {
    detailBox.classList.add('active');
    boxDetail.innerHTML = `
        <div class="img-container">
            <img src="${movieData.Poster}" alt="">
            <button class="btn add-fav-btn">Add To Favorite</button>
        </div>
        <div class="title-container">
            <h2 style="text-transform:uppercase">${movieData.Title} <span>${movieData.Year}</span></h2>
            <p><b style="color:#ff7373">ACTORS</b> : ${movieData.Actors}</p>
            <p><b style="color:#ff7373">GENRE</b> : ${movieData.Genre}, <span><b style="color:#ff7373">RELEASED DATE</b> : ${movieData.Released}</span></p>
            <p><b style="color:#ff7373">IMDb Rating</b> : ${movieData.imdbRating}<span><b style="color:#ff7373">IMDb Votes</b> : ${movieData.imdbVotes}</span></p>
            <p><b style="color:#ff7373">WRITER</b> : ${movieData.Writer}, <span><b style="color:#ff7373">DIRECTOR</b>  : ${movieData.Director}</span></p>
            <p><b style="color:#ff7373">BOX OFFICE</b> : ${movieData.BoxOffice}, <span><b style="color:#ff7373">RUNTIME</b>  : ${movieData.Runtime}</span></p>
            <p><b style="color:#ff7373">LANGUAGE</b> : ${movieData.Language}</p>
            <p><b style="color:#ff7373">AWARDS</b> : ${movieData.Awards}</p>
            <div class="plot">
                <p><b style="color:#ff7373">PLOT</b> </p>
                <p>${movieData.Plot}</p>
            </div>
        </div>
    `;

    // Event listener to add a movie to favorites
    const addButton = document.querySelector(".add-fav-btn")
    addButton.addEventListener('click', () => {
        favMovies.push(movieData);
        localStorage.setItem('favMovies', JSON.stringify(favMovies));
        updateFavoriteList();
    });
};

// Function to update the list of favorite movies
const updateFavoriteList = () => {
    let favMovieContainer = document.querySelector('.fav-container');
    favMovieContainer.innerHTML = "";
    favMovies.forEach((movie, index) => {
        const favMovieList = document.createElement('li');
        favMovieList.classList.add('fav-movie-list');
        favMovieList.innerHTML = `
            <img src="${movie.Poster}" alt="movie-image">
            <p>${movie.Title} <span>${movie.Year}</span></p>
        `;

        // Adding a delete button for the list
        const deleteBtn = document.createElement('span');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.classList.add('delete-button');
        deleteBtn.addEventListener("click", () => {
            favMovies.splice(index, 1);
            localStorage.setItem('favMovies', JSON.stringify(favMovies));
            updateFavoriteList();
        });

        favMovieList.appendChild(deleteBtn);
        favMovieContainer.appendChild(favMovieList);
    });

    // Update the movie count
    let countElement = document.getElementById("fav-count");
    countElement.textContent = favMovies.length;
};

// Function to get stored favorite movies from local storage
const getStoredFavoriteMovies = () => {
    const storedMovies = localStorage.getItem('favMovies');
    return storedMovies ? JSON.parse(storedMovies) : [];
};

// Initialize favorite movies and update the list
window.onload = () => {
    favMovies = getStoredFavoriteMovies()
    updateFavoriteList();
};
