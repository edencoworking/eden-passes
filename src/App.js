import React from 'react';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ 
          color: '#333', 
          fontSize: '3rem', 
          margin: '0 0 1rem 0' 
        }}>
          Eden Passes
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: '1.2rem', 
          margin: '0' 
        }}>
          Digital passes for Eden Coworking
        </p>
      </header>
      <main style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <p style={{ 
          color: '#555', 
          marginBottom: '1rem' 
        }}>
          Welcome to Eden Passes! This app is under development.
        </p>
        <p style={{ 
          color: '#888', 
          fontSize: '0.9rem' 
        }}>
          Stay tuned for features to manage your coworking passes.
        </p>
      </main>
    </div>
  );
}

export default App;