import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify/auth';

const StoreLinkPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [clientId, setClientId] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setUsername(user.username);
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const handleSubmit = async () => {
    if (!clientSecret || !clientId) {
      setMessage('Vul alstublieft beide velden in.');
      return;
    }

    try {
      // Vervang deze URL door de daadwerkelijke API Gateway URL van uw Lambda-functie
      const lambdaUrl = 'https://ibabjitvv7.execute-api.us-east-1.amazonaws.com/prod/crendetails_save';
      
      const response = await fetch(lambdaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_client_id: clientId,
          api_client_secret: clientSecret,
          cognito_username: username,
        }),
      });

      if (response.ok) {
        setMessage('Gegevens succesvol opgeslagen!');
        setClientSecret('');
        setClientId('');
      } else {
        setMessage('Er is een fout opgetreden bij het opslaan van de gegevens.');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setMessage('Er is een fout opgetreden bij het versturen van de gegevens.');
    }
  };

  return (
    <div style={{ width: '434px', height: '886px', position: 'relative', background: 'white', fontFamily: 'Arial, sans-serif' }}>
      {/* ... (bestaande stijlen en elementen) ... */}
      
      <input
        id="clientSecret"
        type="text"
        style={{ width: '140px', height: '30px', left: '53px', top: '685px', position: 'absolute', textAlign: 'center' }}
        placeholder="Vul je Client Secret in"
        value={clientSecret}
        onChange={(e) => setClientSecret(e.target.value)}
      />
      <input
        id="clientId"
        type="text"
        style={{ width: '140px', height: '30px', left: '231px', top: '685px', position: 'absolute', textAlign: 'center' }}
        placeholder="Vul je Client ID in"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
      />
      <div
        id="koppelButton"
        onClick={handleSubmit}
        style={{
          width: '254px', height: '29px', left: '91px', top: '769px', position: 'absolute',
          color: 'white', fontSize: '26px', fontWeight: 700, lineHeight: '26px',
          wordWrap: 'break-word', cursor: 'pointer'
        }}
      >
        ↓Koppel mijn store!
      </div>
      <div
        id="result"
        style={{
          position: 'absolute', top: '830px', left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center', fontWeight: 'bold', color: message.includes('succesvol') ? 'green' : 'red'
        }}
      >
        {message}
      </div>
    </div>
  );
};

export default StoreLinkPage;
