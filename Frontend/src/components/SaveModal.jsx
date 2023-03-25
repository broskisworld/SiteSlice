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

const SaveModal = ({handleClose, handleSave}) => {

  return (
    <Backdrop onClick={handleClose}>
    <motion.div
      onClick={(e) => e.stopPropagation()}
      className="max-w-lg w-full h-80 bg-white rounded-md flex items-center justify-center flex-col p-8"
      variants={slideIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <p className="text-center my-8">Are you sure you want to save?<br/>This will permanantly update your files.</p>
      <button className="flex justify-center items-center h-auto bg-gradient-to-r from-red-400 to-orange-300 p-4 rounded-md text-white font-bold" onClick={handleSave}>Push Changes to Live Server</button>
    </motion.div>
  </Backdrop>
  )
  
}

export default SaveModal;