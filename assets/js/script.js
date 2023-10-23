// Gobal variables required - tried to use minimal global vars but needs must
let hasFlippedCard = false;

//Generate card array for use throughout 
const cards = document.querySelectorAll('.card');

// // Add a reset button in case someone wants to start again
// const resetButton = document.getElementById('reset-button');
// // // // Event listener used for button click - need to link to resetGame function
// resetButton.addEventListener('click', resetGame);

function flipCard() {
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

            // when first card is flipped, switch timer to start  
            timerStarted = true;
        }
    } else {
        secondCard = this;
        // Function to check fo match
    }
}

function checkForMatch() {

};

function disableCards() {

};

function unflipCards() {

};

function resetBoard() {

};


function resetGame() {

};

function startTimer() {

};

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
};