const mongoose = require('mongoose');
const Book = require('./models/Book');
const User = require('./models/User');
require('dotenv').config();

const sampleBooks = [
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', description: 'A story of the fabulously wealthy Jay Gatsby and his love for Daisy Buchanan.', genre: 'Classic Fiction', isbn: '978-0743273565', coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop', buyPrice: 450, rentPricePerDay: 50, stockForSale: 25, stockForRent: 10, rating: 4.5, pages: 180, publishedYear: 1925, featured: true },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', description: 'The unforgettable novel of a childhood in a sleepy Southern town.', genre: 'Classic Fiction', isbn: '978-0061120084', coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop', buyPrice: 499, rentPricePerDay: 60, stockForSale: 30, stockForRent: 12, rating: 4.8, pages: 336, publishedYear: 1960, featured: true },
  { title: 'Dune', author: 'Frank Herbert', description: 'The story of Paul Atreides on the desert planet Arrakis.', genre: 'Science Fiction', isbn: '978-0441013593', coverImage: 'https://images.unsplash.com/photo-1614544048536-0d28caf77f41?w=300&h=400&fit=crop', buyPrice: 599, rentPricePerDay: 70, stockForSale: 20, stockForRent: 8, rating: 4.7, pages: 688, publishedYear: 1965, featured: true },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', description: 'Bilbo Baggins embarks on an unexpected adventure with Gandalf.', genre: 'Fantasy', isbn: '978-0547928227', coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=400&fit=crop', buyPrice: 475, rentPricePerDay: 55, stockForSale: 35, stockForRent: 15, rating: 4.8, pages: 310, publishedYear: 1937, featured: true },
  { title: '1984', author: 'George Orwell', description: 'A dystopian novel following Winston Smith in Oceania.', genre: 'Dystopian', isbn: '978-0451524935', coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=400&fit=crop', buyPrice: 399, rentPricePerDay: 45, stockForSale: 40, stockForRent: 18, rating: 4.6, pages: 328, publishedYear: 1949, featured: false },
  { title: 'Pride and Prejudice', author: 'Jane Austen', description: 'The romantic clash between Elizabeth Bennet and Mr. Darcy.', genre: 'Romance', isbn: '978-0141439518', coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop', buyPrice: 350, rentPricePerDay: 40, stockForSale: 28, stockForRent: 14, rating: 4.7, pages: 432, publishedYear: 1813, featured: false },
  { title: 'The Alchemist', author: 'Paulo Coelho', description: 'A magical fable about following your dream.', genre: 'Philosophy', isbn: '978-0062315007', coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop', buyPrice: 549, rentPricePerDay: 65, stockForSale: 22, stockForRent: 10, rating: 4.3, pages: 197, publishedYear: 1988, featured: true },
  { title: 'Atomic Habits', author: 'James Clear', description: 'Build good habits and break bad ones with tiny changes.', genre: 'Self-Help', isbn: '978-0735211292', coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300&h=400&fit=crop', buyPrice: 649, rentPricePerDay: 80, stockForSale: 50, stockForRent: 20, rating: 4.9, pages: 320, publishedYear: 2018, featured: true },
  { title: 'Harry Potter and the Sorcerer Stone', author: 'J.K. Rowling', description: 'Harry discovers he is a wizard and enters Hogwarts.', genre: 'Fantasy', isbn: '978-0590353427', coverImage: 'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=300&h=400&fit=crop', buyPrice: 499, rentPricePerDay: 60, stockForSale: 45, stockForRent: 20, rating: 4.9, pages: 309, publishedYear: 1997, featured: true },
  { title: 'Sapiens', author: 'Yuval Noah Harari', description: 'A sweeping narrative of humanity creation and evolution.', genre: 'Non-Fiction', isbn: '978-0062316097', coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop', buyPrice: 699, rentPricePerDay: 90, stockForSale: 18, stockForRent: 8, rating: 4.6, pages: 464, publishedYear: 2011, featured: false },
  { title: 'The Art of War', author: 'Sun Tzu', description: 'Ancient Chinese military treatise on strategy.', genre: 'Philosophy', isbn: '978-1599869773', coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=400&fit=crop', buyPrice: 299, rentPricePerDay: 30, stockForSale: 60, stockForRent: 25, rating: 4.4, pages: 110, publishedYear: 500, featured: false },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', description: 'Holden Caulfield tells his story of wandering New York.', genre: 'Classic Fiction', isbn: '978-0316769488', coverImage: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=400&fit=crop', buyPrice: 399, rentPricePerDay: 50, stockForSale: 32, stockForRent: 16, rating: 4.2, pages: 234, publishedYear: 1951, featured: false },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');
    await Book.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');
    await User.create({ 
      name: 'Diya Fathima', 
      email: 'diyafathima@admin.com', 
      password: 'admin123456', 
      role: 'admin' 
    });
    console.log('Admin created: diyafathima@admin.com / admin123456');
    await Book.insertMany(sampleBooks);
    console.log(sampleBooks.length + ' books seeded');
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
