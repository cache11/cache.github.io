
//get the local storage from main.js
let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// Display username
function displayUserName() {
  if (loggedInUser) {
    document.getElementById("userNameDisplay").textContent = loggedInUser.firstName;
  }
}

// Load books from localStorage
function loadBooks() {
  let savedBooks = localStorage.getItem("books");
  return savedBooks ? JSON.parse(savedBooks) : [];
}

// Save books to localStorage
function saveBooks(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

// Display available books
function displayAvailableBooks() {
  let books = loadBooks();
  let ul = document.getElementById("availableBooksList");
  ul.innerHTML = "";

  books.forEach(book => {
    if (book.available) {
      ul.innerHTML += `<li>${book.id} - ${book.title}</li>`;
    }
  });
}

// Display user's borrowed books
function displayUserBorrowedBooks() {
  let books = loadBooks();
  let ul = document.getElementById("borrowedBooksList");
  ul.innerHTML = "";

  books.forEach(book => {
    if (!book.available && book.borrower === loggedInUser.username) {
      ul.innerHTML += `<li>${book.id} - ${book.title}</li>`;
    }
  });
}

// Borrow a book
function borrowBook() {
  let bookId = document.getElementById("borrowBookId").value.trim();
  if (!bookId) {
    alert("Enter a Book ID");
    return;
  }

  let books = loadBooks();
  let book = books.find(b => b.id === bookId);

  if (!book) {
    alert("Book not found");
    return;
  }

  if (!book.available) {
    alert("Book is currently borrowed");
    return;
  }

  book.available = false;
  book.borrower = loggedInUser.username;

  saveBooks(books);
  alert(`You borrowed "${book.title}"`);

  document.getElementById("borrowBookId").value = "";
  displayAvailableBooks();
  displayUserBorrowedBooks();
}

// Return a book
function returnBook() {
  let bookId = document.getElementById("returnBookId").value.trim();
  if (!bookId) {
    alert("Enter a Book ID");
    return;
  }

  let books = loadBooks();
  let book = books.find(b => b.id === bookId);

  if (!book) {
    alert("Book not found");
    return;
  }

  if (book.available || book.borrower !== loggedInUser.username) {
    alert("You cannot return this book");
    return;
  }

  book.available = true;
  delete book.borrower;

  saveBooks(books);
  alert(`You returned "${book.title}"`);

  document.getElementById("returnBookId").value = "";
  displayAvailableBooks();
  displayUserBorrowedBooks();
}

// On page load
window.onload = function() {
  if (!loggedInUser) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }
  displayUserName();
  displayAvailableBooks();
  displayUserBorrowedBooks();
};


function logout() {
  localStorage.removeItem("loggedInUser");
  alert("You have been logged out.");
  window.location.href = "login.html"; // redirect to login page
}