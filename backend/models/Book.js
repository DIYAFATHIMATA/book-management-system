const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true,
  },
  isbn: {
    type: String,
    unique: true,
    required: [true, 'ISBN is required'],
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/300x400?text=Book+Cover',
  },
  buyPrice: {
    type: Number,
    required: [true, 'Buy price is required'],
    min: 0,
  },
  rentPricePerDay: {
    type: Number,
    required: [true, 'Rent price per day is required'],
    min: 0,
  },
  stockForSale: {
    type: Number,
    default: 0,
    min: 0,
  },
  stockForRent: {
    type: Number,
    default: 0,
    min: 0,
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5,
  },
  pages: {
    type: Number,
    default: 0,
  },
  publishedYear: {
    type: Number,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Book', bookSchema);
