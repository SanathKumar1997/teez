import React from 'react';
import { Shield, Truck, RotateCcw, CreditCard } from 'lucide-react';

const TrustBadges = () => {
    const badges = [
        {
            icon: Shield,
            title: 'Secure Checkout',
            description: '256-bit SSL encryption'
        },
        {
            icon: Truck,
            title: 'Free Shipping',
            description: 'On orders over $50'
        },
        {
            icon: RotateCcw,
            title: 'Easy Returns',
            description: '30-day return policy'
        },
        {
            icon: CreditCard,
            title: 'Safe Payment',
            description: 'Razorpay secured'
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
            {badges.map((badge, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <badge.icon className="w-10 h-10 text-primary mb-2" />
                    <h4 className="font-semibold text-sm mb-1">{badge.title}</h4>
                    <p className="text-xs text-gray-500">{badge.description}</p>
                </div>
            ))}
        </div>
    );
};

export default TrustBadges;
