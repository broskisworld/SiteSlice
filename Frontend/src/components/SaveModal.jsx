import {motion} from "framer-motion";
import Backdrop from "./Backdrop";

const slideIn = {
  hidden:{
    x: "100vw",
    opacity: 0,
  }, 
  visible: {
    x: "0",
    opacity: 1,
    transition: {
      duration: 0.2, 
      type: "spring", 
      damping: 25,
      stiffness: 200
    }
  }, 
  exit: {
    x: "-100vw",
    opacity: 0,
  }
}

const SaveModal = ({handleClose}) => {

  return (
    <Backdrop onClick={handleClose}>
    <motion.div
      onClick={(e) => e.stopPropagation()}
      className="w-40 h-40 bg-red-500"
      variants={slideIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <p>Testing 123</p>
    </motion.div>
  </Backdrop>
  )
  
}

export default SaveModal;