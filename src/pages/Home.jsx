import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/Product/ProductCardV2';
import Newsletter from '../components/marketing/Newsletter';
import Testimonials from '../components/marketing/Testimonials';
import BrandStory from '../components/marketing/BrandStory';
import TrustBadges from '../components/common/TrustBadges';
import HeroBanner from '../components/common/HeroBanner';

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
            {/* Hero Banner Slider */}
            <HeroBanner />

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
