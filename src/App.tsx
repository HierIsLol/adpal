import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import StoreLinkPage from './StoreLinkPage';
import DashboardPage from './DashboardPage';
import ProfilePage from './ProfilePage';

const HomePage: React.FC<{ user: any; signOut: () => void }> = ({ user, signOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div style={{ textAlign: 'center', paddingTop: '20px', position: 'relative' }}>
      <button onClick={toggleMenu} style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        fontSize: '24px',
        background: 'none',
        border: 'none',
        cursor: 'pointer'
      }}>
        ☰
      </button>
      
      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '250px',
          height: '100%',
          backgroundColor: '#f8f8f8',
          zIndex: 1000,
          padding: '20px',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
        }}>
          <button onClick={toggleMenu} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '18px' }}>✕</button>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ margin: '10px 0' }}><Link to="/" style={{ textDecoration: 'none', color: '#333' }} onClick={toggleMenu}>Home</Link></li>
              <li style={{ margin: '10px 0' }}><Link to="/profile" style={{ textDecoration: 'none', color: '#333' }} onClick={toggleMenu}>Profiel</Link></li>
              <li style={{ margin: '10px 0' }}><Link to="/store-link" style={{ textDecoration: 'none', color: '#333' }} onClick={toggleMenu}>Koppel Store</Link></li>
              <li style={{ margin: '10px 0' }}><Link to="/dashboard" style={{ textDecoration: 'none', color: '#333' }} onClick={toggleMenu}>Dashboard</Link></li>
              <li style={{ margin: '10px 0' }}><button onClick={signOut} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', padding: 0, fontSize: '16px' }}>Uitloggen</button></li>
            </ul>
          </nav>
        </div>
      )}

      <img 
        src="https://i.postimg.cc/Mp8Whhmw/Ad-Pal-logo-no-white.png" 
        style={{ width: '188px', height: '188px', margin: '0 auto', display: 'block' }} 
        alt="AdPal Logo"
      />
      <h1 style={{ marginTop: '20px' }}>Welkom {user?.signInDetails?.loginId}</h1>
      <p>We zijn nog druk bezig, je kunt alvast je store koppelen of het dashboard bekijken 😁</p>
      <Link to="/store-link">
        <button style={{ fontSize: '18px', padding: '10px 20px', backgroundColor: '#083464', border: 'none', cursor: 'pointer', color: 'white', margin: '10px' }}>
          →Koppel mijn store!
        </button>
      </Link>
      <Link to="/dashboard">
        <button style={{ fontSize: '18px', padding: '10px 20px', backgroundColor: '#083464', border: 'none', cursor: 'pointer', color: 'white', margin: '10px' }}>
          →Bekijk Dashboard
        </button>
      </Link>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Authenticator>
        {({ signOut, user }) => (
          <Routes>
            <Route path="/" element={<HomePage user={user} signOut={signOut || (() => {})} />} />
            <Route path="/store-link" element={<StoreLinkPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </Authenticator>
    </Router>
  );
}

export default App;
