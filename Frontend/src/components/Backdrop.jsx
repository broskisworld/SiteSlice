import { motion } from "framer-motion";

const Backdrop = ({ children, onClick }) => {

  return (
    <motion.div
      className="absolute w-full h-full top-0 left-0 bg-black bg-opacity-25 flex items-center justify-center"
      onClick={onClick}
      initial={{opacity: 0}}
      animate={{ opacity: 1}}
      exit={{opacity: 0}}
    >
      {children}
    </motion.div>
  )
};

export default Backdrop;