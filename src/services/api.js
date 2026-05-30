// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token (if needed)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic CRUD operations
export const fetchAll = (resource) => api.get(`/${resource}`);
export const fetchById = (resource, id) => api.get(`/${resource}/${id}`);
export const create = (resource, data) => api.post(`/${resource}`, data);
export const update = (resource, id, data) => api.put(`/${resource}/${id}`, data);
export const patch = (resource, id, data) => api.patch(`/${resource}/${id}`, data);
export const remove = (resource, id) => api.delete(`/${resource}/${id}`);

// Categories API
export const categoryApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getActive: () => api.get('/categories?status=active'),
  getProducts: (categoryId) => api.get(`/products?category_id=${categoryId}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  patch: (id, data) => api.patch(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Products API
export const productApi = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getActive: () => api.get('/products?status=active'),
  getFlashDeals: () => api.get('/products?is_flash_deal=true&status=active'),
  getFeatured: () => api.get('/products?is_featured=true&status=active'),
  getByCategory: (categoryId) => api.get(`/products?category_id=${categoryId}&status=active`),
  getNewArrivals: (limit = 10) => api.get(`/products?_sort=createdAt&_order=desc&_limit=${limit}`),
  getTopSelling: (limit = 10) => api.get(`/products?_sort=soldCount&_order=desc&_limit=${limit}`),
  search: (query) => api.get(`/products?q=${query}&status=active`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  patch: (id, data) => api.patch(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Sellers / Stores API
export const sellerApi = {
  getAll: () => api.get('/sellers'),
  getById: (id) => api.get(`/sellers/${id}`),
  getActive: () => api.get('/sellers?status=active'),
  getVerified: () => api.get('/sellers?is_verified=true'),
  getProducts: (sellerId) => api.get(`/products?seller_id=${sellerId}&status=active`),
  create: (data) => api.post('/sellers', data),
  update: (id, data) => api.put(`/sellers/${id}`, data),
  patch: (id, data) => api.patch(`/sellers/${id}`, data),
  delete: (id) => api.delete(`/sellers/${id}`),
};

// Users API
export const userApi = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  getByEmail: (email) => api.get(`/users?email=${email}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  patch: (id, data) => api.patch(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Admins API
export const adminApi = {
  getAll: () => api.get('/admins'),
  getById: (id) => api.get(`/admins/${id}`),
  create: (data) => api.post('/admins', data),
  update: (id, data) => api.put(`/admins/${id}`, data),
  patch: (id, data) => api.patch(`/admins/${id}`, data),
  delete: (id) => api.delete(`/admins/${id}`),
};

// Orders API
export const orderApi = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getUserOrders: (userId) => api.get(`/orders?userId=${userId}`),
  getByEmail: (email) => api.get(`/orders?customerEmail=${email}`),
  getByStatus: (status) => api.get(`/orders?status=${status}`),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  patch: (id, data) => api.patch(`/orders/${id}`, data),
  delete: (id) => api.delete(`/orders/${id}`),
};

// Reviews API
export const reviewApi = {
  getAll: () => api.get('/reviews'),
  getById: (id) => api.get(`/reviews/${id}`),
  getByProduct: (productId) => api.get(`/reviews?productId=${productId}`),
  getByUser: (userId) => api.get(`/reviews?userId=${userId}`),
  getApproved: () => api.get('/reviews?status=approved'),
  getPending: () => api.get('/reviews?status=pending'),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  patch: (id, data) => api.patch(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Payments API
export const paymentApi = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  getByOrder: (orderId) => api.get(`/payments?orderId=${orderId}`),
  getByUser: (userId) => api.get(`/payments?userId=${userId}`),
  getCompleted: () => api.get('/payments?status=completed'),
  getPending: () => api.get('/payments?status=pending'),
  create: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  patch: (id, data) => api.patch(`/payments/${id}`, data),
  delete: (id) => api.delete(`/payments/${id}`),
};

// Reports API
export const reportApi = {
  getAll: () => api.get('/reports'),
  getById: (id) => api.get(`/reports/${id}`),
  getByUser: (userId) => api.get(`/reports?userId=${userId}`),
  getPending: () => api.get('/reports?status=pending'),
  getByStatus: (status) => api.get(`/reports?status=${status}`),
  create: (data) => api.post('/reports', data),
  update: (id, data) => api.put(`/reports/${id}`, data),
  patch: (id, data) => api.patch(`/reports/${id}`, data),
  delete: (id) => api.delete(`/reports/${id}`),
};

// Cart API (if using backend cart, otherwise localStorage)
export const cartApi = {
  getCart: (userId) => api.get(`/cart?userId=${userId}`),
  addItem: (data) => api.post('/cart', data),
  updateItem: (id, data) => api.patch(`/cart/${id}`, data),
  removeItem: (id) => api.delete(`/cart/${id}`),
  clearCart: (userId) => api.delete(`/cart?userId=${userId}`),
};

// Wishlist API
export const wishlistApi = {
  getWishlist: (userId) => api.get(`/wishlist?userId=${userId}`),
  addItem: (data) => api.post('/wishlist', data),
  removeItem: (id) => api.delete(`/wishlist/${id}`),
  clearWishlist: (userId) => api.delete(`/wishlist?userId=${userId}`),
};

// Dashboard Stats API
export const dashboardApi = {
  getStats: async () => {
    const [users, products, orders, sellers, reviews] = await Promise.all([
      api.get('/users'),
      api.get('/products'),
      api.get('/orders'),
      api.get('/sellers'),
      api.get('/reviews'),
    ]);
    return {
      totalUsers: users.data.length,
      totalProducts: products.data.length,
      totalOrders: orders.data.length,
      totalSellers: sellers.data.length,
      totalRevenue: orders.data.reduce((sum, order) => sum + (order.total || 0), 0),
      totalReviews: reviews.data.length,
      avgRating: reviews.data.reduce((sum, r) => sum + (r.rating || 0), 0) / (reviews.data.length || 1),
    };
  },
  getRecentOrders: (limit = 5) => api.get(`/orders?_sort=createdAt&_order=desc&_limit=${limit}`),
  getTopProducts: (limit = 5) => api.get(`/products?_sort=soldCount&_order=desc&_limit=${limit}`),
};

// Settings API
export const settingsApi = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),
  patchSettings: (data) => api.patch('/settings', data),
};

// Dynamic query builder with more options
export const query = (resource, filters = {}, options = {}) => {
  const params = new URLSearchParams();
  
  // Add filters
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });
  
  // Add pagination
  if (options.page) params.append('_page', options.page);
  if (options.limit) params.append('_limit', options.limit);
  
  // Add sorting
  if (options.sortBy) params.append('_sort', options.sortBy);
  if (options.order) params.append('_order', options.order);
  
  // Add embedding
  if (options.embed) params.append('_embed', options.embed);
  
  return api.get(`/${resource}?${params.toString()}`);
};

// Helper function to build query string
export const buildQuery = (params) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      searchParams.append(key, params[key]);
    }
  });
  return searchParams.toString();
};

export default api;