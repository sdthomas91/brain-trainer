

// Start Game Function
const startGame = function () {
    // When first tile is clicked
};

//Generate card array for use throughout 
const cards = document.querySelectorAll('.card');

function flipCard() {
  if (this === firstCard) return;

}

//Shuffle the cards using cards array
function shuffleCards() {
    cards.forEach(card => {
        // Using Math.random to generate random positions for each card
        let randomPos = Math.floor(Math.random() * cards.length);
        card.style.order = randomPos;
    });
}

shuffleCards(); // Shuffle cards on game load - including automatic reset after completion 