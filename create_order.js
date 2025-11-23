const API_URL = 'http://localhost:3000/api';

async function createOrder() {
    const orderData = {
        customer_email: 'testuser4@example.com',
        total_amount: 29.99,
        items: [
            {
                title: 'Test Product',
                quantity: 1,
                price: 29.99,
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                size: 'M'
            }
        ],
        shipping_address: {
            address: '123 Test St',
            city: 'Test City',
            state: 'TS',
            zip: '12345'
        }
    };

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text);
        }

        const data = await response.json();
        console.log('Order created:', data);
    } catch (error) {
        console.error('Failed to create order:', error);
    }
}

createOrder();
