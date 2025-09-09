import React from 'react';

function App() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#333', marginBottom: '1rem' }}>
          Eden Passes Management
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Welcome to the Eden Passes management system
        </p>
      </div>
    </div>
  );
}

export default App;