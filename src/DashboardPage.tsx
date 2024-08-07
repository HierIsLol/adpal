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
        
        // Wait 15 seconds and then fetch the S3 content
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

      // Generate the filename based on the current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `${username}_report_${currentDate}.json`;

      const response = await fetch('https://0hrvtzi8gg.execute-api.us-east-1.amazonaws.com/prod/getstatus', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Custom-Filename': filename  // Pass the filename in a custom header
        },
      });
      if (response.ok) {
        const data = await response.json();
        setS3Content(JSON.stringify(data, null, 2));
      } else {
        throw new Error('Failed to fetch S3 content');
      }
    } catch (error: unknown) {
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
