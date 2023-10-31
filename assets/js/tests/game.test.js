/**
 * @jest-environment jsdom
 */
// Issue regarding testing due to incorrect config - https://stackoverflow.com/questions/72013449/upgrading-jest-to-v29-error-test-environment-jest-environment-jsdom-cannot-be - 
// provided a solution on how to install jsdom

// Destructure the named export correctly
const { shuffleCards, startTimer, flipCard, checkForMatch, resetGame, shuffle, stopTimer, resetCardStyles, resetTimer } = require('../game');


beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("level-1.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();

});


describe('Memory Game Functions', () => {
    let mockCard1; 
    let mockCard2;
    let mockCards;
    let mockContainer;
    let mockShuffleFunction;

    beforeEach(() => {
        // Needed some mock elements to be able to properly test the flip card function - jest.fn info found here (https://jestjs.io/docs/mock-functions)
        mockCard1 = { classList: { add: jest.fn() }, setAttribute: jest.fn(), getAttribute: jest.fn(() => '1') };
        mockCard2 = { classList: { add: jest.fn(), remove: jest.fn() }, setAttribute: jest.fn(), getAttribute: jest.fn(() => '2') };
        mockElement = { textContent: '' };
    });


    test('flipCard should flip the selected card', () => {
        flipCard.call(mockCard1);
        expect(mockCard1.classList.add).toHaveBeenCalledWith('card-flipped');
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

describe('resetGameTests', () => {
    let mockCard;
    let mockIndex;
    let milliseconds;
    let seconds;
    let minutes;

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
      timerInterval = setInterval(() => {}, 1000);
      document.getElementById('timer').textContent = `05:30:100`;
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

  });

