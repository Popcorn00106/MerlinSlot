// Initial Variables
let coinCount = 1000;
const diceSets = {
    "very easy": [9, 9, 9, 9, 9, 9, 9, 9, 9],
    "easy": [18, 18, 18, 18, 18, 18, 18, 18, 18],
    "possible": [36, 36, 36, 36, 36, 36, 36, 36, 36],
    "hard": [72, 72, 72, 72, 72, 72, 72, 72, 72],
    "very hard": [144, 144, 144, 144, 144, 144, 144, 144, 144]
};
const symbols = ['M', 'A', 'E', 'C', 'D', 'S', 'P', 'G', 'L'];
const payouts = {
    'M': 500, // Merlin (highest)
    'A': 400,
    'E': 300,
    'C': 250,
    'D': 200,
    'S': 150,
    'P': 100,
    'G': 75,
    'L': 50
};

// Spin Results
let currentSpinResult = [];

// Elements
const tiles = document.querySelectorAll('.tile');
const coinDisplay = document.getElementById('coin-count');
const refillButton = document.getElementById('refill-coins');
const clearMemoryButton = document.getElementById('clear-memory');
const spinButtons = document.querySelectorAll('.spin-button');
const questionElement = document.getElementById('question');

// Adventure history
let adventureHistory = [];

// Achievements tracking
let achievements = {
    freeGamesWon: 0,
    jackpotsWon: 0,
    totalCoinsEarned: 0
};

// Update the coin display
function updateCoinDisplay() {
    coinDisplay.textContent = coinCount;
}

// Refill coins
refillButton.addEventListener('click', function() {
    coinCount += 250;
    updateCoinDisplay();
});

// Clear memory and reset game
clearMemoryButton.addEventListener('click', function() {
    if (confirm('Are you sure you want to reset your progress?')) {
        localStorage.clear();
        coinCount = 1000;
        totalLosses = 0;
        updateCoinDisplay();
        alert('Game has been reset!');
    }
});

// Roll dice and assign symbols based on the chosen dice set
function rollDice(diceFaces) {
    let result = [];
    for (let i = 0; i < 9; i++) {
        const randomValue = Math.floor(Math.random() * diceFaces[i]) + 1;
        result.push(symbols[(randomValue - 1) % symbols.length]); // Assign a symbol based on dice roll
    }
    return result;
}

// Update grid with the spin result
function updateGrid(spinResult) {
    tiles.forEach((tile, index) => {
        tile.classList.add('animate'); // Add animation class
        setTimeout(() => {
            tile.textContent = spinResult[index];
            tile.classList.remove('animate'); // Remove animation after update
        }, 1000); // Animation duration
    });
}

// Check for winning combinations
function checkForWin(spinResult) {
    const winLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    let totalPayout = 0;
    let freeGames = 0;

    winLines.forEach(line => {
        const [a, b, c] = line;
        if (spinResult[a] === spinResult[b] && spinResult[b] === spinResult[c]) {
            totalPayout += payouts[spinResult[a]];
            freeGames += 8;
        }
    });

    return { totalPayout, freeGames };
}

// Handle a spin
function handleSpin(difficulty) {
    if (coinCount <= 0) {
        alert("You don't have enough coins to spin. Please refill your coins.");
        return;
    }

    // Deduct the cost of a spin (for example 50 coins per spin)
    coinCount -= 50;
    updateCoinDisplay();

    // Get the corresponding dice set based on difficulty
    const diceFaces = diceSets[difficulty];

    // Roll the dice and get the result
    currentSpinResult = rollDice(diceFaces);

    // Update the grid
    updateGrid(currentSpinResult);

    // Check if there's a win
    const { totalPayout, freeGames } = checkForWin(currentSpinResult);

    // Update coin count with payout
    if (totalPayout > 0) {
        coinCount += totalPayout;
        achievements.totalCoinsEarned += totalPayout;
        alert(`You won ${totalPayout} coins!`);
    }

    // Check for free games
    if (freeGames > 0) {
        achievements.freeGamesWon += freeGames;
        alert(`You won ${freeGames} free games!`);

        // Automatically spin free games
        handleFreeGames(freeGames);
    }

    checkAchievements();
}

// Handle free games
function handleFreeGames(freeGames) {
    let gamesLeft = freeGames;
    let freeGameInterval = setInterval(() => {
        if (gamesLeft <= 0) {
            clearInterval(freeGameInterval);
            alert('All free games completed!');
            return;
        }
        // Perform a free spin
        currentSpinResult = rollDice(diceSets['very easy']); // Example: free games use the "very easy" dice set
        updateGrid(currentSpinResult);

        const { totalPayout } = checkForWin(currentSpinResult);
        if (totalPayout > 0) {
            coinCount += totalPayout;
            alert(`During free games, you won ${totalPayout} coins!`);
        }

        gamesLeft--;
    }, 2000); // Free game spin every 2 seconds
}

// Assign random difficulties to spin buttons and add click listeners
function assignSpinButtonDifficulties() {
    const difficulties = ["very easy", "easy", "possible", "hard", "very hard"];
    spinButtons.forEach((button, index) => {
        // Randomly assign difficulty for each button
        const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

        button.addEventListener('click', function() {
            handleSpin(difficulty);
        });
    });
}

// Update the question (this can be extended to pull random questions dynamically)
function updateQuestion() {
    const questions = [
        "You are on a journey to meet Merlin. What path do you choose?",
        "Choose your quest: Will you go over the mountain or cross the river?",
        "Your path is set before you. Which will you choose?",
        "A great adventure lies ahead. Select your direction wisely.",
        "Which route will you take to reach Camelot?"
    ];

    let nextQuestion = questions[Math.floor(Math.random() * questions.length)];
    adventureHistory.push(nextQuestion); // Track chosen questions
    questionElement.textContent = nextQuestion;
}

// Initialize the game
function initializeGame() {
    updateCoinDisplay();
    assignSpinButtonDifficulties();
    updateQuestion();
}

// Check achievements and reward
function checkAchievements() {
    if (achievements.freeGamesWon >= 10) {
        alert("Achievement Unlocked: Free Spin Master! You've won 10 free games!");
        coinCount += 200; // Reward player with bonus coins
    }
    if (achievements.jackpotsWon >= 5) {
        alert("Achievement Unlocked: Jackpot Legend! You've won 5 jackpots!");
    }
}

// Start the game
initializeGame();
