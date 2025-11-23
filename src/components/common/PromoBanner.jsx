import React, { useState } from 'react';
import { X } from 'lucide-react';

const PromoBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-accent text-white py-3 px-4 relative animate-fade-in">
            <div className="container mx-auto flex items-center justify-center gap-2 text-sm md:text-base">
                <span className="font-semibold">🎉 GRAND OPENING SALE!</span>
                <span className="hidden sm:inline">Get 25% OFF on your first order</span>
                <span className="font-bold">Use code: TEEZ25</span>
            </div>
            <button
                onClick={() => setIsVisible(false)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close banner"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default PromoBanner;
