import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const ProfilePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  // Vervang deze URL met je eigen API Gateway URL
  const API_URL = 'https://phtmanjqeb.execute-api.us-east-1.amazonaws.com/prod/saveUserInfoLambda';

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
          // Hier zou je een API-call kunnen doen om de rest van de profielgegevens op te halen
        } else {
          console.error('Username is not a string:', currentUsername);
        }
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Bezig met opslaan...');
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          companyName,
          email,
          phone,
          address,
        }),
      });

      if (response.ok) {
        setMessage('Profiel succesvol bijgewerkt!');
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Er is een fout opgetreden bij het opslaan van het profiel.');
    }
  };


  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px', 
      boxSizing: 'border-box',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', color: '#003366' }}>Profiel</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Gebruikersnaam:</label>
          <input
            id="username"
            type="text"
            value={username}
            readOnly
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label htmlFor="companyName" style={{ display: 'block', marginBottom: '5px' }}>Bedrijfsnaam:</label>
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>E-mail:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px' }}>Telefoonnummer:</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label htmlFor="address" style={{ display: 'block', marginBottom: '5px' }}>Adres:</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }}
          />
        </div>
        <button 
          type="submit"
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#003366', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Profiel Bijwerken
        </button>
      </form>
      {message && (
        <div style={{ 
          marginTop: '20px', 
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
  );
};

export default ProfilePage;
