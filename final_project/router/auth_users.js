const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Se requiere nombre de usuario y contraseña" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(208).json({ message: "Nombre de usuario o contraseña inválidos" });
    }

    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
        accessToken, username
    };

    return res.status(200).json({ message: "El usuario ha iniciado sesión exitosamente" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
  
    if (!books[isbn]) {
      return res.status(404).json({message: "Libro no encontrado"});
    }
  
    if (!review) {
      return res.status(404).json({message: "Se requiere una reseña"});
    }
  
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({
      message: "Reseña agregada/actualizada exitosamente",
      reviews: books[isbn].reviews
    });
  });
  
  // Delete a book review
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    if (!books[isbn]) {
      return res.status(404).json({message: "Libro no encontrado"});
    }
  
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({message: "No existe una reseña de este usuario para este libro"});
    }
  
    delete books[isbn].reviews[username];
  
    return res.status(200).json({
      message: "Reseña eliminada exitosamente",
      reviews: books[isbn].reviews
    });
  });
  
  module.exports.authenticated = regd_users;
  module.exports.isValid = isValid;
  module.exports.users = users;