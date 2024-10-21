const characters = [
    // ATLA Characters
    { name: "aang", bending: "airbender/Avatar", origin: "Southern Air Temple", appearance: "ATLA" },
    { name: "katara", bending: "waterbender", origin: "Southern Water Tribe", appearance: "ATLA" },
    { name: "zuko", bending: "firebender", origin: "Fire Nation", appearance: "ATLA" },
    { name: "toph", bending: "earthbender", origin: "Earth Kingdom", appearance: "ATLA" },
    { name: "sokka", bending: "non-bender", origin: "Southern Water Tribe", appearance: "ATLA" },
    { name: "iroh", bending: "firebender", origin: "Fire Nation", appearance: "ATLA" },
    { name: "azula", bending: "firebender (lightning)", origin: "Fire Nation", appearance: "ATLA" },
    // LoK Characters
    { name: "korra", bending: "waterbender/Avatar", origin: "Southern Water Tribe", appearance: "LoK" },
    { name: "mako", bending: "firebender", origin: "Republic City", appearance: "LoK" },
    { name: "bolin", bending: "earthbender (lavabender)", origin: "Republic City", appearance: "LoK" },
    { name: "asami", bending: "non-bender", origin: "Republic City", appearance: "LoK" },
    { name: "lin", bending: "earthbender (metal)", origin: "Republic City", appearance: "LoK" },
    { name: "tenzin", bending: "airbender", origin: "Republic City", appearance: "LoK" }
];

let chosenCharacter = characters[Math.floor(Math.random() * characters.length)];
let attempts = 6;

document.getElementById('bending').textContent = `Bending: ${chosenCharacter.bending}`;
document.getElementById('origin').textContent = `Origin: ${chosenCharacter.origin}`;
document.getElementById('appearance').textContent = `First Appearance: ${chosenCharacter.appearance}`;

document.getElementById('submit-guess').addEventListener('click', () => {
    let guess = document.getElementById('guess-input').value.toLowerCase();
    let feedback = '';

    if (guess === chosenCharacter.name) {
        feedback = `Congratulations! You guessed the character: ${chosenCharacter.name.toUpperCase()}!`;
    } else {
        feedback = checkGuess(guess, chosenCharacter.name);
        attempts--;
        document.getElementById('attempts-left').textContent = `Attempts left: ${attempts}`;
    }

    document.getElementById('feedback').textContent = feedback;

    if (attempts === 0 && guess !== chosenCharacter.name) {
        document.getElementById('feedback').textContent = `Out of attempts! The character was ${chosenCharacter.name.toUpperCase()}.`;
    }
});

function checkGuess(guess, name) {
    let feedback = [];
    for (let i = 0; i < name.length; i++) {
        if (guess[i] === name[i]) {
            feedback.push(guess[i].toUpperCase());  // Correct letter in the correct position
        } else if (name.includes(guess[i])) {
            feedback.push(guess[i].toLowerCase());  // Correct letter in the wrong position
        } else {
            feedback.push('_');  // Incorrect letter
        }
    }
    return feedback.join(' ');
}
