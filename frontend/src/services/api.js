const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token) => localStorage.setItem('token', token);
export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({ success: false, message: 'Server communication error' }));
  if (!response.ok || !data.success) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data.data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

  // Categories
  getCategories: () => request('/categories'),
  createCategory: (cat) => request('/categories', { method: 'POST', body: JSON.stringify(cat) }),
  updateCategory: (id, cat) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(cat) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  // Providers
  getProviders: (categoryId, availableOnly) => {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (availableOnly !== undefined) params.append('availableOnly', availableOnly);
    return request(`/providers?${params.toString()}`);
  },
  getProviderById: (id) => request(`/providers/${id}`),
  updateAvailability: (id, available) => request(`/providers/${id}/availability`, {
    method: 'PATCH',
    body: JSON.stringify({ available }),
  }),
  updateProviderProfile: (id, data) => request(`/providers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getProviderReviews: (id) => request(`/providers/${id}/reviews`),

  // Bookings
  createBooking: (customerId, bookingData) => request(`/bookings/customer/${customerId}`, {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),
  getCustomerBookings: (customerId) => request(`/bookings/customer/${customerId}`),
  getProviderBookings: (providerId) => request(`/bookings/provider/${providerId}`),
  getBookingById: (id) => request(`/bookings/${id}`),
  updateBookingStatus: (id, status, reason, userId) => {
    const params = userId ? `?userId=${userId}` : '';
    return request(`/bookings/${id}/status${params}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  },
  cancelBooking: (id, customerId, reason) => {
    return request(`/bookings/${id}/cancel?customerId=${customerId}&reason=${encodeURIComponent(reason || '')}`, {
      method: 'POST',
    });
  },
  addReview: (customerId, reviewData) => request(`/bookings/reviews?customerId=${customerId}`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),

  // Notifications
  getNotifications: (userId) => request(`/notifications/${userId}`),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: (userId) => request(`/notifications/read-all/${userId}`, { method: 'PATCH' }),

  // Admin
  getAllUsers: () => request('/admin/users'),
  getAllBookingsAdmin: () => request('/admin/bookings'),
  getAdminStats: () => request('/admin/stats'),
};
