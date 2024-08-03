import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import StoreLinkPage from './StoreLinkPage';

// Define types for the user and signOut function
type User = {
  signInDetails?: {
    loginId?: string;
  };
};

type SignOutFunction = () => void;

interface HomePageProps {
  signOut: SignOutFunction;
  user: User;
}

const HomePage: React.FC<HomePageProps> = ({ signOut, user }) => (
  <div style={{ paddingTop: '220px', textAlign: 'center' }}>
    <h1>Welkom {user?.signInDetails?.loginId}</h1>
    <p>We zijn nog druk bezig, je kunt alvast je store koppelen 😁</p>
    <Link to="/store-link">
      <button style={{ fontSize: '18px', padding: '10px 20px', backgroundColor: '#083464', border: 'none', cursor: 'pointer', color: 'white' }}>
        →Koppel mijn store!
      </button>
    </Link>
    <button onClick={signOut} style={{ display: 'block', margin: '20px auto', backgroundColor: '#f44336', border: 'none', cursor: 'pointer', color: 'white' }}>
      Uitloggen
    </button>
  </div>
);

function App() {
  return (
    <Router>
      <Authenticator>
        {({ signOut, user }: { signOut: SignOutFunction; user: User }) => (
          <main style={{ position: 'relative' }}>
            <img 
              src="https://i.postimg.cc/Mp8Whhmw/Ad-Pal-logo-no-white.png" 
              style={{ width: '188px', height: '188px', left: '50%', top: '20px', transform: 'translateX(-50%)', position: 'absolute' }} 
              alt="AdPal Logo"
            />
            <Routes>
              <Route path="/" element={<HomePage signOut={signOut} user={user} />} />
              <Route path="/store-link" element={<StoreLinkPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        )}
      </Authenticator>
    </Router>
  );
}

export default App;
