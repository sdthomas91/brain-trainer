
/**
 * Separate document created containing only functions for testing purposes - 
 * this was to side step the issue of having event handlers in the testing document.
 */

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
let cardMatches = 0;



//Generate card array for use throughout 
let cards = document.querySelectorAll('.card');


// Toggle Background Music

function resetGame() {
    cards.forEach((card, index) => {
        card.style.order = index;
        card.classList.remove('card-flipped');
        card.addEventListener('click', flipCard);
    });
    milliseconds = 0;
    seconds = 0;
    minutes = 0;
    cardMatches = 0;
    timerStarted = false;
    document.getElementById('timer').textContent = `00:00:00`;
    clearInterval(timerInterval);
    shuffleCards(cards);
}






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
            // when first card is flipped, switch timer to start  
            timerStarted = true;
        }
    } else {
        secondCard = this;
        // Function to check fo match

        checkForMatch();
    }
}

function checkForMatch(disableCards, unflipCards, firstCard, secondCard) {
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
    // Take correct cards out of play but leave them as flipped cards
    const audio = new Audio('../assets/audio/correct.mp3');

    audio.play();
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    // Add counter for total matches - once card matches is equal to cards.length then game is complete
    cardMatches += 2;

    if (cardMatches === cards.length) {
        stopTimer();
        setTimeout(() => {
            //include alert logging time taken to compeltep and alert player of their win
            alert('Congratulations! You completed the game in ' + formatTime(minutes, seconds, milliseconds) + '.');
            // reset game once the alert has been presented
            resetGame();
        }, 500); // 0.5 second delay before showing the completion alert - allows completed board to show
    }

    resetBoard();
}



function unflipCards() {
    // Use lockboard boolean to ensure no cards can be flipped whilst cards are being unflipped
    lockBoard = true;
    // Need a delay in order to show both cards before they are unflipped - will use timeout function 
    setTimeout(() => {
        const audio = new Audio('../assets/audio/incorrect.mp3');

        audio.play();
        firstCard.classList.remove('card-flipped');
        secondCard.classList.remove('card-flipped');

        resetBoard();
    }, 500);

}

function resetBoard() {
    // Reset the boards gameplay
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;

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
        document.getElementById('timer').textContent = `Time: ${formatTime(minutes, seconds, milliseconds)}`;
    }, 10);
}

function stopTimer(interval) {
    clearInterval(interval);
}



function formatTime(minutes, seconds, milliseconds) {
    return (
        String(minutes).padStart(2, '0') +
        ':' +
        String(seconds).padStart(2, '0') +
        ':' +
        String(milliseconds).padStart(2, '0')
    );
}

    // Shuffle function - went round in circles, did some additional reading on Fisher Yates (https://www.tutorialspoint.com/what-is-fisher-yates-shuffle-in-javascript)
    function shuffle(array) {
        let currentIndex = array.length,
            tempValue,
            randomIndex;
      
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
      
            tempValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = tempValue;
        }
      
        return array;
    }

    //   Function to shuffle cards calls on the already shuffled array using the Fisher Yates logic - potentially 
    //   could be simplified but this works for now - this should be scalable as well so will work on larger grids.
    function shuffleCards(container, shuffleFunction) {
        let cards = Array.from(container.children);
      
        cards = shuffleFunction(cards);
      
        cards.forEach((card, index) => {
          card.style.order = index;
        });
    }




// Export Functions 
module.exports = {
    shuffleCards,
    resetGame,
    startTimer,
    checkForMatch,
    shuffle,
    flipCard,
    stopTimer,
};