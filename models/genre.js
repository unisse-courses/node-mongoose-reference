const mongoose = require('mongoose');
const databaseURL = 'mongodb://localhost:27017/librarydb';

const options = { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false };

mongoose.connect(databaseURL, options);

const GenreSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, min: 3, max: 100},
  }
);

module.exports = mongoose.model('Genre', GenreSchema);
