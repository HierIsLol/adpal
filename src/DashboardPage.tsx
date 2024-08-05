import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Storage } from 'aws-amplify';

const DashboardPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [lambdaResult, setLambdaResult] = useState('');
  const [presignedUrl, setPresignedUrl] = useState('');
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

  const generateAndFetchReport = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      const token = tokens?.idToken?.toString();

      if (!token) {
        throw new Error('No authentication token available');
      }

      // Stap 1: Genereer het rapport
      const generateResponse = await fetch('https://niitq7f67k.execute-api.us-east-1.amazonaws.com/prod/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username })
      });

      if (!generateResponse.ok) {
        throw new Error(`Failed to generate report: ${await generateResponse.text()}`);
      }

      const generateResult = await generateResponse.json();
      setLambdaResult(JSON.stringify(generateResult, null, 2));

      // Stap 2: Lees de presigned URL direct uit het bestand
      await fetchPresignedUrl();

    } catch (error) {
      console.error('Error in generateAndFetchReport:', error);
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const fetchPresignedUrl = async () => {
    try {
      const fileContent = await Storage.get(`${username}_latest_url.txt`, { download: true });
      if (fileContent.Body) {
        const url = await fileContent.Body.text();
        setPresignedUrl(url.trim());
      } else {
        throw new Error('Failed to read URL file content');
      }
    } catch (error) {
      console.error('Error fetching presigned URL:', error);
      setError(`Failed to fetch report URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard</h1>
      <h2>Welcome, {username}</h2>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      <div style={{ marginBottom: '20px' }}>
        <h3>Report Content</h3>
        {presignedUrl ? (
          <iframe
            src={presignedUrl}
            width="100%"
            height="600px"
            title="Report Content"
          ></iframe>
        ) : (
          <p>No content available. Generate a report first.</p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Generate Report</h3>
        <button onClick={generateAndFetchReport} style={{ marginBottom: '10px' }}>Generate and Fetch Report</button>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {lambdaResult || 'Lambda function result will appear here'}
        </pre>
      </div>
    </div>
  );
};

export default DashboardPage;
