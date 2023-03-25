import * as React from "react";
import { Link, useSearchParams } from "react-router-dom";
import logo from "../assets/SiteSliceLogo.png";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import SaveModal from "../components/SaveModal";

export default function Editor() {

  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const save = () => {null};

  const [searchParams] = useSearchParams();

  let changeCache = {};

  function getMessage(message) {
    if(message.data.message == "changed"){
      changeCache[message.data.uuid] = {
        uuid: message.data.uuid,
        new_inner_html: message.data.new_inner_html
      }
      console.log(changeCache)
    }
  }

  window.addEventListener('message', (message) => getMessage(message));

  return (
    <motion.div
      className="editor-wrap h-screen"
      initial={{ x: window.innerWidth }}
      animate={{ x: 0 }}
      exit={{ x: -window.innerWidth, transition: { duration: 0.2 } }}
      transition={{
        type: "spring",
        damping: 16,
        duration: 0.2,
      }}>
      <div className="top-bar w-full h-16 p-4 flex flex-row justify-between">
        <img className="object-contain w-24 h-auto" src={logo} alt="SiteSlice Logo" />
        <motion.button
          className="flex justify-center items-center h-auto bg-gradient-to-r from-red-400 to-orange-300 px-4 rounded-md text-white font-bold"
          whileHover={{ scale:1.05}}
          whileTap={{ scale: 0.95 }}
          onClick={() => (modalOpen ? close() : open())}
          >
          Save Changes
        </motion.button>

        <AnimatePresence
          initial={false}
          mode={"wait"}
        >
          {modalOpen && <SaveModal modalOpen={modalOpen} handleClose={close} handleSave={save} />}
        </AnimatePresence>
      </div>
      <div className="bg-white flex justify-center items-center w-full h-[calc(100vh-4rem)] p-4 pt-0">
        <iframe className="w-full h-full" src={`http://localhost:5500/proxy/${searchParams.get("url")}`}></iframe>
      </div>
    </motion.div>
  );
}
