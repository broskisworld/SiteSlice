import * as React from "react";
import { useState, useEffect } from "react";

const TextCycleInput = ({ texts, parentStateSetter, siteLink }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => (index + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [texts]);

  return (
    <div className="max-w-xl w-full">
      <input
        className="cycle-input rounded-md border-2 border-gray-200 h-10 max-w-2xl w-full p-4 text-gray-400 transition focus:border-orange-300"
        type="text"
        placeholder={texts[index]}
        onChange={(e) => {
          parentStateSetter(e.target.value);
        }}
      />
      <style>{`
        .cycle-input::placeholder {
          animation: fade-in-out 3s ease-in-out infinite;
          -webkit-animation: fade-in-out 3s ease-in-out infinite;
        }

        @keyframes fade-in-out {
          0% {
            color: white;
            opacity: 0;
          }
          50% {
            color: black;
            opacity: 1;
          }
          100% {
            color: white;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TextCycleInput;
