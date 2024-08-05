import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const DashboardPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [s3Content, setS3Content] = useState('');
  const [lambdaResult, setLambdaResult] = useState('');
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

  const callLambdaFunction = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      const token = tokens?.idToken?.toString();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('https://niitq7f67k.execute-api.us-east-1.amazonaws.com/prod/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username })
      });

      if (response.ok) {
        const result = await response.json();
        setLambdaResult(JSON.stringify(result, null, 2));
        
        // Wacht 15 seconden en haal dan de S3-inhoud op
        setTimeout(() => {
          fetchS3Content();
        }, 15000);
      } else {
        const errorText = await response.text();
        throw new Error(`API request failed: ${errorText}`);
      }
    } catch (error: unknown) {
      console.error('Error calling Lambda function:', error);
      if (error instanceof Error) {
        setLambdaResult(`Error: ${error.message}`);
      } else {
        setLambdaResult('An unknown error occurred');
      }
    }
  };

const fetchS3Content = async () => {
  try {
    const { tokens } = await fetchAuthSession();
    const token = tokens?.idToken?.toString();
    
    if (!token) {
      throw new Error('No authentication token available');
    }

    const filename = `${username}_report_${new Date().toISOString().split('T')[0]}.json`;

    const response = await fetch('https://9xk13nx1mf.execute-api.us-east-1.amazonaws.com/default/s3latenzien', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Custom-Filename': filename
      }
    });
    
    // We gebruiken geen filename meer, maar we hebben wel de username nodig
    const response = await fetch('https://9xk13nx1mf.execute-api.us-east-1.amazonaws.com/default/s3latenzien', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.url) {
        // Als we een URL krijgen, tonen we die
        setS3Content(`Website updated successfully. You can view it at: ${data.url}`);
      } else {
        // Anders tonen we de ruwe JSON data
        setS3Content(JSON.stringify(data, null, 2));
      }
    } else {
      throw new Error('Failed to fetch S3 content');
    }
  } catch (error) {
  console.error('Error fetching S3 content:', error);
  if (error instanceof Error) {
    setS3Content(`Error: ${error.message}`);
  } else {
    setS3Content('An unknown error occurred while fetching S3 content');
  }
}
};

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard</h1>
      <h2>Welcome, {username}</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      
      <div style={{ marginBottom: '20px' }}>
        <h3>S3 Content</h3>
        <button onClick={fetchS3Content} style={{ marginBottom: '10px' }}>Refresh S3 Content</button>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {s3Content || 'S3 content will appear here'}
        </pre>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Lambda Function</h3>
        <button onClick={callLambdaFunction} style={{ marginBottom: '10px', marginRight: '10px' }}>Call Lambda Function</button>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {lambdaResult || 'Lambda function result will appear here'}
        </pre>
      </div>
    </div>
  );
};

export default DashboardPage;
