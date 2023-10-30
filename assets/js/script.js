document.addEventListener('DOMContentLoaded', function () {
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


    // code for bestTime storing found on Stack Overflow ( https://stackoverflow.com/questions/63634765/making-a-high-score-best-time-localstorage-in-javascript)
    let bestTime = parseFloat(localStorage.getItem('bestTime')) || Infinity;

    //Generate card array for use throughout 
    const cards = document.querySelectorAll('.card');

    function musicPlaying() {
        let isPlaying = true;
        const bgMusic = document.getElementById("bg-music");
        const bgMusicToggle = document.getElementById("bg-music-toggle");
        bgMusicToggle.addEventListener("click", function () {
            if (isPlaying) {
                bgMusic.pause();
                isPlaying = false;
            } else {
                bgMusic.play();
                isPlaying = true;
            }
        });
    }
    // Finally figured a way to make this work - https://stackoverflow.com/questions/49679094/how-to-check-if-document-contains-an-element
    // Checked the current page for the music element and so it will only load if it contains music
    if (document.getElementById('bg-music')) {
        musicPlaying();
    } else {
        console.log(`No Background Music`);
    }





    function resetGame() {
        cards.forEach(card => card.addEventListener('click', flipCard));
        cards.forEach(card => card.classList.remove('card-flipped'));
        milliseconds = 0;
        seconds = 0;
        minutes = 0;
        cardMatches = 0;
        timerStarted = false;
        document.getElementById('timer').textContent = `00:00:00`;
        clearInterval(timerInterval);
        shuffleCards();
    };

    // Similar logic as above to ensure this code only runs on pages with a reset button so as to avoid issue with page loading
    if (document.getElementById('reset-button')) {
        const resetButton = document.getElementById('reset-button');
        resetButton.addEventListener('click', resetGame);
    } else {
        console.log(`No reset button`);
    }

    // On window load - reset game for fresh game play
    window.onload = function () {
        resetGame();
    };




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
        // Take correct cards out of play but leave them as flipped cards
        const audio = new Audio('../assets/audio/correct.mp3');

        audio.play();
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        // Add counter for total matches - once card matches is equal to cards.length then game is complete
        cardMatches += 2;

        if (cardMatches === cards.length) {
            const audio = new Audio('../assets/audio/winner.mp3');
            audio.play();
            stopTimer();
            const currentTime = minutes * 60 + seconds + milliseconds / 100;
            //Logic for best time to be logged - needed to format time so it logs out the same as timer 
            if (currentTime < bestTime) {
                bestTime = currentTime;

                document.getElementById('best-time').textContent = `Best Time: ${formatTime(Math.floor(bestTime / 60), Math.floor(bestTime) % 60, Math.floor((bestTime % 1) * 100))}`;
            }





            setTimeout(() => {
                const modalBody = document.querySelector('#winnerModal .modal-body');
                modalBody.innerHTML = `<p class="modal-text">
              You have completed the level in 
              
             ${formatTime(
                    minutes,
                    seconds,
                    milliseconds
                )}. Feel free to reset the game and see if you can beat your previous score!
                <br><br>
                Alternatively, you can check in regularly to see if new levels have become available!
                <br><br>
                Thanks for playing BrainTrainer :)</p>`;

                //include alert logging time taken to compelte and alert player of their win
                $("#winnerModal").modal('show');

                // alert('Congratulations! You completed the game in ' + formatTime(minutes, seconds, milliseconds) + '.');
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

    function stopTimer() {
        clearInterval(timerInterval);
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



    //Shuffle the cards using cards array - Final shuffle logic was found using https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function shuffleCards() {
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


    shuffleCards(); // Shuffle cards on game load - including automatic reset after completion 

    cards.forEach(card => card.addEventListener('click', flipCard));


});