'use strict';
require('../models/book.model');
var mongoose = require('mongoose');
var Book = mongoose.model('Book');
var config = require('../../config/db');
var session = ('express-session');

var BookController = function() {}

BookController.prototype.getBooks = function(req, res) {
  Book.find(function(err, books) {
    if (err) {
      return res.json(err);
    }
    if (!books) {
      return res.json({
        success: false,
        message: 'No books found'
      });
    }
    return res.json(books);
  });
};

BookController.prototype.createBook = function(req, res) {
  if (!req.body.name) {
    res.json({
      success: false,
      message: 'Check parameters!'
    });
  }
  Book.findOne({
    name: req.body.name
  }, function(err, book) {
    if (err) {
      return res.json(err);
    } else if (book) {
      res.json({
        success: false,
        message: 'book name taken'
      });
    } else {
      Book.create(req.body, function(err, book) {
        if (err) {
          return res.json(err);
        }
        return res.json(book);
      });
    }
  });
};

BookController.prototype.getBook = function(req, res) {
  Book.findById(req.params.book_id, function(err, book) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(book);
    }
  });
};

BookController.prototype.updateBook = function(req, res) {
  Book.findByIdAndUpdate({
    _id: req.params.book_id
  }, req.body, {
    new: true
  }, function(err, book) {
    if (err) {
      return res.json(err);
    }
    return res.json({
      book: book
    });
  });
}

BookController.prototype.deleteBook = function(req, res) {
  Book.remove({
    _id: req.params.book_id
  }, function(err, book) {
    if (err) {
      return res.json(err);
    }
    return res.json({
      success: true,
      message: "book has been deleted"
    });
  });
};
module.exports = BookController;
