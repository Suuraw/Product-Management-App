import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, LogOut, Search } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Product } from '../types';
import rupee from "../assests/rupee.png";

export default function ProductListPage() {
  const { isAdmin, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceMin: '',
    priceMax: '',
    rating: '',
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (params: URLSearchParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data);
    } catch (err) {
      setError('Error loading products');
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on page load
  React.useEffect(() => {
    if (isAuthenticated) {
      const params = new URLSearchParams({ page: '1', limit: '10' });
      fetchProducts(params);
    }
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      toast.error('Only admins can delete products');
      return;
    }
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.search) {
      params.append('search', filters.search);
    } else {
      params.append('page', '1');
      params.append('limit', '10');
      if (filters.category) params.append('category', filters.category);
      if (filters.priceMin) params.append('priceMin', filters.priceMin);
      if (filters.priceMax) params.append('priceMax', filters.priceMax);
      if (filters.rating) params.append('rating', filters.rating);
    }
    fetchProducts(params);
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <div className="flex space-x-4">
          {isAdmin && (
            <Link
              to="/products/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Filter and Search UI */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Search products..."
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          {!filters.search && (
            <>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Electronics"
                />
              </div>
              <div>
                <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700">
                  Min Price
                </label>
                <input
                  type="number"
                  id="priceMin"
                  name="priceMin"
                  value={filters.priceMin}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="500"
                />
              </div>
              <div>
                <label htmlFor="priceMax" className="block text-sm font-medium text-gray-700">
                  Max Price
                </label>
                <input
                  type="number"
                  id="priceMax"
                  name="priceMax"
                  value={filters.priceMax}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="1500"
                />
              </div>
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                  Min Rating
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={filters.rating}
                  onChange={handleFilterChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="4"
                />
              </div>
            </>
          )}
          <div className="sm:self-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={`http://localhost:3000/uploads/${product.image}`}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
              <p className="mt-1 text-gray-500">{product.description}</p>
              <p className="mt-2 text-xl font-semibold text-gray-900">
                <img src={rupee} alt="Rupee" className="inline h-5 w-5 mr-1" />
                {product.price.toFixed(2)}
              </p>
              <p className="mt-1 text-sm text-gray-600">Rating: {product.rating}</p>
              <p className="mt-1 text-sm text-gray-600">Category: {product.category}</p>
              {isAdmin && (
                <div className="mt-4 flex space-x-2">
                  <Link
                    to={`/products/${product.id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}