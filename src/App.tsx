import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import StoreLinkPage from './StoreLinkPage';
import DashboardPage from './DashboardPage';

function App() {
  return (
    <Router>
      <Authenticator>
        {({ signOut, user }) => (
          <main style={{ position: 'relative' }}>
            <img 
              src="https://i.postimg.cc/Mp8Whhmw/Ad-Pal-logo-no-white.png" 
              style={{ width: '188px', height: '188px', left: '50%', top: '20px', transform: 'translateX(-50%)', position: 'absolute' }} 
              alt="AdPal Logo"
            />
            <div style={{ paddingTop: '220px', textAlign: 'center' }}>
              <h1>Welkom {user?.signInDetails?.loginId}</h1>
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
              <button onClick={signOut} style={{ display: 'block', margin: '20px auto', backgroundColor: '#f44336', border: 'none', cursor: 'pointer', color: 'white' }}>
                Uitloggen
              </button>
            </div>
            <Routes>
              <Route path="/store-link" element={<StoreLinkPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
        )}
      </Authenticator>
    </Router>
  );
}

export default App;
