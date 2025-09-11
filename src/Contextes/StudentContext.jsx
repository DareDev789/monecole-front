// context/StudentContext.js
"use client";
import { createContext, useContext, useState } from "react";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedClassName, setSelectedClassName] = useState(null);

  return (
    <StudentContext.Provider value={{ selectedStudent, setSelectedStudent, selectedClassName, setSelectedClassName }}>
      {children}
    </StudentContext.Provider>
  );
};

// Hook personnalisé pour simplifier l'utilisation
export const useStudent = () => useContext(StudentContext);
