import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import db from './db.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = 3000;
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret_placeholder'
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Razorpay Order Creation Endpoint
app.post('/api/create-razorpay-order', async (req, res) => {
    const { amount } = req.body;

    try {
        const options = {
            amount: Math.round(amount * 100), // Razorpay expects paise (100 paise = 1 INR)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1 // Auto capture payment
        };

        const order = await razorpay.orders.create(options);

        res.send({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        res.status(500).send({ error: error.message });
    }
});

// Health check endpoint for CI/CD
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'teezi-api'
    });
});

// Health check
app.get('/', (req, res) => {
    res.send('TEEZI API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
