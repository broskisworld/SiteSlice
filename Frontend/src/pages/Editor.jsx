import * as React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <h1>Editor</h1>
      <Link to="/">Home</Link>
    </>
  );
}