const mongoose = require('mongoose');
const databaseURL = 'mongodb://localhost:27017/librarydb';

const options = { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false };

mongoose.connect(databaseURL, options);

const BookInstanceSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    imprint: {type: String, required: true},
    status: { type: String,
              required: true,
              enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
              default: 'Maintenance'
            },
    due_back: {type: Date, default: Date.now}
  }
);

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
