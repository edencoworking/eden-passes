import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Passes from './components/Passes';
import Guests from './components/Guests';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/passes" element={<Passes />} />
            <Route path="/guests" element={<Guests />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
