// ===============================
// DATA STRUCTURES
// ===============================

let booksArray = [];
let booksMap = {};
let waitingQueue = {};
let returnStack = [];

// ===============================
// STORAGE FUNCTIONS
// ===============================

function saveBooks() {
    localStorage.setItem("books", JSON.stringify(booksArray));
}

function loadBooks() {
    const savedBooks = localStorage.getItem("books");

    if (savedBooks) {
        booksArray = JSON.parse(savedBooks);
    } else {
        booksArray = [
            { id: "B001", title: "Harry Potter", available: true, borrower: null, borrowDate: null },
            { id: "B002", title: "The Hobbit", available: true, borrower: null, borrowDate: null },
            { id: "B003", title: "1984", available: true, borrower: null, borrowDate: null }
        ];
        saveBooks();
    }

    booksMap = {};
    booksArray.forEach(book => booksMap[book.id] = book);
}

function saveQueue() {
    localStorage.setItem("waitingQueue", JSON.stringify(waitingQueue));
}

function loadQueue() {
    waitingQueue = JSON.parse(localStorage.getItem("waitingQueue")) || {};
}

function saveReturnStack() {
    localStorage.setItem("returnStack", JSON.stringify(returnStack));
}

function loadReturnStack() {
    returnStack = JSON.parse(localStorage.getItem("returnStack")) || [];
}

// ===============================
// BOOK FUNCTIONS
// ===============================

function addBook() {
    let id = document.getElementById("bookId").value.trim();
    let title = document.getElementById("bookTitle").value.trim();

    if (!id || !title) {
        alert("Please enter Book ID and Title");
        return;
    }

    loadBooks();

    if (booksMap[id]) {
        alert("Book ID already exists");
        return;
    }

    let book = { id, title, available: true, borrower: null, borrowDate: null };
    booksArray.push(book);
    saveBooks();

    alert("Book added successfully");
    displayDashboard();
    displayBooks();

    document.getElementById("bookId").value = "";
    document.getElementById("bookTitle").value = "";
}

function borrowBook() {
    let id = document.getElementById("borrowId").value.trim();
    let user = document.getElementById("userName").value.trim();

    if (!id || !user) {
        alert("Please enter Book ID and your name");
        return;
    }

    loadBooks();
    loadQueue();

    let book = booksMap[id];

    if (!book) {
        alert("Book not found");
        return;
    }

    if (book.available) {
        book.available = false;
        book.borrower = user;
        book.borrowDate = new Date().toLocaleDateString();
        alert(`${user} borrowed "${book.title}" successfully`);
    } else {
        if (!waitingQueue[id]) waitingQueue[id] = [];
        waitingQueue[id].push(user);
        alert(`${user} added to waiting list`);
    }

    saveBooks();
    saveQueue();

    displayBooks();
    displayQueue();
    displayDashboard();
}

function returnBook() {
    let id = document.getElementById("borrowId").value.trim();

    loadBooks();
    loadQueue();
    loadReturnStack();

    let book = booksMap[id];

    if (!book) {
        alert("Book not found");
        return;
    }

    returnStack.push({
        id: book.id,
        title: book.title,
        borrowedBy: book.borrower,
        borrowDate: book.borrowDate,
        returnDate: new Date().toLocaleDateString()
    });

    if (waitingQueue[id] && waitingQueue[id].length > 0) {
        let nextUser = waitingQueue[id].shift();
        book.borrower = nextUser;
        book.borrowDate = new Date().toLocaleDateString();
        book.available = false;
        alert(`Assigned to next user: ${nextUser}`);
    } else {
        book.available = true;
        book.borrower = null;
        book.borrowDate = null;
        alert("Book returned successfully");
    }

    saveBooks();
    saveQueue();
    saveReturnStack();

    displayBooks();
    displayQueue();
    displayStack();
    displayDashboard();
    displayReturned();
}

// ===============================
// DISPLAY FUNCTIONS
// ===============================

function displayBooks() {
    loadBooks();
    let list = document.getElementById("bookList");
    if (!list) return;

    list.innerHTML = "";

    booksArray.forEach(book => {
        let status = book.available ? "Available" : "Borrowed";
        list.innerHTML += `<li>${book.id} - ${book.title} (${status})</li>`;
    });
}

function displayQueue() {
    loadQueue();
    let list = document.getElementById("queueList");
    if (!list) return;

    list.innerHTML = "";

    for (let bookId in waitingQueue) {
        waitingQueue[bookId].forEach((user, index) => {
            list.innerHTML += `<li>Book ${bookId} - ${user} (Position ${index + 1})</li>`;
        });
    }
}

function displayStack() {
    loadReturnStack();
    let list = document.getElementById("stackList");
    if (!list) return;

    list.innerHTML = "";

    returnStack.slice().reverse().forEach(book => {
        list.innerHTML += `<li>${book.id} - ${book.title}</li>`;
    });
}

function displayBorrowed() {
    loadBooks();
    const list = document.getElementById("borrowedBookList");
    if (!list) return;

    list.innerHTML = "";

    const borrowedBooks = booksArray.filter(book => !book.available);

    if (borrowedBooks.length === 0) {
        list.innerHTML = "<li>No borrowed books.</li>";
        return;
    }

    borrowedBooks.forEach(book => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${book.id} - ${book.title}<br>
            Borrowed by: ${book.borrower || "Unknown"}<br>
            Date: ${book.borrowDate || "N/A"}
        `;
        list.appendChild(li);
    });
}

function displayDashboard() {
    loadBooks();
    loadReturnStack();

    const totalEl = document.getElementById("totalBooks");
    const borrowedEl = document.getElementById("borrowedBooks");
    const returnedEl = document.getElementById("returnedBooks");

    if (totalEl) totalEl.textContent = booksArray.length;
    if (borrowedEl) borrowedEl.textContent = booksArray.filter(b => !b.available).length;
    if (returnedEl) returnedEl.textContent = returnStack.length;

    
}

// ===============================
// USERS DISPLAY
// ===============================

function displayUsers() {
    let users = JSON.parse(localStorage.getItem("libraryUsers")) || [];
    const userListEl = document.getElementById("userList");
    if (!userListEl) return;

    userListEl.innerHTML = "";

    if (users.length === 0) {
        userListEl.innerHTML = "<li>No registered users.</li>";
        return;
    }

    users.forEach((user, index) => {
        userListEl.innerHTML += `
            <li>${index + 1}. ${user.firstName} ${user.lastName} (Username: ${user.username})</li>
        `;
    });
}



// ==============================
//USER LOGIN/SIGNUP VALIDATION
//=============================-

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

    let users = JSON.parse(localStorage.getItem("libraryUsers")) || [];
    if (users.find(u => u.username === username)) {
        alert("Username already exists!");
        return;
    }

    users.push({ firstName, lastName, username, password });
    localStorage.setItem("libraryUsers", JSON.stringify(users));

    alert("Signup successful! Please login.");
    window.location.href = "login.html";
}

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
        window.location.href = "userdash.html";
    } else {
        alert("Wrong username or password!");
    }
}

// ===============================
// PAGE LOAD
// ===============================

window.onload = function() {
    loadBooks();
    loadQueue();
    loadReturnStack();

    displayBooks();
    displayQueue();
    displayStack();
    displayDashboard();
    displayUsers();
    displayBorrowed();  
    displayReturned();
};
