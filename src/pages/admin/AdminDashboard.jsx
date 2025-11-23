import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Package, Users, DollarSign, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }

        const fetchStats = async () => {
            try {
                const products = await api.getProducts();
                setStats(prev => ({ ...prev, totalProducts: products.length }));
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [isAdmin, navigate]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Products</p>
                            <p className="text-2xl font-bold mt-1">{stats.totalProducts}</p>
                        </div>
                        <Package className="w-10 h-10 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <p className="text-2xl font-bold mt-1">{stats.totalOrders}</p>
                        </div>
                        <Users className="w-10 h-10 text-green-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-bold mt-1">${stats.totalRevenue.toFixed(2)}</p>
                        </div>
                        <DollarSign className="w-10 h-10 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Growth</p>
                            <p className="text-2xl font-bold mt-1">+12%</p>
                        </div>
                        <TrendingUp className="w-10 h-10 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-accent hover:bg-gray-50 transition-all text-left"
                    >
                        <Package className="w-6 h-6 text-accent mb-2" />
                        <h3 className="font-semibold">Manage Products</h3>
                        <p className="text-sm text-gray-500">Add, edit, or remove products</p>
                    </button>

                    <button
                        onClick={() => navigate('/admin/products')}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-accent hover:bg-gray-50 transition-all text-left"
                    >
                        <DollarSign className="w-6 h-6 text-accent mb-2" />
                        <h3 className="font-semibold">Apply Discounts</h3>
                        <p className="text-sm text-gray-500">Manage product discounts</p>
                    </button>

                    <button
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-accent hover:bg-gray-50 transition-all text-left"
                    >
                        <Users className="w-6 h-6 text-accent mb-2" />
                        <h3 className="font-semibold">View Orders</h3>
                        <p className="text-sm text-gray-500">Monitor customer orders</p>
                    </button>
                </div>
            </div>

            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-accent to-purple-600 text-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
                <p className="opacity-90">You have admin access to manage the TEEZ store.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
