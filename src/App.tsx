import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Eden Coworking Passes Management</h1>
        <p>
          Welcome to the Eden Coworking space passes management system.
        </p>
        <div className="features">
          <h2>Features</h2>
          <ul>
            <li>Manage daily passes</li>
            <li>Track member access</li>
            <li>Monitor space usage</li>
            <li>Generate reports</li>
          </ul>
        </div>
        <p className="status">
          System is running and ready for deployment to Vercel.
        </p>
      </header>
    </div>
  );
}

export default App;
