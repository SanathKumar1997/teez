import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Eye } from 'lucide-react';

const ProductCardV2 = ({ product }) => {
    const [isLiked, setIsLiked] = useState(false);

    const hasDiscount = product.discount_percentage > 0;
    const displayPrice = hasDiscount ? product.price : product.price;
    const originalPrice = hasDiscount ? product.original_price : null;

    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl">
            {/* Image Container with Overlay */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {hasDiscount && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
                            -{product.discount_percentage}%
                        </span>
                    )}
                    {product.stock_quantity < 20 && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Low Stock
                        </span>
                    )}
                </div>

                {/* Price Tag */}
                <div className="absolute top-3 right-3">
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
                        {hasDiscount ? (
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-gray-400 line-through">₹{originalPrice?.toFixed(2)}</span>
                                <span className="text-lg font-bold text-primary">₹{displayPrice.toFixed(2)}</span>
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-gray-900">₹{displayPrice.toFixed(2)}</span>
                        )}
                    </div>
                </div>

                {/* Action Buttons - Appear on Hover */}
                <div className="absolute bottom-4 right-4 flex gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`p-3 rounded-full shadow-xl backdrop-blur-sm transition-all duration-300 ${isLiked
                                ? 'bg-red-500 text-white scale-110'
                                : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white hover:scale-110'
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <Link
                        to={`/product/${product.id}`}
                        className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300"
                    >
                        <Eye className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-5">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                        {product.rating} <span className="text-gray-400">({product.reviews})</span>
                    </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-primary transition-colors duration-300">
                    {product.title}
                </h3>

                {/* Category */}
                <p className="text-sm text-gray-500 mb-4 capitalize flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    {product.category.replace(/-/g, ' ')}
                </p>

                {/* View Details Button */}
                <Link
                    to={`/product/${product.id}`}
                    className="block w-full text-center border-2 border-gray-200 py-3 rounded-xl font-semibold text-gray-700 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 group-hover:shadow-lg"
                >
                    View Details
                </Link>
            </div>

            {/* Shine Effect on Hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
        </div>
    );
};

export default ProductCardV2;
