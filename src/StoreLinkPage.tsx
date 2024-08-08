import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import StoreLinkPage from './StoreLinkPage';
import DashboardPage from './DashboardPage';
import ProfilePage from './ProfilePage';

const HomePage = ({ user, signOut }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const API_URL = 'https://p82pqtgrs0.execute-api.us-east-1.amazonaws.com/prod/getUserInfo';
        const urlWithParams = `${API_URL}?username=${encodeURIComponent(user.username)}`;
        
        const response = await fetch(urlWithParams, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          setUserInfo(data.user_info);
        } else {
          throw new Error(data.message || 'Er is een fout opgetreden bij het ophalen van gebruikersgegevens');
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [user.username]);

  return (
    <div style={{ textAlign: 'center', paddingTop: '20px' }}>
      <img 
        src="https://i.postimg.cc/Mp8Whhmw/Ad-Pal-logo-no-white.png" 
        style={{ width: '188px', height: '188px', margin: '0 auto', display: 'block' }} 
        alt="AdPal Logo"
      />
      
      {isLoading ? (
        <h1 style={{ marginTop: '20px' }}>Laden...</h1>
      ) : error ? (
        <h1 style={{ marginTop: '20px', color: 'red' }}>Fout: {error}</h1>
      ) : (
        <h1 style={{ marginTop: '20px' }}>
          Welkom {userInfo?.firstName || user.username}
        </h1>
      )}

      <p>We zijn nog druk bezig, je kunt alvast je store koppelen of het dashboard bekijken 😁</p>
      <nav style={{ marginTop: '20px' }}>
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
        <Link to="/profile">
          <button style={{ fontSize: '18px', padding: '10px 20px', backgroundColor: '#083464', border: 'none', cursor: 'pointer', color: 'white', margin: '10px' }}>
            Profiel
          </button>
        </Link>
        <button onClick={signOut} style={{ fontSize: '18px', padding: '10px 20px', backgroundColor: '#f44336', border: 'none', cursor: 'pointer', color: 'white', margin: '10px' }}>
          Uitloggen
        </button>
      </nav>
    </div>
  );
};

const AppContent = ({ signOut, user }) => {
  const location = useLocation();

  return (
    <div style={{ padding: '20px' }}>
      {location.pathname !== '/' && (
        <Link to="/" style={{ position: 'fixed', top: '10px', left: '10px', textDecoration: 'none' }}>
          <button style={{ fontSize: '16px', padding: '5px 10px', backgroundColor: '#083464', border: 'none', cursor: 'pointer', color: 'white' }}>
            ← Terug naar Home
          </button>
        </Link>
      )}
      <Routes>
        <Route path="/" element={<HomePage user={user} signOut={signOut} />} />
        <Route path="/store-link" element={<StoreLinkPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Authenticator>
        {({ signOut, user }) => {
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
