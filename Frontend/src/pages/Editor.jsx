import * as React from "react";
import { json, Link, useSearchParams } from "react-router-dom";
import logo from "../assets/SiteSliceLogo.png";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import SaveModal from "../components/SaveModal";
import axios from 'axios';

export default function Editor() {

  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const [changes, setChanges] = useState({})

  
  // Form Data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hostname, setHostname] = useState("");
  const [port, setPort] = useState("22");
  const [isValidForm, setIsValidForm] = useState(false);
  const [formStatus, setformStatus] = useState(false);


  const isFormValid = () => {
    if(username == ""){
      return false
    }

    if(password == ""){
      return false
    }

    if(hostname == ""){
      return false
    }

    if(port == ""){
      return false
    }

    return true
  }

  
  console.log(username)
  console.log(password)
  console.log(hostname)
  console.log(port)

  const handleInputChange = (label, value) => {
    if (label == "username"){
      setUsername(value);
      setIsValidForm(isFormValid())
    }

    if (label == "password"){
      setUsername(value);
      setIsValidForm(isFormValid())
    }

    if (label == "hostname"){
      setUsername(value);
      setIsValidForm(isFormValid())
    }

    if (label == "port"){
      setUsername(value);
      setIsValidForm(isFormValid())
    }
  }

  const save = (username, password, hostname, port) => {
    

    let values = [];
    for (let key of Object.keys(changes)){
      console.log("STRINGIFIED CHANGES")
      console.log(JSON.stringify(changes))
      values.push({
        uuid: key,
        new_inner_html: changes[key].new_inner_html
      })
    }
    
    
    const body = {
        url: 'D:/Workshop/SiteSlice/Frontend/Testbench/Basic-site/index.html',
        ftp_username: `${username}`,
        ftp_password: `${password}`,
        changes: values
    }

    console.log(body)
    
    axios.post('http://localhost:5500/save', {
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    })
    .then((response) => {
      setformStatus("Success")
    })
    .catch(function(error){
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      setformStatus(error.message)

    });

    close();
}

  const [searchParams] = useSearchParams();


  function getMessage(message) {
    if(message.data.message == "changed"){
      
      changes[message.data.uuid] = {
        uuid: message.data.uuid,
        new_inner_html: message.data.new_inner_html
      }

      setChanges(changes)
      console.log(changes)
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
          {modalOpen && <SaveModal modalOpen={modalOpen} handleClose={close} handleSave={save} parentStateSetter={handleInputChange} formIsValid={isValidForm}/>}
        </AnimatePresence>
      </div>
      <div className="bg-white flex justify-center items-center w-full h-[calc(100vh-4rem)] p-4 pt-0">
        <iframe className="w-full h-full" src={`http://localhost:5500/proxy/${searchParams.get("url")}`}></iframe>
      </div>
    </motion.div>
  );
}
