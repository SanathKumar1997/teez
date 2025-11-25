import React from 'react';
import { Heart, Sparkles, Shield, Zap } from 'lucide-react';

const BrandStory = () => {
    const values = [
        {
            icon: Heart,
            title: 'Made with Love',
            description: 'Every tee is crafted with care and attention to detail'
        },
        {
            icon: Sparkles,
            title: 'Premium Quality',
            description: '100% organic cotton for ultimate comfort and durability'
        },
        {
            icon: Shield,
            title: 'Sustainable',
            description: 'Eco-friendly materials and ethical manufacturing practices'
        },
        {
            icon: Zap,
            title: 'Express Yourself',
            description: 'Custom designs to showcase your unique personality'
        }
    ];

    return (
        <div className="py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Brand Story */}
                    <div className="animate-slide-up">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            The <span className="text-gradient">TEEZI</span> Story
                        </h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            Founded in 2025, TEEZI was born from a simple idea: everyone deserves high-quality,
                            comfortable t-shirts that express their unique style.
                        </p>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            We believe fashion should be accessible, sustainable, and fun. That's why we use
                            only the finest organic cotton and eco-friendly dyes, ensuring our products are
                            good for you and the planet.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Whether you're looking for a classic essential or a custom design that tells your
                            story, TEEZI has you covered. Join our community and wear your style with pride!
                        </p>
                    </div>

                    {/* Brand Values */}
                    <div className="grid grid-cols-2 gap-6">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <value.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                                <h3 className="font-bold mb-2">{value.title}</h3>
                                <p className="text-sm text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandStory;
