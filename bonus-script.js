// Get elements
const freeGamesCountElement = document.getElementById('games-left');
const coinCountElement = document.getElementById('bonus-coin-count');
const returnMainButton = document.getElementById('return-main');
const bonusGrid = document.querySelector('.bonus-grid');

// Load bank and game state from localStorage
let freeGamesRemaining = parseInt(localStorage.getItem('freeGames')) || 8;
let coinCount = parseInt(localStorage.getItem('coinCount')) || 0;
let totalLosses = parseInt(localStorage.getItem('totalLosses')) || 0;

// Update free games and coins on screen
freeGamesCountElement.textContent = freeGamesRemaining;
coinCountElement.textContent = coinCount;

// Symbols array
const symbols = ['M', 'A', 'E', 'C', 'D', 'S', 'P', 'G', 'L'];

// Roll dice and scatter symbols
function rollBonusDice() {
    bonusGrid.innerHTML = ''; // Clear previous symbols

    const rolledSymbols = [];
    for (let i = 0; i < 9; i++) {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        rolledSymbols.push(randomSymbol);
        scatterSymbol(randomSymbol);
    }

    // Check if all 9 symbols match for jackpot
    checkForJackpot(rolledSymbols);
}

// Scatter a symbol randomly in the bonus grid
function scatterSymbol(symbol) {
    const symbolElement = document.createElement('div');
    symbolElement.classList.add('scattered-symbol');
    symbolElement.textContent = symbol;
    symbolElement.style.position = 'absolute';
    symbolElement.style.top = `${Math.random() * 90}%`;
    symbolElement.style.left = `${Math.random() * 90}%`;
    symbolElement.style.fontSize = '2rem';
    bonusGrid.appendChild(symbolElement);
}

// Check for jackpot (9 matching symbols)
function checkForJackpot(rolledSymbols) {
    const allMatch = rolledSymbols.every(symbol => symbol === rolledSymbols[0]);

    if (allMatch) {
        const jackpotAmount = totalLosses * 0.5; // 50% of total losses
        coinCount += jackpotAmount;
        bonusGrid.classList.add('flash'); // Flash the bonus grid
        alert(`Jackpot! You won ${jackpotAmount} coins!`);

        // Remove flash effect after 3 seconds
        setTimeout(() => bonusGrid.classList.remove('flash'), 3000);
    }
}

// Perform free spins in the bonus game
function performFreeSpin() {
    if (freeGamesRemaining > 0) {
        rollBonusDice();
        freeGamesRemaining--;
        freeGamesCountElement.textContent = freeGamesRemaining;
        localStorage.setItem('freeGames', freeGamesRemaining); // Update storage

        if (freeGamesRemaining === 0) {
            alert('All free games completed! Returning to the main game.');
            returnToMainGame();
        }
    }
}

// Return to the main game and update the bank
function returnToMainGame() {
    localStorage.setItem('coinCount', coinCount);
    localStorage.setItem('freeGames', 0); // Reset free games
    window.location.href = 'index.html'; // Redirect back to the main game
}

// Automatically start free spins
let freeSpinInterval = setInterval(performFreeSpin, 2000); // Spin every 2 seconds

// Return to main game button
returnMainButton.addEventListener('click', function() {
    clearInterval(freeSpinInterval); // Stop the spins if the player returns manually
    returnToMainGame();
});
