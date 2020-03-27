const express = require('express');
const bodyParser = require('body-parser');

const Author = require('./models/author');
const Genre = require('./models/genre');
const Book = require('./models/book');

// Creates the express application
const app = express();
const port = 9090;

// Listening to the port provided
app.listen(port, function() {
  console.log('App listening at port '  + port)
});

// Configuration for handling API endpoint data
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// API endpoints only, no views
app.post('/addAuthor', function(req, res) {
  const author = new Author({
    first_name: req.body.first_name,
    last_name: req.body.last_name
  });

  author.save(function (err, result) {
    if (err) throw err;
    res.send(result.toObject());
  });
});

app.post('/addGenre', function(req, res) {
  const genre = new Genre({
    name: req.body.name
  });

  genre.save(function (err, result) {
    if (err) throw err;

    res.send(result);
  });
});

app.post('/addBook', function(req, res) {
  const bookRequest = req.body;
  
  // find Author
  Author.findOne(bookRequest.author, function (err, author) {
    const authorid = author._id;

    // then find genre
    Genre.find({ name: { $in: bookRequest.genre }}, function(err, genres) {
      console.log(genres);

      // then create book
      const book = new Book({
        title: bookRequest.title,
        author: author._id,
        summary: bookRequest.summary,
        isbn: bookRequest.isbn,
        genre: genres.map((g) => g._id) // Array.map() returns a new array
      });

      // save book
      book.save(function(err, result) {
        if (err) throw err;
        res.send(result);
      });
    });
  });
});

app.get('/authors', function(req, res) {
  Author.find({}, function(err, authors) {
    res.send(authors);
  });
});

app.get('/genres', function(req, res) {
  Genre.find({}, function(err, genres) {
    res.send(genres);
  });
});

app.get('/books', function(req, res) {
  Book.find({})
    .populate('genre')
    .populate('author')
    .exec(function(err, books) {
      res.send(books);
    });
});

app.get('/books/:authorid', function(req, res) {
  // Assuming we pass the author id in the URL
  const authorId = req.params.authorid;

  Book.find({ author: authorId })
    .populate('genre')
    .populate('author')
    .exec(function(err, books) {
      res.send(books);
    });
});
