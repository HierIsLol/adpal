import React from 'react'
import ReactDOM from 'react-dom/client'
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import App from './App.tsx'
import './index.css'

Amplify.configure(awsExports);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Authenticator>
      {({ signOut, user }) => (
        <App signOut={() => signOut?.()} user={user} />
      )}
    </Authenticator>
  </React.StrictMode>,
)
