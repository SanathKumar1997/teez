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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Seed Data if empty
        db.get("SELECT count(*) as count FROM products", (err, row) => {
            if (row.count === 0) {
                console.log("Seeding database with realistic data...");
                const products = [
                    {
                        title: "Classic White Essential Tee",
                        price: 29.99,
                        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        category: "t-shirts",
                        description: "The perfect white tee. Made from 100% organic cotton, this shirt features a relaxed fit and durable stitching. A wardrobe staple for any occasion.",
                        rating: 4.8,
                        reviews: 124,
                        colors: JSON.stringify(["White", "Black", "Grey"]),
                        sizes: JSON.stringify(["S", "M", "L", "XL"])
                    },
                    {
                        title: "Urban Street Heavyweight Polo",
                        price: 45.00,
                        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        category: "polos",
                        description: "A modern take on the classic polo. Heavyweight fabric with a structured collar and dropped shoulders for a streetwear aesthetic.",
                        rating: 4.6,
                        reviews: 89,
                        colors: JSON.stringify(["Black", "Navy", "Burgundy"]),
                        sizes: JSON.stringify(["M", "L", "XL", "XXL"])
                    },
                    {
                        title: "Vintage Wash Long Sleeve",
                        price: 38.50,
                        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        category: "long-sleeve",
                        description: "Soft, vintage-washed long sleeve tee with a lived-in feel from day one. Perfect for layering or wearing solo.",
                        rating: 4.7,
                        reviews: 56,
                        colors: JSON.stringify(["Charcoal", "Olive", "Navy"]),
                        sizes: JSON.stringify(["S", "M", "L", "XL"])
                    },
                    {
                        title: "Performance Active Tee",
                        price: 32.00,
                        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        category: "t-shirts",
                        description: "Moisture-wicking fabric keeps you cool and dry during intense workouts. Athletic fit with 4-way stretch.",
                        rating: 4.9,
                        reviews: 210,
                        colors: JSON.stringify(["Blue", "Black", "Neon Green"]),
                        sizes: JSON.stringify(["S", "M", "L", "XL"])
                    },
                    {
                        title: "Premium Cotton V-Neck",
                        price: 24.99,
                        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        category: "t-shirts",
                        description: "A refined V-neck tee made from Supima cotton. Silky soft feel with a flattering cut.",
                        rating: 4.5,
                        reviews: 78,
                        colors: JSON.stringify(["White", "Black", "Navy"]),
                        sizes: JSON.stringify(["S", "M", "L"])
                    },
                    {
                        title: "Graphic Print 'Sunset' Tee",
                        price: 35.00,
                        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        category: "t-shirts",
                        description: "Limited edition graphic tee featuring an abstract sunset design. Screen printed on our signature heavyweight cotton blank.",
                        rating: 4.8,
                        reviews: 150,
                        colors: JSON.stringify(["Black", "White"]),
                        sizes: JSON.stringify(["S", "M", "L", "XL"])
                    },
                    {
                        title: "Slim Fit Pique Polo",
                        price: 42.00,
                        image: "https://images.unsplash.com/photo-1593030761757-71fae45fa317?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        category: "polos",
                        description: "Classic pique polo with a slim, tailored fit. Features mother-of-pearl buttons and ribbed cuffs.",
                        rating: 4.4,
                        reviews: 45,
                        colors: JSON.stringify(["White", "Navy", "Red"]),
                        sizes: JSON.stringify(["S", "M", "L"])
                    },
                    {
                        title: "Cozy Waffle Knit Long Sleeve",
                        price: 48.00,
                        image: "https://images.unsplash.com/photo-1613461920867-9ea125c9447c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        category: "long-sleeve",
                        description: "Textured waffle knit thermal shirt. Keeps you warm without overheating. Great for winter layering.",
                        rating: 4.9,
                        reviews: 92,
                        colors: JSON.stringify(["Cream", "Grey", "Black"]),
                        sizes: JSON.stringify(["S", "M", "L", "XL"])
                    }
                ];

                const stmt = db.prepare("INSERT INTO products (title, price, image, category, description, rating, reviews, colors, sizes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                products.forEach(p => {
                    stmt.run(p.title, p.price, p.image, p.category, p.description, p.rating, p.reviews, p.colors, p.sizes);
                });
                stmt.finalize();
                console.log("Database seeded successfully.");
            }
        });
    });
}

export default db;
