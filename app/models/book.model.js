// app/models/user.model.js
// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// define our user model
// module.exports allows us to pass this to other files when it is called
var bookSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  author: {
    type: String,
    required: true
  },
  coverImgUrl: {
    type: String
  },
  pdfName: {
    type: String
  },
  free: {
    type: Boolean,
    default: true
  }
});

var Book = mongoose.model('Book', bookSchema);
module.exports = Book;
