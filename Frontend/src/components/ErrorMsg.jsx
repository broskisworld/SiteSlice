import * as React from "react";
import { useState, useEffect } from "react";
import alert from "../assets/alert.svg"

const ErrorMsg = ({ text }) => {
  

  return (
    <div className="mt-4 h-10 text-gray-500">
      { text }
    </div>
  );
};

export default ErrorMsg;