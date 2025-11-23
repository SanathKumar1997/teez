import express from 'express';
import db from '../db.js';

const router = express.Router();

// Create new order
router.post('/', (req, res) => {
    const { customer_email, total_amount, items, shipping_address } = req.body;

    const query = `INSERT INTO orders (customer_email, total_amount, items, shipping_address) VALUES (?, ?, ?, ?)`;
    const params = [customer_email, total_amount, JSON.stringify(items), JSON.stringify(shipping_address)];

    db.run(query, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "Order created successfully",
            orderId: this.lastID
        });
    });
});

// Get orders by user email
router.get('/user/:email', (req, res) => {
    const email = req.params.email;
    const query = "SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC";

    db.all(query, [email], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const orders = rows.map(order => ({
            ...order,
            items: JSON.parse(order.items),
            shipping_address: JSON.parse(order.shipping_address)
        }));
        res.json(orders);
    });
});

export default router;
