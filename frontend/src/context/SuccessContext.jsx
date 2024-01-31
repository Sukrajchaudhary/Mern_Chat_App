import React, { useContext, createContext, useState } from "react";
const SuccessMessageContex = createContext();

export const useSuccessContext = () => {
  return useContext(SuccessMessageContex);
};
export const SuccessProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessmessage] = useState(null);
  return (
    <SuccessMessageContex.Provider
      value={{ showModal, setShowModal, successMessage, setSuccessmessage }}
    >
      {children}
    </SuccessMessageContex.Provider>
  );
};
