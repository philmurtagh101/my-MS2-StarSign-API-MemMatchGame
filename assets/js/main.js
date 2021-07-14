$(document).ready(function() {
    $("section").removeClass("sectionhide");
    $("section").hide();
    $("input").click(function() {
        $("input").hide(2000);
        $("section").show(2000);
        flashCards();
    });
    $("#restartButton,.new-starsign").click(function() {
        $("section").hide(2000);
        $("input").show(2000);
    });
});

//Get Star Sign and query and show Aztro API results
const starModal = document.getElementById('starModal');
var starsignSelected;


function openStarModal() {
    starModal.classList.add('show-modal');
}

function closeStarModal() {
    starModal.classList.remove('show-modal');
}
// Get Star Sign
function getStarsign(starValue) {
    //let selectElement = document.querySelector('#getstarsign');
    //starsignSelected = selectElement.value;

    starsignSelected = starValue;
    //document.querySelector('.selectedstarsign').textContent = starsignSelected;


    //change Star Sign on back of each card
    let cardBackImages = document.querySelectorAll('.game-card');
    [].forEach.call(cardBackImages, function(cardBackImage) {
        cardBackImage.style.backgroundImage = `url("/assets/img/${starsignSelected}.jpg")`;
    });
    starSignInfo()
}
//API Fetch - using starsignSelected
function starSignInfo() {
    var xxxx;
    var url = `https://sameer-kumar-aztro-v1.p.rapidapi.com/?sign=${starsignSelected}&day=today`;
    console.log("Testing...", url);
    starSignFetch(url, starSigndata);
    starSigndata(xxxx);
}
//Pull out data for display
function starSigndata(zzz) {
    console.log(zzz.description);
    document.querySelector('#starsigndes').textContent = zzz.description;
    console.log(zzz.color);
    document.querySelector('#starcolor').textContent = zzz.color;
}
//API Fetch 
function starSignFetch(url, callback) {
    fetch(url, {
            "method": "POST",
            "headers": {
                "x-rapidapi-key": "5258de36e5msh6a52293d8493026p1b55e1jsn9c8aface1d54",
                "x-rapidapi-host": "sameer-kumar-aztro-v1.p.rapidapi.com"
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            callback(data);
        })
        .catch(err => {
            console.error(err);
        });
}

//Show Instructions
const helpModal = document.getElementById('helpModal');

function openHelpModal() {
    helpModal.classList.add('show-modal');
}

function closeHelpModal() {
    helpModal.classList.remove('show-modal');
}

// Main Game Play
let cardElements = document.getElementsByClassName('game-card');
let cardElementsArray = [...cardElements];
let imgElements = document.getElementsByClassName('game-card-img');
let imgElementsArray = [...imgElements];
let starElements = document.getElementsByClassName('star');
let starElementsArray = [...starElements];
let counter = document.getElementById('moveCounter');
let timer = document.getElementById('timer');
let modalElement = document.getElementById('gameOverModal');
let totalGameMovesElement = document.getElementById('totalGameMoves');
let totalGameTimeElement = document.getElementById('totalGameTime');
let finalStarRatingElement = document.getElementById('finalStarRating');
let closeModalIcon = document.getElementById('closeModal');
let openedCards = [];
let matchedCards = [];
let moves;
let second = 0,
    minute = 0,
    hour = 0,
    interval,
    totalGameTime,
    starRating;

function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function startGame() {
    //shuffle cards
    let shuffledImages = shuffle(imgElementsArray);


    for (i = 0; i < shuffledImages.length; i++) {
        //remove all images from previous games from each card (if any)
        cardElements[i].innerHTML = "";

        //add the shuffled images to each card
        cardElements[i].appendChild(shuffledImages[i]);
        cardElements[i].type = `${shuffledImages[i].alt}`;

        //remove all extra classes for game play
        cardElements[i].classList.remove("show", "open", "match", "disabled");
        cardElements[i].children[0].classList.remove("show-img");
    }

    //listen for events on the cards
    for (let i = 0; i < cardElementsArray.length; i++) {
        cardElementsArray[i].addEventListener("click", displayCard);
    }
    //when game starts show all the cards for a split second
    // move flash cards into JQuery Section
    //flashCards();

    //reset moves
    moves = 0;
    counter.innerText = `${moves} move(s)`;

    //reset star rating
    for (let i = 0; i < starElementsArray.length; i++) {
        starElementsArray[i].style.opacity = 1;
    }

    //Reset Timer on game reset
    timer.innerHTML = '0 mins 0 secs';
    clearInterval(interval);
}

function flashCards() {
    for (i = 0; i < cardElements.length; i++) {
        cardElements[i].children[0].classList.add("show-img");
    }
    setTimeout(function() {
        for (i = 0; i < cardElements.length; i++) {
            cardElements[i].children[0].classList.remove("show-img");
        }
    }, 3000)
}

function displayCard() {
    this.children[0].classList.toggle('show-img');
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
    cardOpen(this);
}

function cardOpen(card) {
    openedCards.push(card);
    let len = openedCards.length;
    if (len === 2) {
        moveCounter();
        if (openedCards[0].type === openedCards[1].type) {
            //Check first if matched cards are woo
            if (openedCards[0].type === "woo") {
                woowoo();
            }
            matched();
        } else {
            unmatched();
        }
    }
}

function matched() {
    openedCards[0].classList.add("match");
    openedCards[1].classList.add("match");
    openedCards[0].classList.remove("show", "open");
    openedCards[1].classList.remove("show", "open");
    matchedCards.push(openedCards[0]);
    matchedCards.push(openedCards[1]);
    openedCards = [];
    //match 7 pairs =14  -> 1 pair short of a woo pairing
    if (matchedCards.length == 14) {
        endGame();
    }
}

function unmatched() {
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();
    setTimeout(function() {
        openedCards[0].classList.remove("show", "open", "unmatched");
        openedCards[1].classList.remove("show", "open", "unmatched");
        openedCards[0].children[0].classList.remove('show-img');
        openedCards[1].children[0].classList.remove('show-img');
        enable();
        openedCards = [];
    }, 500)
}

function disable() {
    cardElementsArray.filter((card) => {
        card.classList.add('disabled');
    })
}

function enable() {
    cardElementsArray.filter((card) => {
        card.classList.remove('disabled');
        //
        //for (let i = 0; i < matchedCards.length; i++) {
        //   matchedCards[i].classList.add('disabled');
        //}
    })
}

function moveCounter() {
    moves++;
    counter.innerHTML = `${moves} move(s)`;

    if (moves == 1) {
        second = 0;
        minute = 0;
        hour = 0;
        startTimer();
    }

    //setting rating based on moves
    if (moves > 8 && moves <= 12) {
        for (let i = 0; i < 5; i++) {
            starElementsArray[i].opacity = 1;
        }
    } else if (moves > 12 && moves <= 16) {
        for (let i = 0; i < 5; i++) {
            if (i > 3) {
                starElementsArray[i].style.opacity = 0.1;
            }
        }
    } else if (moves > 16 && moves <= 20) {
        for (let i = 0; i < 5; i++) {
            if (i > 2) {
                starElementsArray[i].style.opacity = 0.1;
            }
        }
    } else if (moves > 20 && moves <= 24) {
        for (let i = 0; i < 5; i++) {
            if (i > 1) {
                starElementsArray[i].style.opacity = 0.1;
            }
        }
    } else if (moves > 24) {
        for (let i = 0; i < 5; i++) {
            if (i > 0) {
                starElementsArray[i].style.opacity = 0.1;
            }
        }
    }
}

function startTimer() {
    interval = setInterval(function() {
        timer.innerHTML = `${minute} mins ${second} secs`;
        second++;
        if (second == 60) {
            minute++;
            second = 0;
        }
        if (minute == 60) {
            hour++;
            minute = 0;
        }
    }, 1000)
}
//game wrap-up
function endGame() {
    clearInterval(interval);
    totalGameTime = timer.innerHTML;
    starRating = document.querySelector('.rating').innerHTML;

    //show modal on game end
    modalElement.classList.add("show-modal");

    //show totalGameTime, moves and finalStarRating in Modal
    totalGameTimeElement.innerHTML = totalGameTime;
    totalGameMovesElement.innerHTML = moves;
    finalStarRatingElement.innerHTML = starRating;

    matchedCards = [];
    closeModal();
}

//wooWoo Function to indicate a fail.
function woowoo() {
    //show modal for woo woo fail
    document.getElementById('woowooModal').classList.add("show-modal");
    matchedCards = [];
    closeModalIcon.addEventListener("click", function() {
        document.getElementById('woowooModal').classList.remove("show-modal");
        startGame();
    })
}

function closeModal() {
    closeModalIcon.addEventListener("click", function() {
        modalElement.classList.remove("show-modal");
        startGame();
    })
}

function newStarsign() {
    modalElement.classList.remove("show-modal");
    startGame();
}

//restart game after a woo woo blunder and close the modal
function playAgainWoo() {
    document.getElementById('woowooModal').classList.remove("show-modal");
    startGame();
}

// wait for some milliseconds before game starts
window.onload = function() {
    setTimeout(function() {
        startGame();
    }, 1200);
}