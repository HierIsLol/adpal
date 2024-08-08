import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC<{ user: any; signOut: () => void }> = ({ user, signOut }) => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
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

        if (response.status === 200 && responseBody.success) {
          const userInfo = responseBody.user_info;
          setFirstName(userInfo.firstName);
          console.log("First name set to:", userInfo.firstName);
        } else {
          setErrorMessage(responseBody.message || 'Er is een fout opgetreden bij het ophalen van de gebruikersinformatie.');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setErrorMessage('Er is een fout opgetreden bij het ophalen van de gebruikersinformatie.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [user.username]);

  const renderWelcomeMessage = () => {
    if (isLoading) {
      return "Laden...";
    }
    if (firstName) {
      return `Welkom ${firstName}`;
    }
    return "Welkom";
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '20px' }}>
      <img 
        src="https://i.postimg.cc/Mp8Whhmw/Ad-Pal-logo-no-white.png" 
        style={{ width: '188px', height: '188px', margin: '0 auto', display: 'block' }} 
        alt="AdPal Logo"
      />
      <h1 style={{ marginTop: '20px' }}>
        {renderWelcomeMessage()}
      </h1>
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
    </div>
  );
};

export default HomePage;
