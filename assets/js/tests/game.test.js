/**
 * @jest-environment jsdom
 */
// Issue regarding testing due to incorrect config - https://stackoverflow.com/questions/72013449/upgrading-jest-to-v29-error-test-environment-jest-environment-jsdom-cannot-be - 
// provided a solution on how to install jsdom

// Destructure the named export correctly
const { shuffleCards } = require('../script');

describe('Memory Game Functions', () => {
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
        //  Expect statement
        expect(shuffledOrders).not.toEqual(initialOrders);

        // RGR - Initial test failed due to the shuffle being random to the extent that it could end up with the same order as the previous shuffle - especially as it's such a short value.
        // Changes made to shuffle function and retested 
    });
});