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

const hands = [
  "High Card",
  "1 Pair",
  "2 Pair",
  "3 of a Kind",
  "Straight",
  "Flush",
  "Full House",
  "4 of a Kind",
  "Straight Flush",
  "Royal Flush",
];

var A = 14,
  K = 13,
  Q = 12,
  J = 11,
  _ = { "♠": 1, "♣": 2, "♥": 4, "♦": 8 };

// Function to rank the poker hand
function rankPokerHand(cs, ss) {
  var v,
    i,
    o,
    s =
      (1 << cs[0]) | (1 << cs[1]) | (1 << cs[2]) | (1 << cs[3]) | (1 << cs[4]);
  for (i = -1, v = o = 0; i < 5; i++, o = Math.pow(2, cs[i] * 4)) {
    v += o * (((v / o) & 15) + 1);
  }
  v = (v % 15) - (s / (s & -s) == 31 || s == 0x403c ? 3 : 1);
  v -= (ss[0] == (ss[1] | ss[2] | ss[3] | ss[4])) * (s == 0x7c00 ? -5 : 1);
  return v;
}

// Evaluate the best hand of a player
function evaluateHand(hand) {
  const handRanks = hand.map((card) => {
    const rankIndex = ranks.indexOf(card.rank) + 2; // +2 to make it 2-14
    return rankIndex > 14 ? A : rankIndex; // Make Ace 14
  });

  const handSuits = hand.map((card) => _[card.suit[0]]); // Convert suit to bit representation
  return rankPokerHand(handRanks, handSuits);
}

function resetGame() {
  pot = 0;
  userChips = 1000;
  aiChips = 1000;
  userHand = drawCards(2);
  aiHand = drawCards(2);
  communityCards = [];
  userBetAmount = 0;
  aiBetAmount = 0;
  bettingRound = false;
  updateUI();

  // Re-enable the betting buttons
  document.getElementById("bet-button").disabled = false;
  document.getElementById("fold-button").disabled = false;

  // Remove the new game button if it exists
  const newGameButton = document.getElementById("new-game-button");
  if (newGameButton) {
    newGameButton.remove();
  }
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

function displayAiHand(aiHand) {
  return aiHand.map((card) => `${card.rank} of ${card.suit}`).join(", ");
}

function updateUI() {
  document.getElementById("user-hand").innerText = displayHand(userHand);
  document.getElementById("ai-hand").innerText = bettingRound
    ? displayAiHand(aiHand)
    : "AI's Hand is Hidden";
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
    aiBet();
  } else {
    alert("Not enough chips to bet!");
  }
}

function aiBet() {
  if (aiChips > userBetAmount) {
    aiBetAmount = userBetAmount;
    aiChips -= aiBetAmount;
    pot += aiBetAmount;
  } else {
    alert("AI folds!");
    resetGame();
    return;
  }

  if (userBetAmount === aiBetAmount) {
    bettingRound = true;
    communityCards = drawCards(5);
    updateUI();
    determineWinner(); // Determine the winner after community cards are revealed
  }
}

function determineWinner() {
  const userEvaluatedHand = evaluateHand([...userHand, ...communityCards]);
  const aiEvaluatedHand = evaluateHand([...aiHand, ...communityCards]);

  const winnerMessage =
    userEvaluatedHand > aiEvaluatedHand
      ? "You win!"
      : aiEvaluatedHand > userEvaluatedHand
      ? "AI wins!"
      : "It's a tie!";

  // Show the results and the hands
  alert(winnerMessage);
  revealHands(); // Now reveal the hands and community cards
}

function revealHands() {
  // Display AI's hand and community cards
  document.getElementById("ai-hand").innerText = displayAiHand(aiHand);
  document.getElementById("community-cards").innerText =
    displayHand(communityCards);

  // Disable buttons to prevent further betting
  document.getElementById("bet-button").disabled = true;
  document.getElementById("fold-button").disabled = true;

  // Create a button to start a new game
  const newGameButton = document.createElement("button");
  newGameButton.innerText = "Start New Game";
  newGameButton.id = "new-game-button"; // Adding an ID to easily find it later
  newGameButton.addEventListener("click", resetGame);
  document.body.appendChild(newGameButton);
}

document.getElementById("bet-button").addEventListener("click", () => {
  const betAmount = parseInt(document.getElementById("bet-amount").value, 10);
  if (!isNaN(betAmount) && betAmount > 0) {
    if (!bettingRound) {
      bet(betAmount);
      document.getElementById("bet-amount").value = "";
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
