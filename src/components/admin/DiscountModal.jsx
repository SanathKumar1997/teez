import React, { useState } from 'react';
import { api } from '../../services/api';
import { X, Tag } from 'lucide-react';

const DiscountModal = ({ product, onClose, onSuccess }) => {
    const [discountPercentage, setDiscountPercentage] = useState(product?.discount_percentage || 0);
    const [loading, setLoading] = useState(false);

    const originalPrice = product?.original_price || product?.price;
    const discountedPrice = originalPrice * (1 - discountPercentage / 100);

    const handleApply = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await api.applyDiscount(product.id, discountPercentage, token);
            alert('Discount applied successfully!');
            onSuccess();
        } catch (error) {
            alert('Failed to apply discount: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Tag className="w-6 h-6 text-accent" />
                        Apply Discount
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Product Info */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                            src={product?.image}
                            alt={product?.title}
                            className="w-16 h-16 rounded object-cover"
                        />
                        <div>
                            <h3 className="font-semibold">{product?.title}</h3>
                            <p className="text-sm text-gray-500">Current Price: ${product?.price.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Discount Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount Percentage
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={discountPercentage}
                                onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
                                min="0"
                                max="100"
                                step="1"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-lg font-semibold"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                                %
                            </span>
                        </div>
                        <input
                            type="range"
                            value={discountPercentage}
                            onChange={(e) => setDiscountPercentage(parseFloat(e.target.value))}
                            min="0"
                            max="100"
                            step="5"
                            className="w-full mt-2"
                        />
                    </div>

                    {/* Price Preview */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Original Price:</span>
                            <span className="font-semibold text-gray-900">${originalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Discount:</span>
                            <span className="font-semibold text-red-600">-{discountPercentage}%</span>
                        </div>
                        <div className="border-t border-gray-300 pt-2 flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">New Price:</span>
                            <span className="text-2xl font-bold text-accent">${discountedPrice.toFixed(2)}</span>
                        </div>
                        {discountPercentage > 0 && (
                            <div className="text-center">
                                <span className="text-sm text-green-600 font-medium">
                                    Save ${(originalPrice - discountedPrice).toFixed(2)}!
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleApply}
                            disabled={loading}
                            className="flex-1 bg-accent text-white py-3 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 font-semibold"
                        >
                            {loading ? 'Applying...' : 'Apply Discount'}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscountModal;
