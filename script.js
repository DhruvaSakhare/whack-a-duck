const pb = new PocketBase('https://beersmart.life');


let score = 0;
let lastHole;
let timeUp = false;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let minTime = 200;
let maxTime = 1000;

// Function to handle form submission and registration logic
function handleRegistrationFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    pb.collection('users').create({ username, password })
    .then(newUser => {
        alert('Registration successful!');
        window.location.href = 'login.html'; // Redirect to login page after successful registration
    })
    .catch(error => {
        console.error('Registration failed:', error);
        document.getElementById('registrationMessage').textContent = 'Registration failed. Please try again.';
    });
}


// Event listener for form submission
document.getElementById('registrationForm').addEventListener('submit', handleRegistrationFormSubmit);


// Function to handle form submission and login logic
function handleLoginFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    pb.collection('users').authWithPassword(username, password)
    .then(authData => {
        // Login successful, redirect to game page or perform necessary actions
        alert('Login successful!');
        window.location.href = 'index.html'; // Redirect to game page after successful login
    })
    .catch(error => {
        console.error('Login failed:', error);
        document.getElementById('loginMessage').textContent = 'Login failed. Please check your username and password.';
    });
}

// Event listener for form submission
document.getElementById('loginForm').addEventListener('submit', handleLoginFormSubmit);


function setDifficulty() {
    const difficulty = document.getElementById('difficulty').value;
    switch(difficulty) {
        case '1':
            minTime = 600;
            maxTime = 1200;
            break;
        case '2':
            minTime = 400;
            maxTime = 1000;
            break;
        case '3':
            minTime = 200;
            maxTime = 800;
            break;
    }
}

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function peep() {
    const time = randomTime(minTime, maxTime);
    const hole = randomHole(document.querySelectorAll('.hole'));
    hole.querySelector('.duck').classList.add('up');
    setTimeout(() => {
        hole.querySelector('.duck').classList.remove('up');
        if (!timeUp) peep();
    }, time);
}

function startGame() {
    setDifficulty();
    score = 0;
    document.getElementById('score').textContent = score;
    timeUp = false;
    document.getElementById('startButton').disabled = true;
    peep();
    setTimeout(() => {
        timeUp = true;
        document.getElementById('startButton').disabled = false;
        saveScore();
    }, 15000);
}

function bonk(e) {
    if (!e.isTrusted) return;
    score++;
    this.classList.remove('up');
    document.getElementById('score').textContent = score;
    showImpact(e);
}

function showImpact(e) {
    const impact = document.createElement('div');
    impact.classList.add('impact');
    impact.style.left = `${e.clientX - 25}px`;
    impact.style.top = `${e.clientY - 25}px`;
    document.body.appendChild(impact);
    setTimeout(() => impact.remove(), 300);
}

async function saveScore() {
    const name = prompt('Enter your name:');
    if (!name) return;
    const record = {
        name: name,
        score: score
    };
    await pb.collection('scores').create(record);
    fetchLeaderboard();

}

async function fetchLeaderboard() {
    try {
        const result = await pb.collection('scores').getFullList({
            sort: '-score',
            limit: 10
        });
        leaderboard = result.map(record => ({ name: record.name, score: record.score }));
        displayLeaderboard();
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}

function displayLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = leaderboard.map(entry => `<li>${entry.name}: ${entry.score}</li>`).join('');
}

document.querySelectorAll('.duck').forEach(duck => duck.addEventListener('click', bonk));
document.getElementById('startButton').addEventListener('click', startGame);

fetchLeaderboard();

displayLeaderboard();
