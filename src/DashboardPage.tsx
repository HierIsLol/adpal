import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

type ChartDataItem = {
  name: string;
  value: number;
};

const DashboardPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [campaigns, setCampaigns] = useState('');
  const [error, setError] = useState<string | null>(null);

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
        }
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      setError('Failed to get current user');
    }
  };

  const getCampaigns = async () => {
    setError(null);
    setCampaigns('');
    try {
      const { tokens } = await fetchAuthSession();
      const token = tokens?.idToken?.toString();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      console.log('Fetching campaigns...');
      const response = await fetch('https://tgwoxk9c6k.execute-api.us-east-1.amazonaws.com/prod/Token_ophalen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ username })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log('Campaigns result:', result);
        setCampaigns(JSON.stringify(result, null, 2));
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`API request failed: ${errorText}`);
      }
    } catch (error: unknown) {
      console.error('Error getting campaigns:', error);
      if (error instanceof Error) {
        setError(`Error: ${error.message}`);
      } else {
        setError('An unknown error occurred while fetching campaigns');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard</h1>
      <h2>Welcome, {username}</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Campaigns</h3>
        <button onClick={getCampaigns} style={{ marginBottom: '10px' }}>Campagnes Krijgen</button>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {campaigns || 'Campaigns will appear here'}
        </pre>
      </div>
    </div>
  );
};

export default DashboardPage;
