import * as React from "react";
import { useState, useEffect } from "react";
import alert from "../assets/alert.svg"

const ErrorMsg = ({ text }) => {
  

  return (
    <div className="mt-4 h-10 relative flex justify-center items-center h-auto bg-gradient-to-r from-red-400 to-orange-300 px-4 py-2 text-lg rounded-md text-white font-bold">
      { text }
    </div>
  );
};

export default ErrorMsg;