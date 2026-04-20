const Book = require('../models/Book');

// @desc    Get all books (with search & filter)
// @route   GET /api/books
const getBooks = async (req, res) => {
  try {
    const { search, genre, sort, featured } = req.query;
    let query = {};

    // Search by title or author
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by genre
    if (genre) {
      query.genre = genre;
    }

    // Filter featured
    if (featured === 'true') {
      query.featured = true;
    }

    let booksQuery = Book.find(query);

    // Sort
    if (sort === 'price_asc') booksQuery = booksQuery.sort({ buyPrice: 1 });
    else if (sort === 'price_desc') booksQuery = booksQuery.sort({ buyPrice: -1 });
    else if (sort === 'title') booksQuery = booksQuery.sort({ title: 1 });
    else if (sort === 'newest') booksQuery = booksQuery.sort({ createdAt: -1 });
    else booksQuery = booksQuery.sort({ createdAt: -1 });

    const books = await booksQuery;
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add a new book (Admin only)
// @route   POST /api/books
const addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A book with this ISBN already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a book (Admin only)
// @route   PUT /api/books/:id
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a book (Admin only)
// @route   DELETE /api/books/:id
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all genres
// @route   GET /api/books/genres/list
const getGenres = async (req, res) => {
  try {
    const genres = await Book.distinct('genre');
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getBooks, getBookById, addBook, updateBook, deleteBook, getGenres };
