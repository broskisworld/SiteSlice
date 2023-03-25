import * as React from 'react';
import { Link } from 'react-router-dom';

export default function Editor() {
  return (
    <>
      <h1>Editor</h1>
      <Link to="/">Home</Link>
      <div></div>
      <iframe src="https://www.mixhers.com"></iframe>
    </>
  );
}