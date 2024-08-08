import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import { Authenticator, useAuthenticator, View } from '@aws-amplify/ui-react';
import { AuthUser } from '@aws-amplify/ui-react/dist/types/components/Authenticator/types';
import '@aws-amplify/ui-react/styles.css';
import StoreLinkPage from './StoreLinkPage';
import DashboardPage from './DashboardPage';
import ProfilePage from './ProfilePage';

const HomePage: React.FC<{ user: AuthUser; signOut: () => void }> = ({ user, signOut }) => {
  const [firstName, setFirstName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fullResponse, setFullResponse] = useState<any>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const API_URL = 'https://p82pqtgrs0.execute-api.us-east-1.amazonaws.com/prod/getUserInfo';
        const urlWithParams = `${API_URL}?username=${encodeURIComponent(user.username)}`;
        console.log("Request URL:", urlWithParams);
        const response = await fetch(urlWithParams, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const responseBody = await response.json();
        console.log("Response status:", response.status);
        console.log("Response body:", responseBody);
        setFullResponse(responseBody);

        if (response.status === 200) {
          const parsedBody = JSON.parse(responseBody.body);
          if (parsedBody.success && parsedBody.user_info && parsedBody.user_info.firstName) {
            console.log("Setting firstName:", parsedBody.user_info.firstName);
            setFirstName(parsedBody.user_info.firstName);
          } else {
            console.error('Failed to fetch user info:', parsedBody.message);
            setErrorMessage(parsedBody.message || 'Failed to fetch user info');
          }
        } else {
          console.error('Failed to fetch user info:', responseBody.message);
          setErrorMessage(responseBody.message || 'Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setErrorMessage('Error fetching user info');
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
      <h1 style={{ marginTop: '20px' }}>Welkom {firstName}</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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
      {fullResponse && (
        <div style={{ textAlign: 'left', marginTop: '20px' }}>
          <h2>Volledige Response van Lambda:</h2>
          <pre>{JSON.stringify(fullResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuthenticator((context) => [context.user, context.signOut]);

  if (!user) {
    return null;
  }

  return (
    <View style={{ padding: '20px' }}>
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
    </View>
  );
};

function App() {
  return (
    <Router>
      <Authenticator>
        <AppContent />
      </Authenticator>
    </Router>
  );
}

export default App;
