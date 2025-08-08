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
    getCurrent: () => api.get('/schoolyears/current'),
    setCurrent: (id) => api.post(`/school-years/${id}/set-current`),
    create: (data) => api.post('/school-years', data),
    update: (id, data) => api.put(`/school-years/${id}`, data),
    enrollStudent: (studentId, classId, feePaid) =>
        api.post('/enrollments', { student_id: studentId, class_id: classId, registration_fee_paid: feePaid })
};

export const classApi = {
    getAll: (params) => api.get('/classes', { params }),
    getById: (id) => api.get(`/classes/${id}`),
    create: (data) => api.post('/classes', data),
    update: (id, data) => api.put(`/classes/${id}`, data),
    delete: (id) => api.delete(`/classes/${id}`)
};

export const studentApi = {
    getAll: (page = 1, params = {}) => api.get(`/students?page=${page}`, { params }),
    getById: (id) => api.get(`/students/${id}`),
    create: (data) => api.post('/students', data),
    update: (id, data) => api.put(`/students/${id}`, data),
    delete: (id) => api.delete(`/students/${id}`)
};

export const enrollmentsApi = {
    getAll: (page = 1, params = {}) => api.get(`/enrollments`, { params }),
    getById: (id) => api.get(`/enrollments/${id}`),
    create: (data) => api.post('/enrollments', data),
    update: (id, data) => api.put(`/enrollments/${id}`, data),
    delete: (id) => api.delete(`/enrollments/${id}`)
};

export default api;