/**
 * @jest-environment jsdom
 */
// Issue regarding testing due to incorrect config - https://stackoverflow.com/questions/72013449/upgrading-jest-to-v29-error-test-environment-jest-environment-jsdom-cannot-be - 
// provided a solution on how to install jsdom

// Destructure the named export correctly
const { shuffleCards, flipCard } = require('../script');

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("level-1.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
});

describe('Memory Game Functions', () => {
    let mockCard1, mockCard2, mockElement;

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

    // Shuffle Cards Test (including steps taken as first test written)
    test('shuffleCards should shuffle the cards randomly', () => {
        // Run test to ensure order before shuffling does not match order after shuffling
        // Generate mock array 
        const cards = Array.from({ length: 10 }, (_, index) => ({ style: { order: index } }));
        // Get pre-shuffle order
        const initialOrders = cards.map(card => card.style.order);
        // Shuffle cards
        shuffleCards(cards);
        // Get post-shuffle order
        const shuffledOrders = cards.map(card => card.style.order);
        // Custom comparison logic for randomness
        let isDifferent = false;
        for (let i = 0; i < initialOrders.length; i++) {
            if (initialOrders[i] !== shuffledOrders[i]) {
                isDifferent = true;
                break;
            }
        }

        // Expect statement
        expect(isDifferent).toBe(true);

        // RGR - Initial test failed due to the shuffle being random to the extent that it could end up with the same order as the previous shuffle - especially as it's such a short value.
        // Changes made to shuffle function and retested - changed logic in shuffle function using 
        // similar logic to https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

    });
});