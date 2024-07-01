const pb = new PocketBase('https://beersmart.life');
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