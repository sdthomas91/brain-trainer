/**
 * @jest-environment jsdom
 */
// Issue regarding testing due to incorrect config - https://stackoverflow.com/questions/72013449/upgrading-jest-to-v29-error-test-environment-jest-environment-jsdom-cannot-be - 
// provided a solution on how to install jsdom

// Destructure the named export correctly
const { shuffleCards, startTimer, flipCard, checkForMatch, resetGame, shuffle } = require('../game');



beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("level-1.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();

});

describe('Memory Game Functions', () => {
    let mockCard1, mockCard2, mockClearInterval, mockShuffleCards;


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
    
      
      
});
