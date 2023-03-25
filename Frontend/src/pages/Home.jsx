
import * as React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/SiteSliceLogo.svg'
import TextCycleInput from '../components/TextCycleInput';



export default function Home() {
  return (
    <>

      <div className="w-full h-screen flex flex-col justify-center items-center ">
        <img src={logo} alt="SiteSlice Logo" />
        <h1 className="text-2xl font-bold py-6">Edit your website without knowing how to code.</h1>
        {/* <input 
          type="text" 
          className="rounded-md border-2 border-gray-200 h-10 max-w-2xl w-full p-4 text-gray-400 transition focus:border-orange-300"
          placeholder=''
        ></input> */}
      <TextCycleInput texts={['https://mywebsite.com', 'www.asupercoolsite.org', 'anotherwebsite.net']} />
      <a href="/editor" className="mt-4 relative hover-slice flex justify-center items-center h-auto bg-gradient-to-r from-red-400 to-orange-300 px-4 py-2 text-lg rounded-md text-white font-bold">Slice it!</a>
      </div>

    </>
  );
}
