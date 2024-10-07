const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const booksList = await getBooks();
        return res.status(200).json(booksList);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books." });
    }
});
function getBooks() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 100);
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    getBookByISBN(isbn)
        .then(book => {
            if (book) {
                return res.status(200).json(book);
            } else {
                return res.status(404).json({ message: "Book not found." });
            }
        })
        .catch(error => {
            return res.status(500).json({ message: "Error retrieving book details." });
        });
});
function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject(new Error("Book not found"));
            }
        }, 100);
    });
}
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;

    getBooksByAuthor(author)
        .then(result => {
            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ message: "No books found for this author." });
            }
        })
        .catch(error => {
            return res.status(500).json({ message: "Error retrieving books by author." });
        });
});
function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const result = Object.values(books).filter(book => book.author === author);
            resolve(result);
        }, 100);
    });
}

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const result = await getBooksByTitle(title);
        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "No books found with this title." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books by title." });
    }
});
function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const result = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
            resolve(result);
        }, 100);
    });
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const review = books[isbn].reviews;

  console.log(review)
  return res.status(300).json(review);
});

module.exports.general = public_users;
