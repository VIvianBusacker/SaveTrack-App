// import React from "react";
// import { FaSpinner } from "react-icons/fa";

const Loading = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
      <img
          className="animate-bounce w-10 h-10"
          src="src/assets/logo.png"
          alt="Logo"
        />
        {/* <FaSpinner className="animate-spin text-blue-400 mt-4" size={36} /> */}
      </div>
      <p className="mt-4 text-lg font-medium text-gray-600">Loading...</p>
    </div>
  );
};

export default Loading;
