// @module frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
import axios from 'axios';

const api = axios.create({ baseURL: '/api', timeout: 15000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vendora_token') || sessionStorage.getItem('vendora_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !String(error.config?.url || '').includes('/auth/login')) {
      localStorage.removeItem('vendora_token');
      sessionStorage.removeItem('vendora_token');
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};
export const productAPI = {
  list: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  categories: () => api.get('/products/meta/categories'),
  vendors: () => api.get('/products/meta/vendors'),
};
export const cartAPI = {
  get: () => api.get('/customer/cart'),
  add: (data) => api.post('/customer/cart', data),
  update: (cartId, quantity) => api.put(`/customer/cart/${cartId}`, { quantity }),
  remove: (cartId) => api.delete(`/customer/cart/${cartId}`),
};
export const orderAPI = {
  place: (data = {}) => api.post('/customer/orders', data),
  list: (params) => api.get('/customer/orders', { params }),
  get: (orderId) => api.get(`/customer/orders/${orderId}`),
};
export const notificationAPI = {
  list: () => api.get('/customer/notifications'),
  markRead: (id) => api.patch(`/customer/notifications/${id}/read`),
  markAll: () => api.patch('/customer/notifications/read-all'),
};
export const vendorAPI = {
  getDashboard: () => api.get('/vendor/dashboard'),
  getProducts: (params) => api.get('/vendor/products', { params }),
  createProduct: (data) => api.post('/vendor/products', data),
  updateProduct: (id, data) => api.put(`/vendor/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/vendor/products/${id}`),
  getOrders: (params) => api.get('/vendor/orders', { params }),
  updateOrderStatus: (orderId, status) => api.patch(`/vendor/orders/${orderId}/status`, { status }),
  getAnalytics: () => api.get('/vendor/analytics'),
};
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUser: (id) => api.patch(`/admin/users/${id}/suspend`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getVendors: (params) => api.get('/admin/vendors', { params }),
  updateVendorStatus: (id, status) => api.patch(`/admin/vendors/${id}/status`, { status }),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  getReports: (params) => api.get('/admin/reports', { params }),
};

export const getErrorMessage = (error, fallback = 'Something went wrong.') =>
  error.response?.data?.message || error.message || fallback;

export default api;
