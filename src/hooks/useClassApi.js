import { useState, useEffect } from 'react';
import { classApi } from '../services/api';

export const useClassApi = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 20,
  });

  const fetchAllClass = async (page = 1) => {
    try {
      setLoading(true);
      const response = await classApi.getAll({ params: { page } });
      setClasses(response.data.data);
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
    fetchAllClass();
  }, []);

  const createClass = async (data) => {
    try {
      const response = await classApi.create(data);
      await fetchAllClass();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data };
    }
  };

  const updateClass = async (id, data) => {
    try {
      const response = await classApi.update(id, data);
      await fetchAllClass(pagination.current_page);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data };
    }
  };

  const deleteClass = async (id) => {
    try {
      await classApi.delete(id);
      await fetchAllClass(pagination.current_page);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data };
    }
  };

  return {
    classes,
    loading,
    error,
    pagination,
    fetchAllClass,
    createClass,
    updateClass,
    deleteClass,
  };
};