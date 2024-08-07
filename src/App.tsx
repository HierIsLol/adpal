import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import StoreLinkPage from './StoreLinkPage';
import DashboardPage from './DashboardPage';
import ProfilePage from './ProfilePage';

const HamburgerMenu = ({ isOpen, toggleMenu, signOut }: { isOpen: boolean; toggleMenu: () => void; signOut: () => void }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    right: isOpen ? 0 : '-250px',
    width: '250px',
    height: '100%',
    backgroundColor: '#f8f8f8',
    transition: 'right 0.3s ease-in-out',
    boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
    zIndex: 1000
  }}>
    <button onClick={toggleMenu} style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer'
    }}>
      ✕
    </button>
    <nav style={{ padding: '50px 20px' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '10px' }}><Link to="/" style={{ textDecoration: 'none', color: '#333' }} onClick={toggleMenu}>Home</Link></li>
        <li style={{ marginBottom: '10px' }}><Link to="/profile" style={{ textDecoration: 'none', color: '#333' }} onClick={toggleMenu}>Profiel</Link></li>
        <li style={{ marginBottom: '10px' }}><Link to="/store-link" style={{ textDecoration: 'none', color: '#333' }} onClick={toggleMenu}>Koppel Store</Link></li>
        <li style={{ marginBottom: '10px' }}><Link to="/dashboard" style={{ textDecoration: 'none', color: '#333' }} onClick={toggleMenu}>Dashboard</Link></li>
        <li><button onClick={() => { signOut(); toggleMenu(); }} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', padding: 0, font: 'inherit' }}>Uitloggen</button></li>
      </ul>
    </nav>
  </div>
);

interface HomePageProps {
  user: any;
}

const HomePage = ({ user }: HomePageProps) => {
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
    </div>
  );
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
    <main style={{ position: 'relative', minHeight: '100vh', paddingBottom: '50px' }}>
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
      <HamburgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} signOut={signOut} />
      {location.pathname !== '/' && (
        <Link to="/" style={{ position: 'fixed', top: '10px', left: '10px', textDecoration: 'none', zIndex: 1001 }}>
          <button style={{ fontSize: '16px', padding: '5px 10px', backgroundColor: '#083464', border: 'none', cursor: 'pointer', color: 'white' }}>
            ← Terug naar Home
          </button>
        </Link>
      )}
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/store-link" element={<StoreLinkPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
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
