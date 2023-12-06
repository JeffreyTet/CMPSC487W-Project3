// app.js

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send a request to the backend to authenticate the user
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.role) {
                redirectToRolePage(data.role);
            } else {
                alert('Login failed. Please check your credentials.');
            }
        })
        .catch(error => console.error('Error:', error));
}

function redirectToRolePage(role) {
    switch (role) {
        case 'maintenance':
            window.location.href = 'C:\Users\Jeff\source\repos\CMPSC487-Project_3\maintenance.html';
            break;
        case 'tenant':
            window.location.href = 'C:\Users\Jeff\source\repos\CMPSC487-Project_3\tenant.html';
            break;
        case 'manager':
            window.location.href = 'C:\Users\Jeff\source\repos\CMPSC487-Project_3\manager.html';
            break;
        default:
            console.error('Invalid role:', role);
    }
}

// Attach event listener to the login button
document.getElementById('login-btn').addEventListener('click', login);
