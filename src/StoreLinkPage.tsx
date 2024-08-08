import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const StoreLinkPage: React.FC = () => {
  const [adClientSecret, setAdClientSecret] = useState('');
  const [adClientId, setAdClientId] = useState('');
  const [retailerClientSecret, setRetailerClientSecret] = useState('');
  const [retailerClientId, setRetailerClientId] = useState('');
  const [_username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      const idToken = tokens?.idToken;
      if (idToken && idToken.payload) {
        const currentUsername = idToken.payload['cognito:username'];
        if (typeof currentUsername === 'string') {
          setUsername(currentUsername);
        } else {
          console.error('Username is not a string:', currentUsername);
          setUsername('');
        }
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const handleSubmit = async () => {
    if (!adClientSecret || !adClientId || !retailerClientSecret || !retailerClientId) {
      setMessage('Vul alstublieft alle velden in.');
      return;
    }
    setMessage('Bezig met opslaan...');
    // Hier zou de logica komen om de gegevens te verzenden
    // Voor nu simuleren we een succesvolle opslag
    setTimeout(() => {
      setMessage('Gegevens succesvol opgeslagen!');
    }, 1000);
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      overflow: 'auto', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      boxSizing: 'border-box',
      backgroundColor: '#f0f0f0',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '600px', 
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <img src="https://i.postimg.cc/Mp8Whhmw/Ad-Pal-logo-no-white.png" style={{ width: '150px', alignSelf: 'center' }} alt="AdPal Logo"/>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ textAlign: 'center', color: '#003366' }}>↓Volg de instructies</h2>
          <p style={{ textAlign: 'center', fontSize: '16px', marginBottom: '20px' }}>
            Om verbinding te kunnen maken met je store hebben wij koppelingsnummers nodig voor de Advertising API en de Retailer API.
          </p>
          
          <img src="https://i.postimg.cc/Z0fzBD27/ezgif-5-675330dec9-kopie.gif" style={{ width: '100%', maxWidth: '316px', height: 'auto', display: 'block', margin: '0 auto 20px' }} alt="Instructie GIF"/>
          
          <img src="/api/placeholder/316/164" style={{ width: '100%', maxWidth: '316px', height: 'auto', display: 'block', margin: '0 auto' }} alt="Tweede instructie afbeelding"/>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#003366', marginBottom: '15px' }}>Advertising API</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label htmlFor="adClientSecret" style={{ display: 'block', marginBottom: '5px', color: '#003366' }}>Client secret:</label>
              <input
                id="adClientSecret"
                type="text"
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                placeholder="Advertising Client Secret"
                value={adClientSecret}
                onChange={(e) => setAdClientSecret(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="adClientId" style={{ display: 'block', marginBottom: '5px', color: '#003366' }}>Client ID:</label>
              <input
                id="adClientId"
                type="text"
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                placeholder="Advertising Client ID"
                value={adClientId}
                onChange={(e) => setAdClientId(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#003366', marginBottom: '15px' }}>Retailer API</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label htmlFor="retailerClientSecret" style={{ display: 'block', marginBottom: '5px', color: '#003366' }}>Client secret:</label>
              <input
                id="retailerClientSecret"
                type="text"
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                placeholder="Retailer Client Secret"
                value={retailerClientSecret}
                onChange={(e) => setRetailerClientSecret(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="retailerClientId" style={{ display: 'block', marginBottom: '5px', color: '#003366' }}>Client ID:</label>
              <input
                id="retailerClientId"
                type="text"
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                placeholder="Retailer Client ID"
                value={retailerClientId}
                onChange={(e) => setRetailerClientId(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSubmit} 
          style={{ 
            width: '100%', 
            padding: '15px', 
            backgroundColor: '#003366', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            fontSize: '18px', 
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#004c8c'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#003366'}
        >
          ↓Koppel mijn store!
        </button>

        {message && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: message.includes('succesvol') ? '#d4edda' : '#f8d7da', 
            color: message.includes('succesvol') ? '#155724' : '#721c24',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreLinkPage;
