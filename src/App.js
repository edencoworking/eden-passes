import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <header>
        <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>
          Welcome to Eden Passes
        </h1>
        <p style={{ fontSize: '1.2em', marginBottom: '30px' }}>
          Your coworking space management system
        </p>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2>🌿 Features Coming Soon</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '10px 0' }}>🎫 Digital Pass Management</li>
            <li style={{ margin: '10px 0' }}>📅 Booking System</li>
            <li style={{ margin: '10px 0' }}>👥 Member Portal</li>
            <li style={{ margin: '10px 0' }}>📊 Analytics Dashboard</li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;