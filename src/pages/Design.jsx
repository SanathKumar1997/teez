import React, { useState, useRef } from 'react';
import { Upload, ShoppingCart, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Design = () => {
    const [designImage, setDesignImage] = useState(null);
    const [shirtColor, setShirtColor] = useState('white');
    const fileInputRef = useRef(null);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setDesignImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleAddToCart = () => {
        if (!designImage) return;

        const customProduct = {
            id: Date.now(),
            title: 'Custom Design Tee',
            price: 34.99,
            image: designImage, // In a real app, this would be a composite image
            size: 'L', // Default for MVP
            color: shirtColor
        };

        addToCart(customProduct, 1, 'L', shirtColor);
        navigate('/cart');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Design Your Own</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* Preview Area */}
                <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center relative min-h-[400px] border border-gray-200">
                    <div
                        className="w-80 h-96 relative bg-contain bg-no-repeat bg-center shadow-xl rounded-lg"
                        style={{
                            backgroundColor: shirtColor === 'white' ? '#fff' : shirtColor,
                            // Simple shirt shape using CSS clip-path or just a colored box for MVP
                            maskImage: 'url(https://upload.wikimedia.org/wikipedia/commons/2/24/Blue_Tshirt.jpg)', // Placeholder mask if possible, or just box
                        }}
                    >
                        {/* Shirt Placeholder Visual */}
                        <div className={`w-full h-full flex items-center justify-center rounded-lg shadow-inner ${shirtColor === 'black' ? 'bg-gray-900' : 'bg-white'}`}>
                            {designImage ? (
                                <img src={designImage} alt="Custom Design" className="max-w-[60%] max-h-[60%] object-contain" />
                            ) : (
                                <p className="text-gray-400 text-sm">Your Design Here</p>
                            )}
                        </div>
                    </div>

                    {/* Color Picker Overlay */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white p-2 rounded-full shadow-lg">
                        {['white', 'black', 'navy', 'red'].map(color => (
                            <button
                                key={color}
                                onClick={() => setShirtColor(color)}
                                className={`w-8 h-8 rounded-full border border-gray-200 ${shirtColor === color ? 'ring-2 ring-primary' : ''}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold mb-4">1. Upload Design</h2>
                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-all"
                        >
                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="font-medium">Click to upload image</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold mb-4">2. Product Details</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Base Product</span>
                                <span className="font-medium">Premium Cotton Tee</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Price</span>
                                <span className="font-bold text-xl text-primary">$34.99</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!designImage}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Add Custom Tee to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Design;
