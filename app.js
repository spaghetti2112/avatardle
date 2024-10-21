const characters = [
    { name: "aang", bending: "airbender/Avatar", origin: "Southern Air Temple", appearance: "ATLA" },
    { name: "katara", bending: "waterbender", origin: "Southern Water Tribe", appearance: "ATLA" },
    { name: "zuko", bending: "firebender", origin: "Fire Nation", appearance: "ATLA" },
    { name: "toph", bending: "earthbender", origin: "Earth Kingdom", appearance: "ATLA" },
    { name: "korra", bending: "waterbender/Avatar", origin: "Southern Water Tribe", appearance: "LoK" },
    { name: "mako", bending: "firebender", origin: "Republic City", appearance: "LoK" },
    { name: "bolin", bending: "earthbender (lavabender)", origin: "Republic City", appearance: "LoK" }
];

// Function to get the daily character
const today = new Date().toISOString().split('T')[0];
const seed = new Date().getDate();
let chosenCharacter = characters[seed % characters.length];

// Enable input field if no guess has been made today
if (localStorage.getItem('lastPlayed') === today) {
    document.getElementById('guess-input').disabled = true;
    document.getElementById('submit-guess').disabled = true;
    document.getElementById('feedback').textContent = `You already guessed today! The character was ${chosenCharacter.name.toUpperCase()}.`;
} else {
    document.getElementById('guess-input').disabled = false;
    document.getElementById('submit-guess').disabled = false;
}

// Display clues about the character
document.getElementById('bending').textContent = `Bending: ${chosenCharacter.bending}`;
document.getElementById('origin').textContent = `Origin: ${chosenCharacter.origin}`;
document.getElementById('appearance').textContent = `First Appearance: ${chosenCharacter.appearance}`;

// Add event listener for the guess submission
document.getElementById('submit-guess').addEventListener('click', () => {
    let guess = document.getElementById('guess-input').value.toLowerCase();

    // Check if the guess is correct
    if (guess === chosenCharacter.name) {
        document.getElementById('feedback').textContent = `Congratulations! You guessed the character: ${chosenCharacter.name.toUpperCase()}!`;
    } else {
        document.getElementById('feedback').textContent = `Incorrect! The character was ${chosenCharacter.name.toUpperCase()}.`;
    }

    // Store in localStorage to prevent further guesses today
    localStorage.setItem('lastPlayed', today);
    document.getElementById('guess-input').disabled = true; // Disable input after guess
    document.getElementById('submit-guess').disabled = true;

    updateGrid(guess, chosenCharacter.name);
});

// Update grid to provide Wordle-like feedback
function updateGrid(guess, name) {
    let grid = document.getElementById('grid');
    grid.innerHTML = ''; // Clear the grid before updating

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
        grid.appendChild(tile);
    }
}