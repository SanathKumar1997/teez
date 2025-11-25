import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Truck, ShieldCheck, Lock } from 'lucide-react';
import { api } from '../services/api';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    const [formData, setFormData] = useState({
        email: user?.email || '',
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        address: '',
        city: '',
        state: '',
        zip: ''
    });

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!razorpayLoaded) {
            alert('Payment system is loading. Please try again.');
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Create Razorpay Order
            const orderData = await api.createRazorpayOrder(cartTotal);

            // 2. Configure Razorpay options
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'TEEZI.in',
                description: 'T-Shirt Purchase',
                order_id: orderData.orderId,
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                },
                theme: {
                    color: '#14B8A6'
                },
                handler: async function (response) {
                    // Payment successful
                    try {
                        // 3. Create Order in Backend
                        const order = {
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
                            },
                            payment_id: response.razorpay_payment_id,
                            order_id: response.razorpay_order_id,
                            signature: response.razorpay_signature
                        };

                        await api.createOrder(order);
                        clearCart();
                        navigate('/order-confirmation');
                    } catch (error) {
                        console.error('Order creation failed:', error);
                        alert('Payment successful but order creation failed. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            // 3. Open Razorpay Checkout
            const razorpay = new window.Razorpay(options);
            razorpay.open();

            razorpay.on('payment.failed', function (response) {
                alert('Payment failed: ' + response.error.description);
                setIsProcessing(false);
            });

        } catch (error) {
            console.error('Payment initialization failed:', error);
            alert('Failed to initialize payment. Please try again.');
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) {
        return <div className="text-center py-20">Your cart is empty. <a href="/catalog" className="text-accent">Go Shop</a></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
            <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
                <div className="flex-1">
                    <form onSubmit={handlePayment} className="space-y-8">
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
                                    <label className="block text-sm font-medium mb-1">PIN Code</label>
                                    <input required type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-accent" /> Payment Method
                            </h2>
                            <div className="space-y-4">
                                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-6 h-6" />
                                        <span className="font-semibold">Razorpay Secure Checkout</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Pay securely using Credit Card, Debit Card, Net Banking, UPI, or Wallets
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                                <ShieldCheck className="w-4 h-4 text-green-600" />
                                Payments are secure and encrypted by Razorpay.
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing || !razorpayLoaded}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? 'Processing...' : `Pay ₹${cartTotal.toFixed(2)}`}
                        </button>
                    </form>
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
                                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
