import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/Product/ProductCard';
import Newsletter from '../components/marketing/Newsletter';
import Testimonials from '../components/marketing/Testimonials';
import BrandStory from '../components/marketing/BrandStory';
import TrustBadges from '../components/common/TrustBadges';

const Home = () => {
    const { user } = useAuth();
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await api.getProducts();
                setFeaturedProducts(products.slice(0, 4));
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="gradient-primary text-white py-20 md:py-32">
                <div className="container mx-auto px-4 text-center">
                    <div className="animate-slide-up">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">New Collection Available</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            Wear Your <span className="text-white drop-shadow-lg">Style</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Premium quality t-shirts designed for comfort, style, and self-expression
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/catalog" className="btn-accent inline-flex items-center justify-center gap-2">
                                Shop Now
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            {user?.is_admin && (
                                <Link to="/design" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2">
                                    Design Your Own
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="container mx-auto px-4">
                <TrustBadges />
            </section>

            {/* Featured Products */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover our handpicked selection of premium t-shirts
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link to="/catalog" className="btn-primary inline-flex items-center gap-2">
                        View All Products
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Brand Story */}
            <BrandStory />

            {/* Testimonials */}
            <Testimonials />

            {/* Newsletter */}
            <section className="container mx-auto px-4 py-16">
                <Newsletter />
            </section>
        </div>
    );
};

export default Home;
