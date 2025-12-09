import axios from 'axios';
import Notiflix from 'notiflix';

// Instance axios de base
const api = axios.create({
    // withCredentials: true, // Retiré par défaut
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const status = error.response.status;
            const message =
                error.response.data?.message ||
                `Erreur ${status} : ${error.response.statusText || 'Une erreur est survenue'}`;

            if (status === 401) {
                Notiflix.Notify.failure("Session expirée, veuillez vous reconnecter.");
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                window.location.href = '/login';
            } else {
                Notiflix.Notify.failure(message);
            }

        } else if (error.request) {
            Notiflix.Notify.failure("Aucune réponse du serveur. Vérifiez votre connexion.");
        } else {
            Notiflix.Notify.failure(`Erreur : ${error.message}`);
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
    delete: (id) => api.delete(`/classes/${id}`),
};

export const studentApi = {
    getAll: (page = 1, params = {}) => api.get(`/students?page=${page}`, { params }),
    getById: (id) => api.get(`/students/${id}`),
    create: (data) => api.post('/students', data),
    update: (id, data) => api.put(`/students/${id}`, data),
    delete: (id) => api.delete(`/students/${id}`),
    currentStudentsClass: (classId) => api.get(`/current-year/students/class/${classId}`),
    currentStudentsClassWithTerms: (data) => api.post(`/current-year/students/class/with-terms`, data),
    search: (q) => api.get(`/students/search?q=${q}`),
};

export const enrollmentsApi = {
    getAll: (params = {}) => api.get(`/enrollments`, { params }),
    getById: (id) => api.get(`/enrollments/${id}`),
    create: (data) => api.post('/enrollments', data),
    update: (id, data) => api.put(`/enrollments/${id}`, data),
    delete: (id) => api.delete(`/enrollments/${id}`)
};

export const SubjectsApi = {
    getAll: (page = 1, params = {}) => api.get(`/subjects?page=${page}`, { params }),
    getById: (id) => api.get(`/subjects/${id}`),
    create: (data) => api.post('/subjects', data),
    update: (id, data) => api.put(`/subjects/${id}`, data),
    delete: (id) => api.delete(`/subjects/${id}`),
    retirer: (data) => api.delete(`/class-subjects/remove`, { data }),
    getOutOfClass: (classeId) =>
        api.get('/subjects/out-of-class', { params: { classeId } }),
    GetSubjectClass: (classId) => api.get(`/subjects/class/${classId}`),
    GetSujectNotesByClassAndTerm : (data) => api.post(`/subjects/class/note-by-class`, data),
};

export const personnelsApi = {
    getAll: (page = 1, params = {}) => api.get(`/employees?page=${page}`, { params }),
    getById: (id) => api.get(`/employees/${id}`),
    create: (data) => api.post('/employees', data),
    update: (id, data) => api.put(`/employees/${id}`, data),
    delete: (id) => api.delete(`/employees/${id}`),
    DeleteMany: (ids) => api.post(`employees/destroy-many`, { ids })
};

export const usersApi = {
    getAll: (page = 1, params = {}) => api.get(`/users?page=${page}`, { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
    DeleteMany: (ids) => api.post(`users/bulk-delete`, { ids })
};

export const termsApi = {
    getAll: (page = 1, params = {}) => api.get(`/terms?page=${page}`, { params }),
    getById: (id) => api.get(`/terms/${id}`),
    create: (data) => api.post('/terms', data),
    update: (id, data) => api.put(`/terms/${id}`, data),
    delete: (id) => api.delete(`/terms/${id}`),
    current: () => api.get(`terms/current-year`)
};

export const LoginApi = {
    logout: () => api.post(`/logout`),
};

export const PaiementApi = {
    getAll: (filters = {}) => api.get('/payments', { params: filters }),
    getByStudent: (studentId) => api.get(`/payments/by-student/${studentId}`),
    getByClass: (classId) => api.get(`/payments/by-class/${classId}`),
    getByMonth: (month) => api.get(`/payments/by-month/${month}`),
    delete: (id) => api.delete(`/payments/${id}`),
    save: (data) => api.post(`/payments`, data),
    update: (id, data) => api.put(`/payments/${id}`, data),
};

export const GradeApi = {
    bulk : (data) =>api.post("/grades/bulk", data),
}


export default api;