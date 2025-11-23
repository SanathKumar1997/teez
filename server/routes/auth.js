import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if this is the first user or admin email
        db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
            const isFirstUser = row.count === 0;
            const isAdminEmail = email.toLowerCase().includes('admin@teez.com');
            const is_admin = isFirstUser || isAdminEmail ? 1 : 0;

            const query = `INSERT INTO users (name, email, password_hash, is_admin) VALUES (?, ?, ?, ?)`;

            db.run(query, [name, email, hashedPassword, is_admin], function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Email already exists' });
                    }
                    return res.status(500).json({ error: err.message });
                }

                const token = jwt.sign({ id: this.lastID, email, is_admin }, JWT_SECRET, { expiresIn: '24h' });
                res.status(201).json({
                    message: 'User registered successfully',
                    token,
                    user: { id: this.lastID, name, email, is_admin: Boolean(is_admin) }
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: '24h' });
        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, is_admin: Boolean(user.is_admin) }
        });
    });
});

export default router;
