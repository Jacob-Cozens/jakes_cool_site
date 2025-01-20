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

function resetGame() {
  pot = 0;
  userChips = 1000; // reset chips for demonstration
  aiChips = 1000; // reset AI chips for demonstration
  userHand = drawCards(2);
  aiHand = drawCards(2);
  communityCards = [];
  userBetAmount = 0;
  aiBetAmount = 0;
  bettingRound = false;
  updateUI();
}

function initializeGame() {
  resetGame();
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
  document.getElementById("ai-hand").innerText = "AI's Hand is Hidden"; // AI's hand is hidden
  document.getElementById("community-cards").innerText = bettingRound
    ? displayHand(communityCards)
    : "Community cards are hidden until betting complete.";
  document.getElementById("user-chips").innerText = `Chips: ${userChips}`;
  document.getElementById("ai-chips").innerText = `Chips: ${aiChips}`;
  document.getElementById(
    "status"
  ).innerText = `Pot: ${pot} | Your Bet: ${userBetAmount} | AI Bet: ${aiBetAmount}`;
}

function displayHand(hand) {
  return hand.map((card) => `${card.rank} of ${card.suit}`).join(", ");
}

function bet(amount) {
  if (userChips >= amount) {
    userChips -= amount;
    pot += amount;
    userBetAmount += amount;
    updateUI();

    // Simulate AI betting after user bets
    aiBet();
  } else {
    alert("Not enough chips to bet!");
  }
}

function aiBet() {
  if (aiChips > userBetAmount) {
    aiBetAmount = userBetAmount; // AI matches the user's bet
    aiChips -= aiBetAmount;
    pot += aiBetAmount;
  } else {
    alert("AI folds!");
    resetGame(); // Reset if AI folds for simplicity
    return;
  }

  // End betting round if both players have bet the same amount
  if (userBetAmount === aiBetAmount) {
    bettingRound = true;
    communityCards = drawCards(5); // Deal community cards now that betting is completed
    updateUI();
  }
}

document.getElementById("bet-button").addEventListener("click", () => {
  const betAmount = parseInt(document.getElementById("bet-amount").value, 10);
  if (!isNaN(betAmount) && betAmount > 0) {
    if (!bettingRound) {
      bet(betAmount);
      document.getElementById("bet-amount").value = ""; // Clear input
    } else {
      alert("Betting is over, the community cards are revealed!");
    }
  } else {
    alert("Please enter a valid bet amount.");
  }
});

document.getElementById("fold-button").addEventListener("click", () => {
  alert("You folded! The AI wins.");
  resetGame();
});

document
  .getElementById("play-button")
  .addEventListener("click", initializeGame);

window.onload = initializeGame;
