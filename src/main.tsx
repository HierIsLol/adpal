import React from 'react'
import ReactDOM from 'react-dom/client'
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import App from './App'
import './index.css'

// Amplify configuratie met de juiste waarden
Amplify.configure({
  Auth: {
    region: 'us-east-1', // Dit is correct aangezien uw User Pool ID begint met 'us-east-1'
    userPoolId: 'us-east-1_hDRllzVfc', // Uw User Pool ID
    userPoolWebClientId: '7n80mfbjksq1f05vu450ko4cs9', // Uw App Client ID
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
