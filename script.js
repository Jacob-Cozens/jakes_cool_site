const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const ranks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

let userChips = 1000;
let aiChips = 1000;
let pot = 0;

let userHand = [];
let aiHand = [];
let communityCards = [];

function initializeGame() {
  userHand = drawCards(2);
  aiHand = drawCards(2);
  communityCards = drawCards(5);
  pot = 0;
  updateUI();
}

function resetGame() {
  userHand = [];
  aiHand = [];
  communityCards = [];
  pot = 0;
  userChips = 1000;
  aiChips = 1000;
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
  document.getElementById("user-hand").innerText = displayHand(userHand);
  document.getElementById("ai-hand").innerText = displayHand(aiHand);
  document.getElementById("community-cards").innerText =
    displayHand(communityCards);
  document.getElementById("user-chips").innerText = `Chips: ${userChips}`;
  document.getElementById("ai-chips").innerText = `Chips: ${aiChips}`;
  document.getElementById("status").innerText = `Pot: ${pot}`;
}

function displayHand(hand) {
  return hand.map((card) => `${card.rank} of ${card.suit}`).join(", ");
}

function bet(amount) {
  if (userChips >= amount) {
    userChips -= amount;
    pot += amount;
    updateUI();
    aiBet();
  } else {
    alert("Not enough chips to bet!");
  }
}

function aiBet() {
  const aiBetAmount = Math.floor(Math.random() * 100);
  if (aiChips >= aiBetAmount) {
    aiChips -= aiBetAmount;
    pot += aiBetAmount;
  }
  updateUI();
}

document.getElementById("bet-button").addEventListener("click", () => {
  const betAmount = parseInt(document.getElementById("bet-amount").value, 10);
  if (!isNaN(betAmount) && betAmount > 0) {
    bet(betAmount);
    document.getElementById("bet-amount").value = "";
  } else {
    alert("Please enter a valid bet amount.");
  }
});

document.getElementById("fold-button").addEventListener("click", () => {
  alert("You folded!");
  resetGame();
});

document
  .getElementById("play-button")
  .addEventListener("click", initializeGame);

window.onload = initializeGame;
