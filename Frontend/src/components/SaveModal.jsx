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





const SaveModal = ({handleClose, handleSave, parentStateSetter, formIsValid, setFormStatus, startPort}) => {

  const tryToSave = () => {
    console.log("IS FORM VALID", formIsValid)
    // if(formIsValid){
    //   return handleSave();
    // }
    // else {
    //   setFormStatus(false);
    // }
    return handleSave();
  }

  return (
    <Backdrop onClick={handleClose}>
    <motion.div
      onClick={(e) => e.stopPropagation()}
      className="max-w-lg w-full bg-white rounded-md flex items-center justify-center flex-col p-8"
      variants={slideIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h2 className="text-2xl font-bold">Save to your server</h2>
      <p className="text-center mt-6 max-w-sm">Enter your website's FTP credentials and we will update the code for you!</p>
      <a href="https://blogvault.net/working-with-ftp/#Finding_your_FTP_credentials" target="_blank" className="text-red-400 text-sm py-4 hover:underline cursor-pointer">What are FTP credentials?</a>
      <form action="" className="w-full flex items-center justify-center flex-col">
        <div className="flex flex-col w-full">
          <input required={true} onChange={(e) => { parentStateSetter("username", e.target.value); }} className="mb-4 rounded-md border-2 border-gray-200 h-10 w-full p-4 text-gray-500 transition focus:border-orange-300" type="text" placeholder="Username"></input>
          <input required={true} onChange={(e) => { parentStateSetter("password", e.target.value); }} className="mb-4 rounded-md border-2 border-gray-200 h-10 w-full p-4 text-gray-500 transition focus:border-orange-300" type="password" placeholder="Password"></input>
        </div>
        <div className="flex flex-row">
          <input onChange={(e) => { parentStateSetter("hostname", e.target.value); }} className="rounded-md border-2 border-gray-200 h-10 max-w-xl w-full p-4 text-gray-500 transition focus:border-orange-300"type="text" placeholder="Hostname"></input>
          <input onChange={(e) => { parentStateSetter("port", e.target.value); }} className="ml-4 rounded-md border-2 border-gray-200 h-10 max-w-xl w-1/3 p-4 text-gray-500 transition focus:border-orange-300"type="number" defaultValue="21" placeholder="Port" ></input>
        </div>
      </form>
      <button action="" className="mt-8 flex justify-center items-center h-auto bg-gradient-to-r from-red-400 to-orange-300 p-4 rounded-md text-white font-bold" onClick={ () => tryToSave() }>Submit to Live Server</button>
    </motion.div>
  </Backdrop>
  )
  
}

export default SaveModal;