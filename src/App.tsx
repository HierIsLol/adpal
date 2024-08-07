import * as React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import StoreLinkPage from './StoreLinkPage';
import DashboardPage from './DashboardPage';

const HomePage = ({ signOut, user }) => {
  return (
    <div style={{ textAlign: 'center', paddingTop: '20px' }}>
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
      <button onClick={signOut} style={{ display: 'block', margin: '20px auto', backgroundColor: '#f44336', border: 'none', cursor: 'pointer', color: 'white', padding: '10px 20px' }}>
        Uitloggen
      </button>
    </div>
  );
};

const AppContent = ({ signOut, user }) => {
  const location = useLocation();

  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage signOut={signOut} user={user} />} />
        <Route path="/store-link" element={<StoreLinkPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {location.pathname !== '/' && (
        <Link to="/" style={{ position: 'fixed', top: '10px', left: '10px', textDecoration: 'none' }}>
          <button style={{ fontSize: '16px', padding: '5px 10px', backgroundColor: '#083464', border: 'none', cursor: 'pointer', color: 'white' }}>
            ← Terug naar Home
          </button>
        </Link>
      )}
    </main>
  );
};

function App() {
  return (
    <Router>
      <Authenticator>
        {({ signOut, user }) => <AppContent signOut={signOut} user={user} />}
      </Authenticator>
    </Router>
  );
}

export default App;
