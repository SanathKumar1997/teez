import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            // In a real app, this would call an API
            setSubscribed(true);
            setTimeout(() => {
                setEmail('');
                setSubscribed(false);
            }, 3000);
        }
    };

    return (
        <div className="bg-gradient-primary text-white rounded-2xl p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center">
                <Mail className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Join the TEEZ Family</h3>
                <p className="text-white/90 mb-6">
                    Subscribe to get exclusive offers, style tips, and 15% off your first order!
                </p>

                {subscribed ? (
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 animate-fade-in">
                        <p className="font-semibold">🎉 Thanks for subscribing! Check your email for your discount code.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button
                            type="submit"
                            className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                        >
                            Subscribe
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                )}

                <p className="text-xs text-white/70 mt-4">
                    We respect your privacy. Unsubscribe anytime.
                </p>
            </div>
        </div>
    );
};

export default Newsletter;
