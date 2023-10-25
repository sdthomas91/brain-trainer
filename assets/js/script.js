// Gobal variables required - tried to use minimal global vars but needs must
let hasFlippedCard = false;
let lockBoard = false;
let firstCard = null;
let secondCard = null;
let timerStarted = false;
let timerInterval;
let milliseconds = 0;
let seconds = 0;
let minutes = 0;

//Generate card array for use throughout 
const cards = document.querySelectorAll('.card');

// // Add a reset button in case someone wants to start again
// const resetButton = document.getElementById('reset-button');
// // // // Event listener used for button click - need to link to resetGame function
// resetButton.addEventListener('click', resetGame);

function flipCard() {
    // Need a way of preventing user from flipping too many cards - lockBoard will be a boolean that will prevent user interaction whilst the game either flips/unflips
    // cards or is checking for a match
    if (lockBoard) return;
    if (this === firstCard) return;

    //   Whenever a card is clicked - add class to make it a flipped card and display card back
    this.classList.add('card-flipped');

    //   Logic to ensure that a flipped card cannot be treated as an unflipped card
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;

        //  Start timer on first card click 
        if (!timerStarted) {
            //   function to start timer
            startTimer();
            timerStarted = true;
            // when first card is flipped, switch timer to start  
            timerStarted = true;
        }
    } else {
        secondCard = this;
        // Function to check fo match

        checkForMatch();
    }
}

function checkForMatch() {
    if (firstCard && secondCard) {
        const firstCardData = firstCard.getAttribute('data-card');
        const secondCardData = secondCard.getAttribute('data-card');
        // Check for match by comparingthe data-card attribute of the flipped cards
        const isMatch = firstCardData === secondCardData;
        // Ternary Operator used for a quick logic statement to either disable cards so they cannot be played again or unflip cards if an incorrect match is made
        isMatch ? disableCards() : unflipCards();
    }

};

function disableCards() {

}

function unflipCards() {
    // Use lockboard boolean to ensure no cards can be flipped whilst cards are being unflipped
    lockBoard = true;

    firstCard.classList.remove('card-flipped');
    secondCard.classList.remove('card-flipped');
}

function resetBoard() {

};


function resetGame() {

};

function startTimer() {
    timerInterval = setInterval(function () {
        milliseconds++;
        if (milliseconds === 100) {
            seconds++;
            milliseconds = 0;
        }
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        document.getElementById('timer').textContent = `Time: `;
    }, 10);
}

function stopTimer() {

};


//Shuffle the cards using cards array - Final shuffle logic was found using https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleCards(cards) {
    let currentIndex = cards.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [cards[currentIndex].style.order, cards[randomIndex].style.order] = [
            cards[randomIndex].style.order,
            cards[currentIndex].style.order
        ];
    }

    return cards;
}


shuffleCards(cards); // Shuffle cards on game load - including automatic reset after completion 

// Export Functions 
module.exports = {
    shuffleCards,
    flipCard,
    startTimer,
    checkForMatch,
};