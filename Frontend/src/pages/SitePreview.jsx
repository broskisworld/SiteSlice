import Thumbnail from "react-webpage-thumbnail";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const SitePreview = () => {
  const [searchParams] = useSearchParams();
  return (
    <motion.div
      className="flex w-screen h-screen place-content-center bg-red-500"
      initial={{ x: window.innerWidth }}
      animate={{ x: 0 }}
      exit={{ x: window.innerWidth }}
      transition={{
        type: "spring",
        damping: 16,
        duration: 0.2,
      }}>
      <h1>Is this your site?</h1>
      <Thumbnail
        url={searchParams.get("url")}
        width={800}
        height={800}
        iframeHeight={1920}
        iframeWidth={1080}
      />
      <a href="/editor">Yes</a>
    </motion.div>
  );
};

export default SitePreview;
