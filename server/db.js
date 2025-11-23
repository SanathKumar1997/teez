import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'teez.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Products Table
        db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      original_price REAL,
      discount_percentage REAL DEFAULT 0,
      stock_quantity INTEGER DEFAULT 100,
      image TEXT,
      category TEXT,
      description TEXT,
      rating REAL,
      reviews INTEGER,
      colors TEXT,
      sizes TEXT
    )`);

        // Orders Table
        db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_email TEXT NOT NULL,
      total_amount REAL NOT NULL,
      items TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      is_admin BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Seed Data if empty
        db.get("SELECT count(*) as count FROM products", (err, row) => {
            if (row.count === 0) {
                console.log("Seeding database with category-based products...");
                const products = [
                    {
                        title: 'Classic White Essential Tee',
                        price: 29.99,
                        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
                        category: 'new-arrivals',
                        description: 'Perfect white tee for everyday wear. Made from 100% organic cotton.',
                        rating: 4.8,
                        reviews: 124,
                        colors: JSON.stringify(['White', 'Black', 'Grey']),
                        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
                        stock_quantity: 100
                    },
                    {
                        title: 'Code While Alive - Programming Tee',
                        price: 34.99,
                        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500',
                        category: 'programming',
                        description: 'For developers who live and breathe code. Premium quality print.',
                        rating: 4.9,
                        reviews: 89,
                        colors: JSON.stringify(['Black', 'Navy', 'Dark Grey']),
                        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
                        stock_quantity: 75
                    },
                    {
                        title: 'May The Source Be With You',
                        price: 32.99,
                        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500',
                        category: 'geeky',
                        description: 'Geeky Star Wars inspired tee for true fans.',
                        rating: 4.7,
                        reviews: 156,
                        colors: JSON.stringify(['Navy', 'Black', 'Royal Blue']),
                        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
                        stock_quantity: 90
                    },
                    {
                        title: 'Vintage Biker Motorcycle Tee',
                        price: 36.99,
                        image: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500',
                        category: 'biker',
                        description: 'Classic biker design with vintage motorcycle graphics.',
                        rating: 4.6,
                        reviews: 67,
                        colors: JSON.stringify(['Grey', 'Black', 'Olive']),
                        sizes: JSON.stringify(['M', 'L', 'XL', 'XXL']),
                        stock_quantity: 60
                    },
                    {
                        title: 'Rock Band Music Tee',
                        price: 31.99,
                        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500',
                        category: 'music',
                        description: 'For music lovers and rock enthusiasts.',
                        rating: 4.8,
                        reviews: 98,
                        colors: JSON.stringify(['Black', 'White', 'Red']),
                        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
                        stock_quantity: 85
                    },
                    {
                        title: 'The Codefather - Programming',
                        price: 33.99,
                        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
                        category: 'movies',
                        description: 'Godfather meets coding. Perfect for programmer movie fans.',
                        rating: 4.9,
                        reviews: 142,
                        colors: JSON.stringify(['White', 'Black', 'Grey']),
                        sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
                        stock_quantity: 70
                    },
                    {
                        title: 'Retro Sports Athletic Tee',
                        price: 35.99,
                        image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500',
                        category: 'sports',
                        description: 'Vintage sports design with athletic vibes.',
                        rating: 4.5,
                        reviews: 73,
                        colors: JSON.stringify(['Blue', 'Red', 'White']),
                        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
                        stock_quantity: 95
                    },
                    {
                        title: 'Vintage Graphic Print Tee',
                        price: 30.99,
                        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500',
                        category: 'vintage',
                        description: 'Classic vintage design with retro graphics.',
                        rating: 4.7,
                        reviews: 111,
                        colors: JSON.stringify(['White', 'Cream', 'Light Grey']),
                        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
                        stock_quantity: 80
                    }
                ];

                const stmt = db.prepare("INSERT INTO products (title, price, image, category, description, rating, reviews, colors, sizes, stock_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                products.forEach(p => {
                    stmt.run(p.title, p.price, p.image, p.category, p.description, p.rating, p.reviews, p.colors, p.sizes, p.stock_quantity);
                });
                stmt.finalize();
                console.log("Database seeded successfully with categorized products.");
            }
        });
    });
}

export default db;
