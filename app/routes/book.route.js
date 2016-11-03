"use strict";
var express = require('express');
var router = express.Router();
var BookController = require('../controllers/book.controller');
var book = new BookController();
var UserController = require('../controllers/user.controller');
var user = new UserController();

module.exports = function(app) {
  //define routes with functions
  router.route('/books')
    .post(book.createBook)
    .get(book.getBooks);

  router.route('/book/:book_id')
    .get(book.getBook)
    .delete(book.deleteBook)
    .put(book.updateBook);

  app.use('/api', router);
  // frontend routes =========================================================
};
