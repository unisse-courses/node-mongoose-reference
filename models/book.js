const mongoose = require('mongoose');
const databaseURL = 'mongodb://localhost:27017/librarydb';

const options = { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false };

mongoose.connect(databaseURL, options);

const BookSchema = new mongoose.Schema(
  {
    title: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true},
    summary: {type: String, required: true},
    isbn: {type: String, required: true},
    genre: [{type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}]
  }
);

module.exports = mongoose.model('Book', BookSchema);
