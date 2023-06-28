import data from "./movies.json" assert{type: 'json'};

console.log(data);
const movies = data.movies;

// DOM elements
const min = document.getElementById('min');
const sec = document.getElementById('sec');
const newBtn = document.getElementById('new');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const movieContainer = document.getElementById('movie');

// Global Vars
var played = [];
var timerEnd = false;
var minutes = 0;
var seconds = 0;
var secs = parseInt(sec.innerText);
var mins = parseInt(min.textContent);
var i = 59;

// Button events
newBtn.addEventListener('click', run);
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

// Start the game
// Get a new movie
// reset the timer
async function run() {
    resetTimer();
    let movie = movies[getIndex()];

    if (played.includes(movie)) {
        movie = movies[getIndex()];
    }

    played.push(movie);
    movieContainer.innerHTML = movie;

    updateTimer(movie);
}

// Start the timer
async function startTimer() {
    movieContainer.innerHTML = "HIDDEN";

    secs = parseInt(sec.innerText);
    mins = parseInt(min.textContent);

    for (i = secs; i >= 0; --i) {
        sec.innerHTML = (i > 9) ? i : "0" + i;

        if (i == 0 && mins != 0) {
            mins = 0;
            i = 59;
            min.innerHTML = "00";
        }

        if (i == 0 && mins == 0) {
            movieContainer.innerHTML = "TIMEOUT!";
            timerEnd = true;
            playSound();
            return;
        }

        await sleep(1000);
    }
}

// Sleep for a given duration before
// executing a given task
function sleep(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

// Reset the current timer
function resetTimer() {
    sec.innerHTML = "00";
    min.innerHTML = "00";
    movieContainer.innerHTML = "";

    window.clearTimeout();
    secs = 0;
    mins = 0;
    i = 0;
}

// Update timer with the current
// Moview play duration
function updateTimer(movie) {
    let time = getMovieTime(movie);

    minutes = (time == 90) ? 1 : ((time == 120) ? 2 : 1);
    seconds = (time == 90) ? 30 : 0;

    if (minutes == 1 && seconds == 0) {
        sec.innerHTML = 59;
        min.innerHTML = "00";
        return;
    }

    if (minutes == 2 && seconds == 0) {
        sec.innerHTML = 59;
        min.innerHTML = "01";
        return;
    }

    if (minutes == 1 && seconds == 30) {
        min.innerHTML = "01";
        sec.innerHTML = 30;
        return;
    }
}

// Play ending sound
function playSound() {
    let sound = new Audio("./beep-05.wav");
    sound.loop = false;
    sound.play();
}

// Get random index
// in range 1 - movies length
function getIndex() {
    return Math.floor(Math.random() * movies.length + 1) + 1;
}

// Get Moive play duration time
// depending on the length of the movie title
function getMovieTime(movie) {
    if (movie !== undefined) {
        let len = movie.split(" ").length;
        return (len > 2 && len < 4) ? 90 : ((len >= 4) ? 120 : 60);
    }
}