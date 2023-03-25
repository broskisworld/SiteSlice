import * as React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <h1 className="underline">Home page</h1>
      <Link to="/editor">Editor</Link>
    </>
  );
}