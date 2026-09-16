const passwordInput = document.getElementById("password");

const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");

const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

const message = document.getElementById("message");


const CHARACTERS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};


function randomCharacter(characters) {

    const randomArray = new Uint32Array(1);

    crypto.getRandomValues(randomArray);

    return characters[randomArray[0] % characters.length];
}


function secureShuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const randomArray = new Uint32Array(1);

        crypto.getRandomValues(randomArray);

        const j = randomArray[0] % (i + 1);

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}


function generatePassword() {

    const length = Number(lengthSlider.value);

    let availableCharacters = "";
    let requiredCharacters = [];


    if (uppercaseCheckbox.checked) {

        availableCharacters += CHARACTERS.uppercase;

        requiredCharacters.push(
            randomCharacter(CHARACTERS.uppercase)
        );
    }


    if (lowercaseCheckbox.checked) {

        availableCharacters += CHARACTERS.lowercase;

        requiredCharacters.push(
            randomCharacter(CHARACTERS.lowercase)
        );
    }


    if (numbersCheckbox.checked) {

        availableCharacters += CHARACTERS.numbers;

        requiredCharacters.push(
            randomCharacter(CHARACTERS.numbers)
        );
    }


    if (symbolsCheckbox.checked) {

        availableCharacters += CHARACTERS.symbols;

        requiredCharacters.push(
            randomCharacter(CHARACTERS.symbols)
        );
    }


    if (availableCharacters.length === 0) {

        passwordInput.value = "";

        message.textContent =
            "Select at least one character type.";

        strengthText.textContent = "—";

        strengthBar.style.width = "0%";

        return;
    }


    if (length < requiredCharacters.length) {

        message.textContent =
            "Password length is too short for the selected options.";

        return;
    }


    message.textContent = "";


    let passwordCharacters = [...requiredCharacters];


    while (passwordCharacters.length < length) {

        passwordCharacters.push(
            randomCharacter(availableCharacters)
        );
    }


    passwordCharacters = secureShuffle(passwordCharacters);


    const password = passwordCharacters.join("");

    passwordInput.value = password;

    updateStrength(password);
}


function updateStrength(password) {

    let score = 0;


    if (password.length >= 8)
        score++;

    if (password.length >= 12)
        score++;

    if (password.length >= 16)
        score++;

    if (/[A-Z]/.test(password))
        score++;

    if (/[a-z]/.test(password))
        score++;

    if (/[0-9]/.test(password))
        score++;

    if (/[^A-Za-z0-9]/.test(password))
        score++;


    let percentage = Math.min(
        100,
        (score / 7) * 100
    );


    strengthBar.style.width = percentage + "%";


    if (score <= 2) {

        strengthText.textContent = "Weak";

    } else if (score <= 4) {

        strengthText.textContent = "Medium";

    } else if (score <= 5) {

        strengthText.textContent = "Strong";

    } else {

        strengthText.textContent = "Very Strong";
    }
}

async function copyPassword() {

    const password = passwordInput.value;

    if (!password) {
        message.textContent = "Generate a password first.";
        return;
    }

    try {

        await navigator.clipboard.writeText(password);

        message.textContent = "Password copied!";

    } catch (error) {

        passwordInput.select();
        passwordInput.setSelectionRange(0, password.length);

        document.execCommand("copy");

        message.textContent = "Password copied!";
    }
}


lengthSlider.addEventListener("input", () => {

    lengthValue.textContent = lengthSlider.value;

});


generateBtn.addEventListener(
    "click",
    generatePassword
);


copyBtn.addEventListener(
    "click",
    copyPassword
);


generatePassword();
