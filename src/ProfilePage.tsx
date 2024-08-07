import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const ProfilePage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+31');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [postcode, setPostcode] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [kvkNumber, setKvkNumber] = useState('');
  const [vatNumber, setVatNumber] = useState('');
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
          // Hier zou je een API-call kunnen doen om de rest van de profielgegevens op te halen
          console.log('Gebruikersnaam:', currentUsername);
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
      const API_URL = 'https://phtmanjqeb.execute-api.us-east-1.amazonaws.com/prod/saveUserInfoLambda';
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber: `${countryCode}${phoneNumber}`,
          address: {
            postcode,
            houseNumber,
            street,
            city,
          },
          companyName,
          kvkNumber,
          vatNumber,
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
          <label htmlFor="firstName" style={{ display: 'block', marginBottom: '5px' }}>Voornaam:</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" style={{ display: 'block', marginBottom: '5px' }}>Achternaam:</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
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
            required
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ width: '30%' }}>
            <label htmlFor="countryCode" style={{ display: 'block', marginBottom: '5px' }}>Landcode:</label>
            <select
              id="countryCode"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="+31">🇳🇱 +31</option>
              <option value="+32">🇧🇪 +32</option>
              <option value="+49">🇩🇪 +49</option>
              {/* Voeg hier meer landen toe */}
            </select>
          </div>
          <div style={{ width: '70%' }}>
            <label htmlFor="phoneNumber" style={{ display: 'block', marginBottom: '5px' }}>Telefoonnummer:</label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="postcode" style={{ display: 'block', marginBottom: '5px' }}>Postcode:</label>
          <input
            id="postcode"
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>
        <div>
          <label htmlFor="houseNumber" style={{ display: 'block', marginBottom: '5px' }}>Huisnummer:</label>
          <input
            id="houseNumber"
            type="text"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>
        <div>
          <label htmlFor="street" style={{ display: 'block', marginBottom: '5px' }}>Straat:</label>
          <input
            id="street"
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>
        <div>
          <label htmlFor="city" style={{ display: 'block', marginBottom: '5px' }}>Stad:</label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>
        <div>
          <label htmlFor="companyName" style={{ display: 'block', marginBottom: '5px' }}>Bedrijfsnaam (optioneel):</label>
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        {companyName && (
          <>
            <div>
              <label htmlFor="kvkNumber" style={{ display: 'block', marginBottom: '5px' }}>KVK-nummer:</label>
              <input
                id="kvkNumber"
                type="text"
                value={kvkNumber}
                onChange={(e) => setKvkNumber(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            <div>
              <label htmlFor="vatNumber" style={{ display: 'block', marginBottom: '5px' }}>BTW-nummer:</label>
              <input
                id="vatNumber"
                type="text"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
          </>
        )}
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
