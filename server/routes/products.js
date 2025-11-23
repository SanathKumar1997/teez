import express from 'express';
import db from '../db.js';

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

export default router;
