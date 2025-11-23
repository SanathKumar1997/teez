import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-primary">
                    ${product.price.toFixed(2)}
                </div>
                {/* Quick Add Button */}
                <button className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-md translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent hover:text-white">
                    <ShoppingCart className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4">
                <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-500 font-medium">{product.rating} ({product.reviews})</span>
                </div>
                <h3 className="font-semibold text-lg mb-1 truncate">{product.title}</h3>
                <p className="text-sm text-gray-500 mb-4 capitalize">{product.category}</p>

                <Link
                    to={`/product/${product.id}`}
                    className="block w-full text-center border border-gray-200 py-2 rounded-lg font-medium hover:border-primary hover:bg-primary hover:text-white transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
