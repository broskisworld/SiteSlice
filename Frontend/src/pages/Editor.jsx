import * as React from "react";
import { json, Link, useSearchParams } from "react-router-dom";
import logo from "../assets/SiteSliceLogo.png";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import SaveModal from "../components/SaveModal";
import axios from "axios";
import *  as CONFIG from "../../../config";

export default function Editor() {
  const [modalOpen, setModalOpen] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const [changes, setChanges] = useState({});

  console.log(`config: ${JSON.stringify(CONFIG, null, 2)}`)

  
  // Form Data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hostname, setHostname] = useState("");
  const [port, setPort] = useState("21");
  const [isValidForm, setIsValidForm] = useState(false);
  const [formStatus, setFormStatus] = useState(true);


  const isFormValid = () => {
    if(username === ""){
      return false
    }
    
    if(password === ""){
      return false
    }
    
    if(hostname === ""){
      return false
    }
    
    if(port === ""){
      return false
    }
    
    return true
  }
  console.log(username)
  console.log(`Form is valid? ${isFormValid()}`)

  const handleInputChange = (label, value) => {
    if (label == "username"){
      setUsername(value);
      setIsValidForm(isFormValid())
    }

    if (label == "password"){
      setPassword(value);
      setIsValidForm(isFormValid())
    }

    if (label == "hostname"){
      setHostname(value);
      setIsValidForm(isFormValid())
    }

    if (label == "port"){
      setPort(value);
      setIsValidForm(isFormValid())
    }

    if(isFormValid()){
      setFormStatus(true)
    }
  }

  const save = () => {

    console.log("SAVING")

    let values = [];
    for (let key of Object.keys(changes)) {
      console.log("STRINGIFIED CHANGES");
      console.log(JSON.stringify(changes));
      values.push({
        uuid: key,
        new_inner_html: changes[key].new_inner_html,
      });
    }
    
    console.log("HANDLING SAVE")
    
    const body = {
        url: 'D:/Workshop/SiteSlice/Frontend/Testbench/Basic-site/index.html',
        ftp_username: `${username}`,
        ftp_password: `${password}`,
        ftp_host: `${hostname}`, 
        ftp_port: Number(port),
        changes: values
    }

    axios.post("http://localhost:5500/save", {
      headers: {
        "Content-Type": "application/json",
      },
      body: body
    })
    .then((response) => {
      setFormStatus(true)
      close();
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
      setFormStatus(false)

    });

  }

  const [searchParams] = useSearchParams();

  useEffect(() => {
    let input_url = searchParams.get('url');

    const url_regex = /((https?):)?(\/?\/?)([-a-zA-Z0-9@:%._\+~#=]{1,256})((\/?)([-a-zA-Z0-9@:%._\+~#=\/]{0,256})(\??)([\w-]+(=[\w-]*)?(&[\w-]+(=[\w-]*)?)*)?)?/g;

    let matched_link = url_regex.exec(input_url)
    let link_data = {
        protocol_plus_colon: matched_link[1] || '',
        protocol: matched_link[2] || '',
        slashes: matched_link[3] || '',
        hostname_or_path: matched_link[4] || '',
        rest_of_url: matched_link[5] || '',
        first_slash: matched_link[6] || '',
        rest_of_path: matched_link[7] || '/',
        query_param_separator: matched_link[8] || '',
        query_params: matched_link[9] || '',
        quotation_mark_2: matched_link[13] || '',
        full_match_link_and_attr: matched_link[0],
        starting_index: matched_link.index,
        ending_index: matched_link.index + matched_link[0].length,
        full_match_length: matched_link[0].length
    };

    // Assumptions: the URL provided will always be an absolute URL
    let host = link_data.protocol_plus_colon + link_data.slashes + link_data.hostname_or_path;
    let path_and_query = link_data.rest_of_url;
    let iframe_src = `${host}.${CONFIG.PROXY_HOSTNAME}:${CONFIG.BACKEND_PORT}${path_and_query}`;

    //if i have alink https://google.com/test, i need to separate
    
    console.log(`input_url: ${input_url}`);
    console.log('host: ', host);
    console.log(`iframe_src: ${iframe_src}`);

    setIframeSrc(iframe_src);
  }, [searchParams])
  

  function getMessage(message) {
    if (message.data.message == "changed") {
      changes[message.data.uuid] = {
        uuid: message.data.uuid,
        new_inner_html: message.data.new_inner_html,
      };

      setChanges(changes);
      console.log(changes);
    }
  }

  window.addEventListener("message", (message) => getMessage(message));

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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => (modalOpen ? close() : open())}>
          Save Changes
        </motion.button>

        <AnimatePresence
          initial={false}
          mode={"wait"}
        >
          {modalOpen && <SaveModal modalOpen={modalOpen} handleClose={close} handleSave={save} parentStateSetter={handleInputChange} formIsValid={isValidForm} setFormStatus={setFormStatus} setPort={port}/>}
        </AnimatePresence>
      </div>
      <div className="bg-white flex justify-center items-center w-full h-[calc(100vh-4rem)] p-4 pt-0">
        <iframe
          className="w-full h-full border-2 border-gray-300"
          src={iframeSrc}></iframe>
      </div>
      { !formStatus && <p className="absolute right-4 bottom-4 rounded-md bg-red-500 bg-opacity-75 px-4 py-2 text-white font-bold">Something went wrong, please check your FTP information.</p>}
    </motion.div>
  );
}
