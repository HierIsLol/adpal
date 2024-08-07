import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import { Authenticator, AuthEventData } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import StoreLinkPage from './StoreLinkPage';
import DashboardPage from './DashboardPage';
import ProfilePage from './ProfilePage';

interface HomePageProps {
  user: any;
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
  // ... (HomePage code blijft hetzelfde)
};

interface AppContentProps {
  signOut: () => void;
  user: any;
}

const AppContent: React.FC<AppContentProps> = ({ signOut, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div style={{ display: 'flex' }}>
      {/* Hamburger Menu */}
      <div style={{
        width: isMenuOpen ? '250px' : '0',
        height: '100vh',
        backgroundColor: '#f8f8f8',
        transition: 'width 0.3s ease-in-out',
        overflow: 'hidden',
        position: 'fixed',
        zIndex: 1000,
      }}>
        <nav style={{ padding: '50px 20px' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '15px' }}><Link to="/" style={{ textDecoration: 'none', color: '#333', fontSize: '18px' }} onClick={toggleMenu}>Home</Link></li>
            <li style={{ marginBottom: '15px' }}><Link to="/profile" style={{ textDecoration: 'none', color: '#333', fontSize: '18px' }} onClick={toggleMenu}>Profiel</Link></li>
            <li style={{ marginBottom: '15px' }}><Link to="/store-link" style={{ textDecoration: 'none', color: '#333', fontSize: '18px' }} onClick={toggleMenu}>Koppel Store</Link></li>
            <li style={{ marginBottom: '15px' }}><Link to="/dashboard" style={{ textDecoration: 'none', color: '#333', fontSize: '18px' }} onClick={toggleMenu}>Dashboard</Link></li>
            <li><button onClick={signOut} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', padding: 0, font: 'inherit', fontSize: '18px' }}>Uitloggen</button></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main style={{ flexGrow: 1, marginLeft: isMenuOpen ? '250px' : '0', transition: 'margin-left 0.3s ease-in-out', minHeight: '100vh', position: 'relative' }}>
        {/* ... (rest van de main content blijft hetzelfde) */}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Authenticator>
        {({ signOut, user }: { signOut?: (data?: AuthEventData) => void, user: any }) => {
          const handleSignOut = () => {
            if (signOut) {
              signOut();
            }
          };
          
          return <AppContent signOut={handleSignOut} user={user} />;
        }}
      </Authenticator>
    </Router>
  );
}

export default App;
