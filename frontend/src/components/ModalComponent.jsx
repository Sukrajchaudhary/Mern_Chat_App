import React, { useState, useEffect } from "react";
import { useSuccessContext } from "../context/SuccessContext";

const ModalComponent = () => {
const {showModal, setShowModal, successMessage}=useSuccessContext()

  useEffect(() => {
    // Use useEffect to handle the setTimeout for hiding the modal
    const timeoutId = setTimeout(() => {
      setShowModal(false);
    }, 1000);

    // Clean up the timeout when the component is unmounted
    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array ensures that the effect runs only once after the initial render

  return (
    <>
      {/* component */}
      {showModal && (
        <div className="space-y-5 z-10">
          <div className="relative mx-auto max-w-[400px] rounded-md border border-slate-50 bg-gray-600 p-4 text-sm shadow-lg">
            <button className="top-4 absolute right-4 ml-auto text-slate-500 hover:text-slate-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="mt-1 text-white">
                {successMessage}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalComponent;
