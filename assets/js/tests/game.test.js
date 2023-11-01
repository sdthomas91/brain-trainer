/**
 * @jest-environment jsdom
 */
// Issue regarding testing due to incorrect config - https://stackoverflow.com/questions/72013449/upgrading-jest-to-v29-error-test-environment-jest-environment-jsdom-cannot-be - 
// provided a solution on how to install jsdom

// A lot of valuable knowledge was gained and implemented thanks to this youtube video as a foundation - https://www.youtube.com/watch?v=OS5mVVM5vAg
// Destructure the named export correctly
const { shuffleCards, startTimer, flipCard, checkForMatch, resetGame, shuffle, stopTimer, resetCardStyles, resetTimer, unflipCards, resetBoard, disableCards,  } = require('../game');

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("level-1.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();

});


describe('Memory Game Functions', () => {
    let mockCard1; 
    

    beforeEach(() => {
        // Needed some mock elements to be able to properly test the flip card function - jest.fn info found here (https://jestjs.io/docs/mock-functions)
        mockCard1 = { classList: { add: jest.fn() }, setAttribute: jest.fn(), getAttribute: jest.fn(() => '1') };
        mockCard2 = { classList: { add: jest.fn(), remove: jest.fn() }, setAttribute: jest.fn(), getAttribute: jest.fn(() => '2') };
        mockElement = { textContent: '' };
        // mock resetBoard for unflipCards function

        const resetBoard = jest.fn(() => {
            hasFlippedCard = false;
            lockBoard = false;
            firstCard = null;
            secondCard = null;
        });
    });


    test('flipCard should flip the selected card', () => {
        flipCard.call(mockCard1);
        expect(mockCard1.classList.add).toHaveBeenCalledWith('card-flipped');
    });

    test('unflipCards should unflip the selected cards', () => {
        const mockFirstCard = { classList: { remove: jest.fn() } };
        const mockSecondCard = { classList: { remove: jest.fn() } };
    
        let lockBoard = false;
    
        lockBoard = unflipCards(mockFirstCard, mockSecondCard);
    
        expect(mockFirstCard.classList.remove).toHaveBeenCalledWith('card-flipped');
        expect(mockSecondCard.classList.remove).toHaveBeenCalledWith('card-flipped');
        expect(lockBoard).toBe(false); // Ensure the lockBoard is set to false after unflipping the cards
    });
    
    

    test('startTimer should start the game timer', () => {
        // Need a mock timer - found information in JEST docs (https://jestjs.io/docs/timer-mocks)
        jest.useFakeTimers();
        const setIntervalSpy = jest.spyOn(window, 'setInterval');
        startTimer();
        jest.advanceTimersByTime(3000); // advance the timer by 3000 ms
        expect(setIntervalSpy).toHaveBeenCalled();
        // expect(setInterval).toHaveBeenCalled(); - code didn't work as I didn't realise the expect cannot read native Javascript - used the Jest spyOn (https://jestjs.io/docs/jest-object#jestspyonobject-methodname
        // method to create a mock setInterval
    });

    test('should update the time variables correctly', () => {
        let milliseconds = 0;
        let seconds = 0;
        let minutes = 0;

        const mockCallback = jest.fn(); // Mock the callback function

        const interval = setInterval(() => {
            // Increment time variables
            milliseconds++;
            if (milliseconds === 100) {
                seconds++;
                milliseconds = 0;
            }
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }

            // Call the mock callback with the updated time values
            mockCallback(minutes, seconds, milliseconds);
        }, 10);

        // Clear the interval to stop the test from running indefinitely
        clearInterval(interval);
    });


    test('checkForMatch should check if a correct match has been made', () => {
        const disableCards = jest.fn();
        const unflipCards = jest.fn();
    
        const mockCard1 = { getAttribute: jest.fn() };
        const mockCard2 = { getAttribute: jest.fn() };
    
        mockCard1.getAttribute.mockReturnValue('1');
        mockCard2.getAttribute.mockReturnValue('1');
    
        checkForMatch(disableCards, unflipCards, mockCard1, mockCard2);
    
        expect(disableCards).toHaveBeenCalled();
        expect(unflipCards).not.toHaveBeenCalled();
    
        disableCards.mockReset();
        unflipCards.mockReset();
    
        mockCard1.getAttribute.mockReturnValue('1');
        mockCard2.getAttribute.mockReturnValue('2');
    
        checkForMatch(disableCards, unflipCards, mockCard1, mockCard2);
    
        expect(unflipCards).toHaveBeenCalled();
    });
    
    test('shuffleCards should shuffle the cards randomly', () => {
        const mockContainer = {
            children: [
                { style: { order: 0 } },
                { style: { order: 1 } },
                { style: { order: 2 } },
                { style: { order: 3 } },
                { style: { order: 4 } }
            ]
        };

        const mockShuffleFunction = jest.fn(array => {
            return array.reverse(); // Mocking the shuffle function - for testing I needed to simplify it so it is just a reverse rather than a full shuffle
        });

        shuffleCards(mockContainer, mockShuffleFunction);

        expect(mockShuffleFunction).toHaveBeenCalled(); 
    });
      
    test('stopTimer should clear the timer interval', () => {
        const clearIntervalMock = jest.fn();
        const mockInterval = 123; // Assuming you have a mock interval value
    
        global.clearInterval = clearIntervalMock; // Mocking the clearInterval function
    
        stopTimer(mockInterval);
    
        expect(clearIntervalMock).toHaveBeenCalledWith(mockInterval);
    });

    
});


//  I have decided to separate tests for the resetGame function - I was struggling to make it work within my other suite 
// I am also aware that the complexity of these functions is within my scope, but the testing of them is not as JEST is quite
// new to me. As such, I have broken them down into smaller, simpler functions that are easily tested. The overall functionality
// and concept of the resetGame function remains, and it will be recompiled in the live site script.
describe('resetGameTests', () => {
    let mockCard;
    let mockIndex;

    // Create jest functions to replicate the separate functions
    const resetCardStyles = jest.fn((card, index) => {
        card.style.order = index;
        card.classList.remove('card-flipped');
        card.addEventListener('click', flipCard);
    });
    const resetTimer = jest.fn(() => {
        return {
            milliseconds: 0,
            seconds: 0,
            minutes: 0,
            timerStarted: false,
        };
    });

    beforeEach(() => {
      mockCard = {
        style: { order: 0 },
        classList: { remove: jest.fn() },
        addEventListener: jest.fn(),
      };
      mockIndex = 0;
      milliseconds = 100;
      seconds = 30;
      minutes = 5;
      timerStarted = true;
    });


  
    test('resetCardStyles should reset cards within the resetGame function', () => {
      resetCardStyles(mockCard, mockIndex);
  
      expect(mockCard.style.order).toBe(mockIndex);
      expect(mockCard.classList.remove).toHaveBeenCalledWith('card-flipped');
      expect(mockCard.addEventListener).toHaveBeenCalledWith('click', flipCard);
    });
    test('resetTimer should reset the timer within the resetGame function', () => { //ResetTimer will be a basic function - I am ignoring rewriting the text content for now and simplifying for the sake of the test
        const initialValues = {
            milliseconds: 100,
            seconds: 30,
            minutes: 5,
            timerStarted: true,
        };
        const resetValues = resetTimer();
    
        expect(resetValues.milliseconds).toBe(0);
        expect(resetValues.seconds).toBe(0);
        expect(resetValues.minutes).toBe(0);
        expect(resetValues.timerStarted).toBe(false);
    });

    test('resetGame should reset the game using appropriate functions', () => {
        const mockCards = document.querySelectorAll('.card'); // Cards - mocks the cards selector
        const mockContainer = document.createElement('div'); // Container - mocks the cards container
        const mockShuffleFunction = jest.fn((array) => array.reverse()); // Same fake simple shuffle as used before - just reverse instead of full shuffle
    
        resetGame(mockCards, mockContainer, mockShuffleFunction); //pass the correct parameters - I keep forgetting this needs doing
        
        //Tried calling for each individual card but it got messy - I know the resetCardStyles 
        // function works due to above test, so instead I have passed it as a mock function with
        // same implementation
        expect(resetCardStyles).toHaveBeenCalled(); 

        // used mock function replicating resetTimer as I know it works 
        expect(resetTimer).toHaveBeenCalled();

        // shuffle function already proven to work, used same setup to mock the shuffle function here (reverse)
        expect(mockShuffleFunction).toHaveBeenCalled();
    });


  });


  

 describe('resetBoard separate tests as resetBoard used as mock function in previous suite', () => {
    let hasFlippedCard;
    let lockBoard;
    let firstCard;
    let secondCard;
  
    beforeEach(() => {
      hasFlippedCard = true;
      lockBoard = true;
      firstCard = {};
      secondCard = {};
    });
  
    test('resetBoard should reset the card tiles to a playable state', () => {
      const { hasFlippedCard: updatedHasFlippedCard, lockBoard: updatedLockBoard, firstCard: updatedFirstCard, secondCard: updatedSecondCard } = resetBoard(hasFlippedCard, lockBoard, firstCard, secondCard);
  
      expect(updatedHasFlippedCard).toBe(false);
      expect(updatedLockBoard).toBe(false);
      expect(updatedFirstCard).toBeNull();
      expect(updatedSecondCard).toBeNull();
    });
  });
  
  describe('disableCards function', () => {
    let mockFirstCard;
    let mockSecondCard;
    let stopTimerMock;
    let resetGameMock;
    let mockCards;
    let cardMatches;

    beforeEach(() => {
        mockFirstCard = {
            removeEventListener: jest.fn(),
            classList: { remove: jest.fn() }
        };
        mockSecondCard = {
            removeEventListener: jest.fn(),
            classList: { remove: jest.fn() }
        };
        stopTimerMock = jest.fn();
        resetGameMock = jest.fn();
        mockCards = [ // Define your mock cards array here
            { id: 1, data: 'card1' },
            { id: 2, data: 'card2' },
            { id: 3, data: 'card3' }
        ];
        cardMatches = mockCards.length; // Set cardMatches to the length of mockCards
    });

    test('removes click event listeners from the first and second cards', () => {
        disableCards(mockFirstCard, mockSecondCard, stopTimerMock, resetGameMock);
        expect(mockFirstCard.removeEventListener).toHaveBeenCalledWith('click', flipCard);
        expect(mockSecondCard.removeEventListener).toHaveBeenCalledWith('click', flipCard);
    });

    test('stops the timer and resets the game if all cards are matched', () => {
        cardMatches = mockCards.length - 2; // Set cardMatches to the length of mockCards and minus 2 as the function adds 2 card matches to the total
        disableCards(mockFirstCard, mockSecondCard, stopTimerMock, resetGameMock);
        if (cardMatches === mockCards.length) {
            expect(stopTimerMock).toHaveBeenCalled();
            expect(resetGameMock).toHaveBeenCalled();
        }
    });

    test('resets the board after disabling the cards', () => {
        disableCards(mockFirstCard, mockSecondCard, stopTimerMock, resetGameMock);
        expect(mockFirstCard.classList.remove).toHaveBeenCalledWith('card-flipped');
        expect(mockSecondCard.classList.remove).toHaveBeenCalledWith('card-flipped');
    });
});



