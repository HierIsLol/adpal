import React, { useState, useEffect } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import StoreLinkPage from './StoreLinkPage';
import DashboardPage from './DashboardPage';
import ProfilePage from './ProfilePage';
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

const App: React.FC = () => {
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    // Probeer de voornaam te vinden in de outputs
    const findFirstName = () => {
      if (outputs && outputs.userInfo && outputs.userInfo.firstName) {
        setFirstName(outputs.userInfo.firstName);
      } else {
        console.log("Kon voornaam niet vinden in outputs");
      }
    };

    findFirstName();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Router>
          <div>
            <h1>Welkom {firstName || 'Gebruiker'}</h1>
            <Routes>
              <Route path="/" element={<HomePage user={user} signOut={signOut} />} />
              <Route path="/store-link" element={<StoreLinkPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </div>
        </Router>
      )}
    </Authenticator>
  );
};

export default App;
