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
  const [username, setUsername] = useState('');
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (firstName === 'Damiën') {
      setPopupMessage('The GOD!');
    } else if (firstName === 'Janai') {
      setPopupMessage('Ga eens werken!! Regel al die shit');
    } else {
      setPopupMessage('');
    }
  }, [firstName]);

  const getCurrentUser = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      const idToken = tokens?.idToken;
      if (idToken && idToken.payload) {
        const currentUsername = idToken.payload['cognito:username'];
        if (typeof currentUsername === 'string') {
          setUsername(currentUsername);
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
          username,
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
        const result = await response.json();
        if (result.success) {
          setMessage('Profiel succesvol bijgewerkt en opgeslagen in S3!');
        } else {
          throw new Error(result.message || 'Failed to save profile');
        }
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Er is een fout opgetreden bij het opslaan van het profiel.');
    }
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    boxSizing: 'border-box' as 'border-box',
    fontFamily: 'Arial, sans-serif',
    paddingTop: '200px', // Verhoogd om de inhoud nog lager te beginnen
  };

  const headerStyle = {
    marginBottom: '50px',
    textAlign: 'center' as 'center',
  };

  const titleStyle = {
    fontSize: '24px',
    color: '#003366',
    margin: 0,
  };

  const formStyle = {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    gap: '20px',
  };

  const columnStyle = {
    flex: '1 1 calc(50% - 10px)',
    minWidth: '300px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box' as 'border-box',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold' as 'bold',
  };

  const popupStyle = {
    position: 'fixed' as 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '20px',
    borderRadius: '10px',
    fontSize: '24px',
    fontWeight: 'bold' as 'bold',
    zIndex: 1000,
    textAlign: 'center' as 'center',
  };

  return (
    <div style={containerStyle}>
      {popupMessage && (
        <div style={popupStyle}>
          {popupMessage}
        </div>
      )}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Profiel</h1>
      </div>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={columnStyle}>
          <label htmlFor="firstName" style={labelStyle}>Voornaam:</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={inputStyle}
            required
          />

          <label htmlFor="lastName" style={labelStyle}>Achternaam:</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={inputStyle}
            required
          />

          <label htmlFor="email" style={labelStyle}>E-mail:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ width: '30%' }}>
              <label htmlFor="countryCode" style={labelStyle}>Landcode:</label>
              <select
                id="countryCode"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                style={{ ...inputStyle, marginBottom: 0 }}
              >
                <option value="+31">🇳🇱 +31</option>
                <option value="+32">🇧🇪 +32</option>
                <option value="+49">🇩🇪 +49</option>
              </select>
            </div>
            <div style={{ width: '70%' }}>
              <label htmlFor="phoneNumber" style={labelStyle}>Telefoonnummer:</label>
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ ...inputStyle, marginBottom: 0 }}
                required
              />
            </div>
          </div>

          <label htmlFor="companyName" style={labelStyle}>Bedrijfsnaam (optioneel):</label>
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={columnStyle}>
          <label htmlFor="postcode" style={labelStyle}>Postcode:</label>
          <input
            id="postcode"
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            style={inputStyle}
            required
          />

          <label htmlFor="houseNumber" style={labelStyle}>Huisnummer:</label>
          <input
            id="houseNumber"
            type="text"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            style={inputStyle}
            required
          />

          <label htmlFor="street" style={labelStyle}>Straat:</label>
          <input
            id="street"
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            style={inputStyle}
            required
          />

          <label htmlFor="city" style={labelStyle}>Stad:</label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={inputStyle}
            required
          />

          {companyName && (
            <>
              <label htmlFor="kvkNumber" style={labelStyle}>KVK-nummer:</label>
              <input
                id="kvkNumber"
                type="text"
                value={kvkNumber}
                onChange={(e) => setKvkNumber(e.target.value)}
                style={inputStyle}
                required
              />

              <label htmlFor="vatNumber" style={labelStyle}>BTW-nummer:</label>
              <input
                id="vatNumber"
                type="text"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                style={inputStyle}
                required
              />
            </>
          )}
        </div>

        <button 
          type="submit"
          style={{ 
            width: '100%',
            padding: '12px 24px', 
            backgroundColor: '#003366', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '20px',
          }}
        >
          Profiel Bijwerken
        </button>
      </form>
      {message && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: message.includes('succesvol') ? '#d4edda' : '#f8d7da', 
          color: message.includes('succesvol') ? '#155724' : '#721c24',
          borderRadius: '5px',
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
