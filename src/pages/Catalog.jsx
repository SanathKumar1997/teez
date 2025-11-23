import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, Loader } from 'lucide-react';
import ProductCard from '../components/Product/ProductCard';
import { api } from '../services/api';

const Catalog = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
    const [priceRange, setPriceRange] = useState('all');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await api.getProducts(selectedCategory, searchParam);
                setProducts(data);
                setError(null);
            } catch (err) {
                setError('Failed to load products. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, searchParam]);

    // Update URL when category changes
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === 'all') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    const filteredProducts = products.filter(product => {
        let priceMatch = true;
        if (priceRange === 'under-30') priceMatch = product.price < 30;
        if (priceRange === '30-50') priceMatch = product.price >= 30 && product.price <= 50;
        if (priceRange === 'over-50') priceMatch = product.price > 50;
        return priceMatch;
    });

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    if (error) return (
        <div className="text-center py-20 text-red-500">
            {error}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Shop All</h1>
                    <p className="text-gray-500">Find your perfect fit from our premium collection.</p>
                    {searchParam && (
                        <p className="text-sm text-accent mt-2">Showing results for "{searchParam}"</p>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-gray-300 bg-white">
                            <Filter className="w-4 h-4" />
                            <span className="capitalize">{selectedCategory === 'all' ? 'Category' : selectedCategory}</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="p-1">
                                {['all', 't-shirts', 'polos', 'long-sleeve'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryChange(cat)}
                                        className={`block w-full text-left px-4 py-2 text-sm rounded-md capitalize ${selectedCategory === cat ? 'bg-secondary font-medium' : 'hover:bg-gray-50'}`}
                                    >
                                        {cat === 'all' ? 'All Categories' : cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-gray-300 bg-white">
                            <span>Price</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="p-1">
                                {[
                                    { label: 'Any Price', value: 'all' },
                                    { label: 'Under $30', value: 'under-30' },
                                    { label: '$30 - $50', value: '30-50' },
                                    { label: 'Over $50', value: 'over-50' },
                                ].map(range => (
                                    <button
                                        key={range.value}
                                        onClick={() => setPriceRange(range.value)}
                                        className={`block w-full text-left px-4 py-2 text-sm rounded-md ${priceRange === range.value ? 'bg-secondary font-medium' : 'hover:bg-gray-50'}`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                    <button
                        onClick={() => { setSelectedCategory('all'); setPriceRange('all'); setSearchParams({}); }}
                        className="mt-4 text-accent hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default Catalog;
