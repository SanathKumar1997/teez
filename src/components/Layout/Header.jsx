import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Mobile Menu & Logo */}
                <div className="flex items-center gap-4">
                    <button className="md:hidden p-2 hover:bg-gray-100 rounded-full">
                        <Menu className="w-6 h-6" />
                    </button>
                    <Link to="/" className="flex items-center">
                        <img src="/logo.svg" alt="TEEZI Logo" className="h-10" />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/catalog" className="text-sm font-medium hover:text-accent transition-colors">
                        Shop
                    </Link>
                    <Link to="/new-arrivals" className="text-sm font-medium hover:text-accent transition-colors">
                        New Arrivals
                    </Link>
                    <Link to="/design" className="text-sm font-medium hover:text-accent transition-colors">
                        Design Your Own
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-gray-100 rounded-full px-4 py-2 mr-2">
                        <Search className="w-4 h-4 text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search shirts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-32 lg:w-64"
                        />
                    </form>

                    {user ? (
                        <div className="flex items-center gap-2 ml-2">
                            <Link to="/dashboard" className="text-sm font-medium hidden md:block hover:text-accent">
                                Hi, {user.name.split(' ')[0]}
                            </Link>
                            {user.is_admin && (
                                <Link to="/admin" className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full hover:bg-purple-200 font-medium">
                                    Admin
                                </Link>
                            )}
                            <button onClick={logout} className="text-xs text-gray-500 hover:text-red-500">Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" className="p-2 hover:bg-gray-100 rounded-full">
                            <User className="w-6 h-6" />
                        </Link>
                    )}

                    <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full relative">
                        <ShoppingCart className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-accent text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
