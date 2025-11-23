import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Truck, ShieldCheck, Lock } from 'lucide-react';
import { api } from '../services/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual publishable key
const stripePromise = loadStripe('pk_test_placeholder');

const CheckoutForm = () => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    const [formData, setFormData] = useState({
        email: user?.email || '',
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        address: '',
        city: '',
        state: '',
        zip: ''
    });

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        if (cartTotal > 0) {
            api.createPaymentIntent(cartTotal)
                .then(data => setClientSecret(data.clientSecret))
                .catch(err => console.error('Error creating payment intent:', err));
        }
    }, [cartTotal]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);

        try {
            // 1. Confirm Card Payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        address: {
                            line1: formData.address,
                            city: formData.city,
                            state: formData.state,
                            postal_code: formData.zip,
                        },
                    },
                },
            });

            if (result.error) {
                alert(result.error.message);
                setIsProcessing(false);
                return;
            }

            if (result.paymentIntent.status === 'succeeded') {
                // 2. Create Order in Backend
                const orderData = {
                    customer_email: formData.email,
                    total_amount: cartTotal,
                    items: cart,
                    shipping_address: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        zip: formData.zip
                    }
                };

                await api.createOrder(orderData);
                clearCart();
                navigate('/order-confirmation');
            }
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact & Shipping */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-accent" /> Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">State</label>
                        <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">ZIP Code</label>
                        <input required type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none" />
                    </div>
                </div>
            </div>

            {/* Payment */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-accent" /> Payment Details
                </h2>
                <div className="space-y-4">
                    <div className="border border-gray-300 rounded-lg p-4">
                        <CardElement options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }} />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    Payments are secure and encrypted by Stripe.
                </div>
            </div>

            <button
                type="submit"
                disabled={isProcessing || !stripe || !clientSecret}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isProcessing ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
            </button>
        </form>
    );
};

const Checkout = () => {
    const { cart, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        // navigate('/cart'); // Cannot navigate during render
        return <div className="text-center py-20">Your cart is empty. <a href="/catalog" className="text-accent">Go Shop</a></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
            <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
                <div className="flex-1">
                    <Elements stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                </div>
                {/* Order Summary */}
                <div className="lg:w-80">
                    <div className="bg-gray-50 p-6 rounded-xl sticky top-24">
                        <h3 className="font-bold mb-4">Order Summary</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mb-4">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex gap-3 text-sm">
                                    <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium truncate">{item.title}</p>
                                        <p className="text-gray-500 text-xs">Qty: {item.quantity} | {item.size}</p>
                                    </div>
                                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
