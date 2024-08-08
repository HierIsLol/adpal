import React from 'react'
import ReactDOM from 'react-dom/client'
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import App from './App'
import './index.css'

// Bijgewerkte Amplify configuratie
Amplify.configure({
  region: 'us-east-1', // Verplaatst naar het hoofdniveau van de configuratie
  Auth: {
    userPoolId: 'us-east-1_hDRllzVfc',
    userPoolWebClientId: '7n80mfbjksq1f05vu450ko4cs9',
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Authenticator>
      {({ signOut, user }) => (
        <App signOut={() => signOut?.()} user={user} />
      )}
    </Authenticator>
  </React.StrictMode>,
)
