import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Truck, ShieldCheck, Loader } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await api.getProduct(id);
                setProduct(data);
                if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
            } catch (err) {
                setError('Product not found');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleQuantityChange = (delta) => {
        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= 10) setQuantity(newQty);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        addToCart(product, quantity, selectedSize, selectedColor);
        navigate('/cart');
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                <Link to="/catalog" className="text-accent hover:underline">Return to Catalog</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/catalog" className="inline-flex items-center text-gray-500 hover:text-primary mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border border-transparent hover:border-primary transition-colors">
                                <img
                                    src={product.image}
                                    alt={`View ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <div className="mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.title}</h1>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center text-yellow-400">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="text-gray-900 font-bold ml-1">{product.rating}</span>
                            </div>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-500">{product.reviews} reviews</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
                    </div>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {product.description} Made with premium materials designed for durability and comfort.
                        Perfect for everyday wear or special occasions.
                    </p>

                    <div className="space-y-6 mb-8">
                        {/* Color Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Color: <span className="text-gray-500">{selectedColor}</span></label>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${selectedColor === color ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-full border border-gray-200"
                                            style={{ backgroundColor: color.toLowerCase() }}
                                        ></div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium">Size</label>
                                <button className="text-xs text-gray-500 underline">Size Guide</button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 rounded-lg border flex items-center justify-center font-medium transition-all
                      ${selectedSize === size
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-gray-200 hover:border-gray-400 text-gray-900'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {!selectedSize && <p className="text-red-500 text-xs mt-1">Please select a size</p>}
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Quantity</label>
                            <div className="flex items-center w-32 border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <div className="flex-1 text-center font-medium">{quantity}</div>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-primary text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                        </button>
                        <button className="w-14 h-14 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50">
                            <Star className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                        <div className="flex items-start gap-3">
                            <Truck className="w-6 h-6 text-accent" />
                            <div>
                                <h4 className="font-medium text-sm">Free Shipping</h4>
                                <p className="text-xs text-gray-500">On orders over $100</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="w-6 h-6 text-accent" />
                            <div>
                                <h4 className="font-medium text-sm">Secure Payment</h4>
                                <p className="text-xs text-gray-500">100% secure checkout</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
