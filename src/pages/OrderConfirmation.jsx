import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const OrderConfirmation = () => {
    const orderId = Math.floor(100000 + Math.random() * 900000);

    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 text-lg mb-2">Thank you for your purchase.</p>
            <p className="text-gray-500 mb-8">Your order <span className="font-mono font-bold text-gray-900">#{orderId}</span> has been received and is being processed.</p>

            <div className="flex justify-center gap-4">
                <Link to="/" className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                    Return Home
                </Link>
                <Link to="/catalog" className="border border-gray-200 text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                    Continue Shopping <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;
