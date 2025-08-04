import { useState, useEffect } from 'react';
import { useSchoolYears } from '../hooks/useSchoolYears';
import SchoolYearList from '../views/school-year/SchoolYearList';
import Pagination from '../Components/ui/Pagination';

const SchoolYearsPage = () => {
  const {
    schoolYears,
    loading,
    error,
    pagination,
    fetchSchoolYears,
    createSchoolYear,
    updateSchoolYear,
    deleteSchoolYear,
  } = useSchoolYears();

  const handlePageChange = (page) => {
    fetchSchoolYears(page);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SchoolYearList
        schoolYears={schoolYears}
        loading={loading}
        error={error}
        onCreate={createSchoolYear}
        onUpdate={updateSchoolYear}
        onDelete={deleteSchoolYear}
      />
      
      {pagination.total > pagination.per_page && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.current_page}
            totalPages={Math.ceil(pagination.total / pagination.per_page)}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default SchoolYearsPage;