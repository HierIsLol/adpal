import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC<{ user: any; signOut: () => void }> = ({ user, signOut }) => {
  const [firstName, setFirstName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fullResponse, setFullResponse] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const API_URL = 'https://p82pqtgrs0.execute-api.us-east-1.amazonaws.com/prod/getUserInfo';
        const urlWithParams = `${API_URL}?username=${encodeURIComponent(user.username)}`;
        console.log("Request URL:", urlWithParams);
        const response = await fetch(urlWithParams, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const responseBody = await response.json();
        console.log("Response status:", response.status);
        console.log("Response body:", responseBody);
        setFullResponse(responseBody);

        if (response.status === 200) {
          const parsedBody = JSON.parse(responseBody.body);
          if (parsedBody.success && parsedBody.user_info && parsedBody.user_info.firstName) {
            console.log("Setting firstName:", parsedBody.user_info.firstName);
            setFirstName(parsedBody.user_info.firstName);
          } else {
            console.error('Failed to fetch user info:', parsedBody.message);
            setErrorMessage(parsedBody.message || 'Failed to fetch user info');
          }
        } else {
          console.error('Failed to fetch user info:', responseBody.message);
          setErrorMessage(responseBody.message || 'Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setErrorMessage('Error fetching user info');
      }
    };

    fetchUserInfo();
  }, [user.username]);

  return (
    <div style={{ textAlign: 'center', paddingTop: '20px' }}>
      <img 
        src="https://i.postimg.cc/Mp8Whhmw/Ad-Pal-logo-no-white.png" 
        style={{ width: '188px', height: '188px', margin: '0 auto', display: 'block' }} 
        alt="AdPal Logo"
      />
      <h1 style={{ marginTop: '20px' }}>Welkom {firstName}</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <p>We zijn nog druk bezig, je kunt alvast je store koppelen of het dashboard bekijken 😁</p>
      <nav style={{ marginTop: '20px' }}>
        <Link to="/store-link">
          <button style={{ fontSize: '18px', padding: '10px 20px', backgroundColor: '#083464', border: 'none', cursor: 'pointer', color: 'white', margin: '10px' }}>
            →Koppel mijn store!
          </button>
        </Link>
        <Link to="/dashboard">
          <button style={{ fontSize: '18px', padding: '10px 20px', backgroundColor: '#083464', border: 'none', cursor: 'pointer', color: 'white', margin: '10px' }}>
            →Bekijk Dashboard
          </button>
        </Link>
        <Link to="/profile">
          <button style={{ fontSize: '18px', padding: '10px 20px', backgroundColor: '#083464', border: 'none', cursor: 'pointer', color: 'white', margin: '10px' }}>
            Profiel
          </button>
        </Link>
        <button onClick={signOut} style={{ fontSize: '18px', padding: '10px 20px', backgroundColor: '#f44336', border: 'none', cursor: 'pointer', color: 'white', margin: '10px' }}>
          Uitloggen
        </button>
      </nav>
      {fullResponse && (
        <div style={{ textAlign: 'left', marginTop: '20px' }}>
          <h2>Volledige Response van Lambda:</h2>
          <pre>{JSON.stringify(fullResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default HomePage;
