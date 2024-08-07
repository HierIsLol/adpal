import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import { Authenticator, AuthEventData } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import StoreLinkPage from './StoreLinkPage';
import DashboardPage from './DashboardPage';
import ProfilePage from './ProfilePage';

const HamburgerMenu = ({ isOpen, toggleMenu }: { isOpen: boolean; toggleMenu: () => void }) => (
  // ... (HamburgerMenu code blijft hetzelfde)
);

interface HomePageProps {
  signOut: () => void;
  user: any;
}

const HomePage = ({ signOut, user }: HomePageProps) => {
  // ... (HomePage code blijft hetzelfde)
};

interface AppContentProps {
  signOut: () => void;
  user: any;
}

const AppContent = ({ signOut, user }: AppContentProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <main style={{ position: 'relative' }}>
      <button onClick={toggleMenu} style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 1001,
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer'
      }}>
        ☰
      </button>
      <HamburgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <Routes>
        <Route path="/" element={<HomePage signOut={signOut} user={user} />} />
        <Route path="/store-link" element={<StoreLinkPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {location.pathname !== '/' && (
        <Link to="/" style={{ position: 'fixed', bottom: '10px', left: '10px', textDecoration: 'none' }}>
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
        {({ signOut, user }) => {
          // Maak een wrapper voor signOut om het type-probleem op te lossen
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
