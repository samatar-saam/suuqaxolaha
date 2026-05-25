// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic CRUD operations
export const fetchAll = (resource) => api.get(`/${resource}`);
export const fetchById = (resource, id) => api.get(`/${resource}/${id}`);
export const create = (resource, data) => api.post(`/${resource}`, data);
export const update = (resource, id, data) => api.put(`/${resource}/${id}`, data);
export const remove = (resource, id) => api.delete(`/${resource}/${id}`);

// Categories API
export const categoryApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getProducts: (categoryId) => api.get(`/products?category_id=${categoryId}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Products API
export const productApi = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFlashDeals: () => api.get('/products?is_flash_deal=true'),
  getFeatured: () => api.get('/products?is_featured=true'),
  getByCategory: (categoryId) => api.get(`/products?category_id=${categoryId}`),
  search: (query) => api.get(`/products?q=${query}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Sellers API
export const sellerApi = {
  getAll: () => api.get('/sellers'),
  getById: (id) => api.get(`/sellers/${id}`),
  getProducts: (sellerId) => api.get(`/products?seller_id=${sellerId}`),
  create: (data) => api.post('/sellers', data),
  update: (id, data) => api.put(`/sellers/${id}`, data),
  delete: (id) => api.delete(`/sellers/${id}`),
};

// Dynamic query builder
export const query = (resource, filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null) {
      params.append(key, filters[key]);
    }
  });
  return api.get(`/${resource}?${params.toString()}`);
};

export default api;