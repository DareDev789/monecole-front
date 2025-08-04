import axios from 'axios';

// Instance axios de base
const api = axios.create({
  // withCredentials: true, // Retiré par défaut
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Configuration de l'API
export const configureApi = (baseURL, token) => {
  api.defaults.baseURL = baseURL;
  
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
  
  return api;
};

// Endpoints API
export const schoolYearApi = {
  getAll: () => api.get('/school-years'),
  getById: (id) => api.get(`/school-years/${id}`),
  create: (data) => api.post('/school-years', data),
  update: (id, data) => api.put(`/school-years/${id}`, data),
  delete: (id) => api.delete(`/school-years/${id}`),
};

export default api;