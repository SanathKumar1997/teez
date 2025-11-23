const API_URL = 'http://localhost:3000/api';

async function fetchOrders() {
    try {
        const response = await fetch(`${API_URL}/orders/user/testuser4@example.com`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Orders:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Failed to fetch orders:', error);
    }
}

fetchOrders();
