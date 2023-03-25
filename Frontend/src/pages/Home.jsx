import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/SiteSliceLogo.svg";
import TextCycleInput from "../components/TextCycleInput";
import { motion } from "framer-motion";
import isUrlHttp from 'is-url-http';
import ErrorMsg from "../components/ErrorMsg";

export default function Home() {
  const [siteLink, setSitLink] = useState(null);
  const [isValidUrl, setIsValidUrl] = useState(false);


  const handleInputChange = (value) => {
    setSitLink(value);
    setIsValidUrl(isUrlHttp(value));
    console.log(isValidHttp)
  };



  return (
    <motion.div
      className="w-full h-screen flex flex-col justify-center items-center p-8"
      initial={{ x: window.innerWidth }}
      animate={{ x: 0 }}
      exit={{ x: -window.innerWidth, transition: { duration: 0.2 } }}
      transition={{
        type: "spring",
        damping: 16,
        duration: 0.2,
      }}>
        <div className="flex flex-col items-center justify-top h-80">

      <img src={logo} alt="SiteSlice Logo" />
      <h1 className="text-2xl font-bold py-6">Edit your website without knowing how to code.</h1>
      {/* <input 
          type="text" 
          className="rounded-md border-2 border-gray-200 h-10 max-w-2xl w-full p-4 text-gray-400 transition focus:border-orange-300"
          placeholder=''
        ></input> */}
      <TextCycleInput
        siteLink={siteLink}
        parentStateSetter={handleInputChange}
        texts={["https://mywebsite.com", "www.asupercoolsite.org", "anotherwebsite.net"]}
        />
      { isValidUrl
        ? <Link
        to={`/preview?url=${siteLink}`}
        className={`mt-4 h-10 relative hover-slice flex justify-center items-center h-auto bg-gradient-to-r from-red-400 to-orange-300 px-4 py-2 text-lg rounded-md text-white font-bold`}>
        Slice it!
      </Link>
      : <ErrorMsg text="Enter a URL to start editing"/>
    }
    </div>
    
    </motion.div>
  );
}
