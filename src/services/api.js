const API_URL = 'http://localhost:3000/api';

export const api = {
    async getProducts(category, search) {
        const params = new URLSearchParams();
        if (category && category !== 'all') params.append('category', category);
        if (search) params.append('search', search);

        const response = await fetch(`${API_URL}/products?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    },

    async getProduct(id) {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        return response.json();
    },

    async createOrder(orderData) {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) throw new Error('Failed to create order');
        return response.json();
    },

    async login(email, password) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const text = await response.text();
            try {
                const error = JSON.parse(text);
                throw new Error(error.error || 'Login failed');
            } catch (e) {
                throw new Error(text || 'Login failed');
            }
        }
        return response.json();
    },

    async register(name, email, password) {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        if (!response.ok) {
            const text = await response.text();
            try {
                const error = JSON.parse(text);
                throw new Error(error.error || 'Registration failed');
            } catch (e) {
                throw new Error(text || 'Registration failed');
            }
        }
        return response.json();
    },

    async createPaymentIntent(amount) {
        const response = await fetch(`${API_URL}/create-payment-intent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount }),
        });
        if (!response.ok) throw new Error('Failed to create payment intent');
        return response.json();
    },

    async getUserOrders(email) {
        const response = await fetch(`${API_URL}/orders/user/${email}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },

    // Admin methods
    async createProduct(productData, token) {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData),
        });
        if (!response.ok) throw new Error('Failed to create product');
        return response.json();
    },

    async updateProduct(id, productData, token) {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData),
        });
        if (!response.ok) throw new Error('Failed to update product');
        return response.json();
    },

    async deleteProduct(id, token) {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) throw new Error('Failed to delete product');
        return response.json();
    },

    async applyDiscount(id, discount_percentage, token) {
        const response = await fetch(`${API_URL}/products/${id}/discount`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ discount_percentage }),
        });
        if (!response.ok) throw new Error('Failed to apply discount');
        return response.json();
    }
};
