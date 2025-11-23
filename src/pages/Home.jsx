import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-secondary py-20 px-4">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex-1 space-y-6">
                        <h1 className="text-5xl md:text-6xl font-bold leading-tight text-primary">
                            Wear Your <span className="text-accent">Vibe</span>.
                        </h1>
                        <p className="text-xl text-gray-600 max-w-lg">
                            Premium quality tees, polos, and custom designs. Express yourself with TEEZ.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link to="/catalog" className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                                Shop Now <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link to="/design" className="bg-white text-primary border border-gray-200 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">
                                Create Design
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center">
                        {/* Placeholder for Hero Image */}
                        <div className="w-full max-w-md aspect-square bg-gray-200 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl">
                            <span className="text-gray-400 font-medium">Hero Image Placeholder</span>
                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">Trending Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {['Graphic Tees', 'Premium Polos', 'Long Sleeves'].map((category, index) => (
                            <div key={index} className="group cursor-pointer">
                                <div className="bg-gray-100 aspect-[4/5] rounded-2xl mb-4 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        Image Placeholder
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold">{category}</h3>
                                <p className="text-gray-500 text-sm mt-1">Explore Collection</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
