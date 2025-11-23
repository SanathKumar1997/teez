import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/logo.svg" alt="TEEZ.in Logo" className="h-10" />
                            <h3 className="text-2xl font-bold text-white">TEEZ.in</h3>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Premium quality t-shirts designed for comfort, style, and self-expression. Wear your story.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg text-white">Shop</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/catalog" className="hover:text-white transition-colors">All Products</Link></li>
                            <li><Link to="/catalog?category=new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link to="/catalog?category=programming" className="hover:text-white transition-colors">Programming</Link></li>
                            <li><Link to="/catalog?category=geeky" className="hover:text-white transition-colors">Geeky</Link></li>
                            <li><Link to="/catalog?category=vintage" className="hover:text-white transition-colors">Vintage</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg text-white">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
                            <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold mb-4 text-lg text-white">Get in Touch</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <a href="mailto:support@teez.in" className="hover:text-white transition-colors">
                                    support@teez.in
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                                    +1 (234) 567-890
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>123 Fashion Street, NY 10001</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} TEEZ.in. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm text-gray-500">
                            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
