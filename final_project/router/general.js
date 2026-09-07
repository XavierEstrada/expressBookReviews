const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Se requiere nombre de usuario y contraseña" });
    }

    if (isValid(username)) {
        return res.status(404).json({ message: "El nombre de usuario ya existe" });
    }

    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: "Usuario registrado exitosamente. Ahora puedes iniciar sesión" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author;

    // Obtiene todas las claves (ISBNs) del objeto books
    const isbns = Object.keys(books);

    // Itera y filtra los libros cuyo autor coincide con el parámetro
    const booksByAuthor = isbns
        .filter(isbn => books[isbn].author === author)
        .reduce((result, isbn) => {
            result[isbn] = books[isbn];
            return result;
        }, {});

    return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title;

    // Obtiene todas las claves (ISBNs) del objeto books
    const isbns = Object.keys(books);

    // Itera y filtra los libros cuyo título coincide con el parámetro
    const booksByTitle = isbns
        .filter(isbn => books[isbn].title === title)
        .reduce((result, isbn) => {
            result[isbn] = books[isbn];
            return result;
        }, {});

    return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

// Get the book list available in the shop using Async-Await with Axios
public_users.get('/async/books', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener los libros", error: error.message });
    }
});

// Get book details based on ISBN using Async-Await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener el libro", error: error.message });
    }
});

module.exports.general = public_users;
