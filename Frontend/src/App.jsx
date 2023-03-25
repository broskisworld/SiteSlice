import * as React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Editor from './pages/Editor';

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="editor" element={<Editor />} />
      </Routes>
    </div>
  );
}
