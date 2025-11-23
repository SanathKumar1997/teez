import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Package, User, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }

        if (user) {
            const fetchOrders = async () => {
                try {
                    const data = await api.getUserOrders(user.email);
                    setOrders(data);
                } catch (error) {
                    console.error('Failed to fetch orders:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrders();
        }
    }, [user, authLoading, navigate]);

    if (authLoading || loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Profile Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-gray-500" />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">{user?.name}</h2>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <button className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg font-medium text-primary">
                                Order History
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-600">
                                Profile Settings
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content - Order History */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Package className="w-5 h-5 text-accent" /> Order History
                        </h2>

                        {orders.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p>You haven't placed any orders yet.</p>
                                <a href="/catalog" className="text-accent hover:underline mt-2 inline-block">Start Shopping</a>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                                            <div>
                                                <p className="text-sm text-gray-500">Order ID</p>
                                                <p className="font-bold">#{order.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Date</p>
                                                <p className="font-medium flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Total</p>
                                                <p className="font-bold text-accent">${order.total_amount.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    Completed
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-4 items-center">
                                                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{item.title}</p>
                                                        <p className="text-xs text-gray-500">Qty: {item.quantity} | Size: {item.size}</p>
                                                    </div>
                                                    <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
