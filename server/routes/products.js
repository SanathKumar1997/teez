import express from 'express';
import db from '../db.js';
import { verifyToken, verifyAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Get all products with optional filtering
router.get('/', (req, res) => {
    const { category, search } = req.query;
    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (category && category !== 'all') {
        query += " AND category = ?";
        params.push(category);
    }

    if (search) {
        query += " AND title LIKE ?";
        params.push(`%${search}%`);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Parse JSON strings back to arrays
        const products = rows.map(p => ({
            ...p,
            colors: JSON.parse(p.colors),
            sizes: JSON.parse(p.sizes)
        }));
        res.json(products);
    });
});

// Get single product
router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.json({
            ...row,
            colors: JSON.parse(row.colors),
            sizes: JSON.parse(row.sizes)
        });
    });
});

// Create product (Admin only)
router.post('/', verifyToken, verifyAdmin, (req, res) => {
    const { title, price, image, category, description, rating, reviews, colors, sizes, stock_quantity } = req.body;

    const query = `INSERT INTO products (title, price, image, category, description, rating, reviews, colors, sizes, stock_quantity) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
        title,
        price,
        image,
        category,
        description,
        rating || 0,
        reviews || 0,
        JSON.stringify(colors),
        JSON.stringify(sizes),
        stock_quantity || 100
    ];

    db.run(query, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: 'Product created successfully',
            productId: this.lastID
        });
    });
});

// Update product (Admin only)
router.put('/:id', verifyToken, verifyAdmin, (req, res) => {
    const id = req.params.id;
    const { title, price, image, category, description, rating, reviews, colors, sizes, stock_quantity } = req.body;

    const query = `UPDATE products 
                 SET title = ?, price = ?, image = ?, category = ?, description = ?, 
                     rating = ?, reviews = ?, colors = ?, sizes = ?, stock_quantity = ?
                 WHERE id = ?`;

    const params = [
        title,
        price,
        image,
        category,
        description,
        rating,
        reviews,
        JSON.stringify(colors),
        JSON.stringify(sizes),
        stock_quantity,
        id
    ];

    db.run(query, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully' });
    });
});

// Delete product (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, (req, res) => {
    const id = req.params.id;

    db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

// Apply discount (Admin only)
router.patch('/:id/discount', verifyToken, verifyAdmin, (req, res) => {
    const id = req.params.id;
    const { discount_percentage } = req.body;

    // First get the current price
    db.get("SELECT price, original_price FROM products WHERE id = ?", [id], (err, product) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const originalPrice = product.original_price || product.price;
        const discountedPrice = originalPrice * (1 - discount_percentage / 100);

        const query = `UPDATE products 
                   SET price = ?, original_price = ?, discount_percentage = ?
                   WHERE id = ?`;

        db.run(query, [discountedPrice, originalPrice, discount_percentage, id], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({
                message: 'Discount applied successfully',
                original_price: originalPrice,
                new_price: discountedPrice,
                discount_percentage
            });
        });
    });
});

export default router;
