import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">TEEZ</h3>
                        <p className="text-gray-400 text-sm">
                            Premium quality shirts for every occasion. Design your own or shop our curated collection.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/catalog" className="hover:text-white">All Products</Link></li>
                            <li><Link to="/catalog?category=t-shirts" className="hover:text-white">T-Shirts</Link></li>
                            <li><Link to="/catalog?category=polos" className="hover:text-white">Polos</Link></li>
                            <li><Link to="/catalog?category=long-sleeve" className="hover:text-white">Long Sleeve</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                            <li><Link to="/returns" className="hover:text-white">Returns</Link></li>
                            <li><Link to="/shipping" className="hover:text-white">Shipping Info</Link></li>
                            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Stay Connected</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe to our newsletter for exclusive offers.
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 text-white px-4 py-2 rounded-l-md outline-none w-full"
                            />
                            <button className="bg-accent px-4 py-2 rounded-r-md font-medium hover:bg-blue-600 transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} TEEZ. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
