import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Plus, Edit, Trash2, Tag, Search } from 'lucide-react';
import ProductForm from '../../components/admin/ProductForm';
import DiscountModal from '../../components/admin/DiscountModal';

const ProductManagement = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProductForm, setShowProductForm] = useState(false);
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        fetchProducts();
    }, [isAdmin, navigate]);

    const fetchProducts = async () => {
        try {
            const data = await api.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = localStorage.getItem('token');
            await api.deleteProduct(id, token);
            setProducts(products.filter(p => p.id !== id));
            alert('Product deleted successfully!');
        } catch (error) {
            alert('Failed to delete product: ' + error.message);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowProductForm(true);
    };

    const handleAddNew = () => {
        setSelectedProduct(null);
        setShowProductForm(true);
    };

    const handleApplyDiscount = (product) => {
        setSelectedProduct(product);
        setShowDiscountModal(true);
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Product Management</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add New Product
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Discount</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-12 h-12 rounded object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">{product.title}</p>
                                            <p className="text-sm text-gray-500">ID: {product.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                                        {product.original_price && (
                                            <p className="text-sm text-gray-500 line-through">
                                                ${product.original_price.toFixed(2)}
                                            </p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-sm ${product.stock_quantity > 50 ? 'bg-green-100 text-green-700' :
                                            product.stock_quantity > 20 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {product.stock_quantity || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {product.discount_percentage > 0 ? (
                                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                                            -{product.discount_percentage}%
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">None</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleApplyDiscount(product)}
                                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                            title="Apply Discount"
                                        >
                                            <Tag className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No products found.</p>
                    </div>
                )}
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
                <ProductForm
                    product={selectedProduct}
                    onClose={() => {
                        setShowProductForm(false);
                        setSelectedProduct(null);
                    }}
                    onSuccess={() => {
                        fetchProducts();
                        setShowProductForm(false);
                        setSelectedProduct(null);
                    }}
                />
            )}

            {/* Discount Modal */}
            {showDiscountModal && (
                <DiscountModal
                    product={selectedProduct}
                    onClose={() => {
                        setShowDiscountModal(false);
                        setSelectedProduct(null);
                    }}
                    onSuccess={() => {
                        fetchProducts();
                        setShowDiscountModal(false);
                        setSelectedProduct(null);
                    }}
                />
            )}
        </div>
    );
};

export default ProductManagement;
