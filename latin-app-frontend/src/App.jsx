import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TextSelection from './pages/TextSelection';
import TranslationWorkspace from './pages/TranslationWorkspace';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Route 1: The homepage shows the list of texts */}
        <Route path="/" element={<TextSelection />} />

        {/* Route 2: A dynamic route for the translation workspace */}
        <Route path="/translate/:textId" element={<TranslationWorkspace />} />
      </Routes>
    </div>
  );
}

export default App;