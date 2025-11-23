import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles, TrendingUp } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/Product/ProductCard';

const Catalog = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [scrollY, setScrollY] = useState(0);

    const categories = [
        {
            id: 'all',
            name: 'All',
            emoji: '✨',
            gradient: 'from-purple-400 to-pink-400'
        },
        {
            id: 'new-arrivals',
            name: 'New',
            emoji: '🆕',
            gradient: 'from-yellow-400 to-orange-400'
        },
        {
            id: 'programming',
            name: 'Code',
            emoji: '💻',
            gradient: 'from-blue-400 to-cyan-400'
        },
        {
            id: 'geeky',
            name: 'Geek',
            emoji: '🤓',
            gradient: 'from-green-400 to-teal-400'
        },
        {
            id: 'biker',
            name: 'Biker',
            emoji: '🏍️',
            gradient: 'from-gray-600 to-gray-800'
        },
        {
            id: 'music',
            name: 'Music',
            emoji: '🎵',
            gradient: 'from-purple-500 to-indigo-500'
        },
        {
            id: 'movies',
            name: 'Movies',
            emoji: '🎬',
            gradient: 'from-pink-500 to-rose-500'
        },
        {
            id: 'sports',
            name: 'Sports',
            emoji: '⚽',
            gradient: 'from-orange-500 to-red-500'
        },
        {
            id: 'vintage',
            name: 'Retro',
            emoji: '📻',
            gradient: 'from-amber-500 to-yellow-600'
        }
    ];

    useEffect(() => {
        fetchProducts();
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [selectedCategory, searchTerm]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const category = selectedCategory === 'all' ? '' : selectedCategory;
            const data = await api.getProducts(category, searchTerm);
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === 'all') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm) {
            searchParams.set('search', searchTerm);
        } else {
            searchParams.delete('search');
        }
        setSearchParams(searchParams);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse"
                    style={{ transform: `translateY(${scrollY * 0.3}px)` }}
                />
                <div
                    className="absolute bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"
                    style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
                />
            </div>

            <div className="container mx-auto px-4 py-12 relative z-10">
                {/* Hero Header with Animation */}
                <div className="text-center mb-16 animate-slide-up">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full mb-6 shadow-lg hover:shadow-xl transition-shadow">
                        <TrendingUp className="w-4 h-4 animate-bounce" />
                        <span className="text-sm font-semibold">Trending Now</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-primary to-accent bg-clip-text text-transparent leading-tight">
                        Discover Your Style
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        Premium collection curated for the fashion-forward
                    </p>
                </div>

                {/* Category Pills with Hover Effects */}
                <div className="mb-16">
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        {categories.map((category, index) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`group relative px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${selectedCategory === category.id
                                        ? `bg-gradient-to-r ${category.gradient} text-white shadow-xl scale-110`
                                        : 'bg-white text-gray-700 hover:shadow-lg border-2 border-gray-100'
                                    }`}
                                style={{
                                    animationDelay: `${index * 0.05}s`,
                                    animation: 'fadeIn 0.5s ease-out forwards'
                                }}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="text-xl">{category.emoji}</span>
                                    <span>{category.name}</span>
                                </span>
                                {selectedCategory === category.id && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Bar with Glass Effect */}
                <div className="mb-12 max-w-2xl mx-auto animate-fade-in">
                    <form onSubmit={handleSearch} className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                        <div className="relative flex gap-2 bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-xl">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search for your perfect tee..."
                                    className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-primary flex items-center gap-2 px-8 whitespace-nowrap hover:scale-105 transition-transform"
                            >
                                <Sparkles className="w-4 h-4" />
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Products Grid with Stagger Animation */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary animate-pulse" />
                        </div>
                        <p className="mt-4 text-gray-600 font-medium">Loading amazing styles...</p>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                                <p className="text-gray-600 font-medium">
                                    {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
                                    {selectedCategory !== 'all' && (
                                        <span className="ml-2 text-primary">
                                            in {categories.find(c => c.id === selectedCategory)?.name}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="animate-fade-in hover-lift"
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                        opacity: 0,
                                        animation: `fadeIn 0.6s ease-out ${index * 0.1}s forwards`
                                    }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 animate-fade-in">
                        <div className="mb-6">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                <Search className="w-12 h-12 text-gray-400" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                        <button
                            onClick={() => {
                                setSelectedCategory('all');
                                setSearchTerm('');
                                searchParams.delete('category');
                                searchParams.delete('search');
                                setSearchParams(searchParams);
                            }}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            Show All Products
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalog;
