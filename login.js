const pb = new PocketBase('https://beersmart.life');

// Function to handle form submission and login logic
function handleLoginFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    pb.collection('users').authWithPassword(username, password)
    .then(authData => {
        // Login successful, redirect to game page or perform necessary actions
        alert('Login successful!');
        window.location.href = 'game.html'; // Redirect to game page after successful login
    })
    .catch(error => {
        console.error('Login failed:', error);
        document.getElementById('loginMessage').textContent = 'Login failed. Please check your username and password.';
    });
}

// Event listener for form submission
document.getElementById('loginForm').addEventListener('submit', handleLoginFormSubmit);