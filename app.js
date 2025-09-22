import { characters } from './data/characters.js';

// Function to select the daily character
const today = new Date().toISOString().split('T')[0];
const seed = new Date().getDate();
let chosenCharacter = characters[seed % characters.length];

// Populate the hints
document.getElementById('bending').textContent = `Bending: ${chosenCharacter.bending}`;
document.getElementById('origin').textContent = `Origin: ${chosenCharacter.origin}`;
document.getElementById('appearance').textContent = `First Appearance: ${chosenCharacter.appearance}`;

// Check if the user has already guessed today
if (localStorage.getItem('lastPlayed') === today) {
    document.getElementById('feedback').textContent = `You already guessed today! The character was ${chosenCharacter.name.toUpperCase()}.`;
    document.getElementById('guess-input').disabled = true;
    document.getElementById('submit-guess').disabled = true;
} else {
    document.getElementById('submit-guess').addEventListener('click', () => {
        let guess = document.getElementById('guess-input').value.toLowerCase();

        // Check if guess is correct
        if (guess === chosenCharacter.name) {
            document.getElementById('feedback').textContent = `Congratulations! You guessed the character: ${chosenCharacter.name.toUpperCase()}!`;
        } else {
            document.getElementById('feedback').textContent = `Incorrect! The character was ${chosenCharacter.name.toUpperCase()}.`;
        }

        // Disable further guesses for today
        localStorage.setItem('lastPlayed', today);
        document.getElementById('guess-input').disabled = true;
        document.getElementById('submit-guess').disabled = true;

        // Update grid to show Wordle-like feedback
        updateGrid(guess, chosenCharacter.name);
    });
}

function updateGrid(guess, name) {
    let grid = document.getElementById('grid');
    let row = document.createElement('div');
    row.className = 'grid-row';

    // Create Wordle-like feedback
    for (let i = 0; i < name.length; i++) {
        let tile = document.createElement('div');
        tile.classList.add('tile');

        if (guess[i] === name[i]) {
            tile.classList.add('correct'); // Correct letter, correct position
        } else if (name.includes(guess[i])) {
            tile.classList.add('present'); // Correct letter, wrong position
        } else {
            tile.classList.add('absent'); // Incorrect letter
        }

        tile.textContent = guess[i] ? guess[i].toUpperCase() : '_';
        row.appendChild(tile);
    }

    grid.appendChild(row);
}

// Share results functionality
document.getElementById('share-results').addEventListener('click', () => {
    const result = `I guessed the Avatar character! It was ${chosenCharacter.name.toUpperCase()}. Play at [Your Game URL]`;
    navigator.clipboard.writeText(result).then(() => {
        alert('Results copied to clipboard!');
    });
});
