import Thumbnail from "react-webpage-thumbnail";
import { useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const SitePreview = () => {
  const [searchParams] = useSearchParams();

  const nextButtonToPush = useRef(null)

  const handleKeyDown = (event) => {
    console.log("CLICK")
    if (event.key === 'Enter') {
        nextButtonToPush.current.click()
    }
  }

  return (
    <motion.div
      className="flex w-screen h-screen justify-center items-center flex-col"
      onKeyDown={handleKeyDown}
      initial={{ x: window.innerWidth }}
      animate={{ x: 0 }}
      exit={{ x: -window.innerWidth, transition: { duration: 0.2 } }}
      transition={{
        type: "spring",
        damping: 16,
        duration: 0.2,
      }}>
      <h1 className="text-2xl font-bold py-6">Is this your site?</h1>
      <Thumbnail
        url={searchParams.get("url")}
        width={400}
        height={300}
        
      />
      <Link
        ref={nextButtonToPush}
        to={`/editor?url=${searchParams.get("url")}`}
        className="mt-4 relative flex justify-center items-center h-auto bg-gradient-to-r from-red-400 to-orange-300 px-4 py-2 text-lg rounded-md text-white font-bold">
        That's the one
      </Link>
    </motion.div>
  );
};

export default SitePreview;
