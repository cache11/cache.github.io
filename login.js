// SIGNUP
function signup() {
    let firstName = document.getElementById("firstname").value.trim();
    let lastName = document.getElementById("lastname").value.trim();
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmedPassword = document.getElementById("confirmedPassword").value.trim();

    if (!firstName || !lastName || !username || !password || !confirmedPassword) {
        alert("Please fill in all fields!");
        return;
    }

    if (password !== confirmedPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Load users
    let users = JSON.parse(localStorage.getItem("libraryUsers")) || [];

    // Check if username exists
    if (users.find(u => u.username === username)) {
        alert("Username already exists!");
        return;
    }

    // Add user
    users.push({ firstName, lastName, username, password });
    localStorage.setItem("libraryUsers", JSON.stringify(users));

    alert("Signup successful! Please login.");
    window.location.href = "login.html";
}

// LOGIN
function login() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Required fields!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("libraryUsers")) || [];
    let validUser = users.find(u => u.username === username && u.password === password);

    if (validUser) {
        alert(`Welcome, ${validUser.firstName}!`);
        localStorage.setItem("loggedInUser", JSON.stringify(validUser));
        window.location.href = "userDashboard.html"; // your user dashboard
    } else {
        alert("Wrong username or password!");
    }
}