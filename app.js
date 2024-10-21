const characters = [
    { name: "aang", bending: "airbender/Avatar", origin: "Southern Air Temple", appearance: "ATLA" },
    { name: "katara", bending: "waterbender", origin: "Southern Water Tribe", appearance: "ATLA" },
    { name: "zuko", bending: "firebender", origin: "Fire Nation", appearance: "ATLA" },
    { name: "toph", bending: "earthbender", origin: "Earth Kingdom", appearance: "ATLA" },
    { name: "sokka", bending: "non-bender", origin: "Southern Water Tribe", appearance: "ATLA" },
    { name: "iroh", bending: "firebender", origin: "Fire Nation", appearance: "ATLA" },
    { name: "korra", bending: "waterbender/Avatar", origin: "Southern Water Tribe", appearance: "LoK" },
    { name: "mako", bending: "firebender", origin: "Republic City", appearance: "LoK" },
    { name: "bolin", bending: "earthbender", origin: "Republic City", appearance: "LoK" },
    { name: "asami", bending: "non-bender", origin: "Republic City", appearance: "LoK" },
    { name: "lin", bending: "earthbender (metal)", origin: "Republic City", appearance: "LoK" },
    { name: "tenzin", bending: "airbender", origin: "Republic City", appearance: "LoK" }
];

// Function to get today's character using date
function getCharacterOfTheDay(date) {
    const hash = [...date].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return characters[hash % characters.length];
}

const today = new Date().toISOString().split('T')[0]; // Get current date (e.g., '2024-10-21')
const chosenCharacter = getCharacterOfTheDay(today);

// Check if user has already guessed today
const gameState = JSON.parse(localStorage.getItem('avatarleState')) || {};

if (gameState[today] && gameState[today].hasPlayed) {
    document.getElementById('feedback').textContent = `You've already played today! The character was ${chosenCharacter.name.toUpperCase()}.`;
    document.getElementById('guess-input').disabled = true;
    document.getElementById('submit-guess').disabled = true;
} else {
    // Show hints
    document.getElementById('bending-hint').textContent = `Bending: ${chosenCharacter.bending}`;
    document.getElementById('origin-hint').textContent = `Origin: ${chosenCharacter.origin}`;
    document.getElementById('appearance-hint').textContent = `First Appearance: ${chosenCharacter.appearance}`;

    // Handle guess submission
    document.getElementById('submit-guess').addEventListener('click', () => {
        let guess = document.getElementById('guess-input').value.toLowerCase();
        let feedback = '';

        if (guess === chosenCharacter.name) {
            feedback = `Correct! The character was ${chosenCharacter.name.toUpperCase()}!`;
        } else {
            feedback = `Incorrect! The character was ${chosenCharacter.name.toUpperCase()}. Try again tomorrow!`;
        }

        // Update feedback and store the state
        document.getElementById('feedback').textContent = feedback;
        gameState[today] = { hasPlayed: true, guess: guess };
        localStorage.setItem('avatarleState', JSON.stringify(gameState));

        // Disable the input and button after a guess
        document.getElementById('guess-input').disabled = true;
        document.getElementById('submit-guess').disabled = true;
    });
}