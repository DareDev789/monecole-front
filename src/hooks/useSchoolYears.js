import { useState, useEffect } from 'react';
import { schoolYearApi } from '../services/api';

export const useSchoolYears = () => {
  const [schoolYears, setSchoolYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 20,
  });

  const fetchSchoolYears = async (page = 1) => {
    try {
      setLoading(true);
      const response = await schoolYearApi.getAll({ params: { page } });
      setSchoolYears(response.data.data);
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
    fetchSchoolYears();
  }, []);

  const createSchoolYear = async (data) => {
    try {
      const response = await schoolYearApi.create(data);
      await fetchSchoolYears();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data };
    }
  };

  const updateSchoolYear = async (id, data) => {
    try {
      const response = await schoolYearApi.update(id, data);
      await fetchSchoolYears(pagination.current_page);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data };
    }
  };

  const deleteSchoolYear = async (id) => {
    try {
      await schoolYearApi.delete(id);
      await fetchSchoolYears(pagination.current_page);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data };
    }
  };

  return {
    schoolYears,
    loading,
    error,
    pagination,
    fetchSchoolYears,
    createSchoolYear,
    updateSchoolYear,
    deleteSchoolYear,
  };
};