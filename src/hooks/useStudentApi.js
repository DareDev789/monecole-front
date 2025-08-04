import { useState, useEffect } from 'react';
import { studentApi } from '../services/api';

export const useStudentApi = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 20,
  });

  const fetchAllStudents = async (page = 1) => {
    try {
      setLoading(true);
      const response = await studentApi.getAll({ params: { page } });
      setStudents(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const createStudents = async (data) => {
    try {
      const response = await studentApi.create(data);
      await fetchAllStudents();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data };
    }
  };

  const updateStudents = async (id, data) => {
    try {
      const response = await studentApi.update(id, data);
      await fetchAllStudents(pagination.current_page);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data };
    }
  };

  const deleteStudents = async (id) => {
    try {
      await studentApi.delete(id);
      await fetchAllStudents(pagination.current_page);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data };
    }
  };

  return {
    students,
    loading,
    error,
    pagination,
    fetchAllStudents,
    createStudents,
    updateStudents,
    deleteStudents,
  };
};