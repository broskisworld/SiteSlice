import * as React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/SiteSliceLogo.png'

export default function Editor() {
  return (
    <>
    <div className="editor-wrap h-screen">
    <div className="top-bar w-full h-16 p-4 flex flex-row justify-between">
        <img className="object-contain w-24 h-auto" src={logo} alt="SiteSlice Logo" />
        <a className="flex justify-center items-center h-auto bg-gradient-to-r from-red-400 to-orange-300 px-4 rounded-md text-white font-bold" href="/save">Save Changes</a>
      </div>
      <div className="bg-white flex justify-center items-center w-full h-[calc(100vh-4rem)] p-4 pt-0">
        <iframe className="w-full h-full" src="https://mixhers.com"></iframe>
      </div>
    </div>
    </>
  );
}