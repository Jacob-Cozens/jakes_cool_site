const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let userHand = [];
let aiHand = [];
let communityCards = [];

function initializeGame() {
    userHand = drawCards(2);
    aiHand = drawCards(2);
    communityCards = drawCards(5);
    updateUI();
}

function drawCards(num) {
    let deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ rank, suit });
        }
    }
    deck = deck.sort(() => Math.random() - 0.5);
    return deck.slice(0, num);
}

function updateUI() {
    document.getElementById('user-hand').innerText = displayHand(userHand);
    document.getElementById('ai-hand').innerText = displayHand(aiHand);
    document.getElementById('community-cards').innerText = displayHand(communityCards);
}

function displayHand(hand) {
    return hand.map(card => `${card.rank} of ${card.suit}`).join(', ');
}

document.getElementById('play-button').addEventListener('click', () => {
    initializeGame();
});

// Initialize the game on page load
window.onload = initializeGame;