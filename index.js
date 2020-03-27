const express = require('express');
const bodyParser = require('body-parser');

// Import the models individually
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
  // Adds an author to the database
  const author = new Author({
    first_name: req.body.first_name,
    family_name: req.body.family_name
  });

  author.save(function (err, result) {
    if (err) throw err;

    // Used toObject() to show how the virtuals can be returned
    res.send(result.toObject());
  });
});

app.post('/addGenre', function(req, res) {
  // Adds a genre to the database
  const genre = new Genre({
    name: req.body.name
  });

  genre.save(function (err, result) {
    if (err) throw err;

    res.send(result);
  });
});

app.post('/addBook', function(req, res) {
  // Check ./data/authors.json for request body format expected
  // Adds a book to the database
  const bookRequest = req.body;

  // 1. Find the author
  Author.findOne(bookRequest.author, function (err, author) {
    // save the _id of the author in a variable
    const authorid = author._id;

    // 2. Find genres using the $in operator since the genre field is an array
    Genre.find({ name: { $in: bookRequest.genre }}, function(err, genres) {
      // This returns all the genres found
      // Array of documents
      console.log(genres);

      // 3.Finally, create book
      const book = new Book({
        title: bookRequest.title,
        author: authorid,
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
  // Retrieves all authors
  Author.find({}, function(err, authors) {
    res.send(authors);
  });
});

app.get('/genres', function(req, res) {
  // Retrieves all genres
  Genre.find({}, function(err, genres) {
    res.send(genres);
  });
});

app.get('/books', function(req, res) {
  // Retrieves all books and populates the reference to genre and author
  Book.find({})
    .populate('genre')
    .populate('author')
    .exec(function(err, books) {
      res.send(books);
    });
});

app.get('/books/:authorid', function(req, res) {
  // Retrieves all books of an author
  // We expect the author id in the URL
  const authorId = req.params.authorid;

  // Filter books by author id provided
  Book.find({ author: authorId })
    .populate('genre')
    .populate('author')
    .exec(function(err, books) {
      res.send(books);
    });
});
