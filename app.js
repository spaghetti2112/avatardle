const characters = [
    { name: "aang", bending: "airbender/Avatar", origin: "Southern Air Temple", appearance: "ATLA" },
    { name: "katara", bending: "waterbender", origin: "Southern Water Tribe", appearance: "ATLA" },
    { name: "zuko", bending: "firebender", origin: "Fire Nation", appearance: "ATLA" },
    { name: "toph", bending: "earthbender", origin: "Earth Kingdom", appearance: "ATLA" },
    { name: "korra", bending: "waterbender/Avatar", origin: "Southern Water Tribe", appearance: "LoK" },
    { name: "mako", bending: "firebender", origin: "Republic City", appearance: "LoK" },
    { name: "bolin", bending: "earthbender (lavabender)", origin: "Republic City", appearance: "LoK" }
];

const today = new Date().toISOString().split('T')[0];
const seed = new Date().getDate(); // Use the date to pick the daily character

let chosenCharacter = characters[seed % characters.length];
let attempts = 1; // Only one guess allowed per day

// Check if the user already played today
if (localStorage.getItem('lastPlayed') === today) {
    document.getElementById('feedback').textContent = `You already guessed today! The character was ${chosenCharacter.name.toUpperCase()}.`;
} else {
    document.getElementById('guess-input').disabled = false;
    document.getElementById('submit-guess').disabled = false;
}

document.getElementById('bending').textContent = `Bending: ${chosenCharacter.bending}`;
document.getElementById('origin').textContent = `Origin: ${chosenCharacter.origin}`;
document.getElementById('appearance').textContent = `First Appearance: ${chosenCharacter.appearance}`;

document.getElementById('submit-guess').addEventListener('click', () => {
    let guess = document.getElementById('guess-input').value.toLowerCase();
    if (guess === chosenCharacter.name) {
        document.getElementById('feedback').textContent = `Congratulations! You guessed the character: ${chosenCharacter.name.toUpperCase()}!`;
    } else {
        document.getElementById('feedback').textContent = `Incorrect! The character was ${chosenCharacter.name.toUpperCase()}.`;
    }

    localStorage.setItem('lastPlayed', today); // Mark as played for today
    document.getElementById('guess-input').disabled = true;
    document.getElementById('submit-guess').disabled = true;
    updateGrid(guess, chosenCharacter.name);
});

function updateGrid(guess, name) {
    let grid = document.getElementById('grid');
    grid.innerHTML = ''; // Clear the grid before updating

    for (let i = 0; i < guess.length; i++) {
        let tile = document.createElement('div');
        tile.classList.add('tile');

        if (guess[i] === name[i]) {
            tile.classList.add('correct'); // Green tile for correct letter
        } else if (name.includes(guess[i])) {
            tile.classList.add('present'); // Yellow tile for correct letter in wrong place
        } else {
            tile.classList.add('absent'); // Gray tile for incorrect letter
        }

        tile.textContent = guess[i].toUpperCase();
        grid.appendChild(tile);
    }
}


        // Disable the input and button after a guess
        document.getElementById('guess-input').disabled = true;
        document.getElementById('submit-guess').disabled = true;
    });
}
