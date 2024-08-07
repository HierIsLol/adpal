import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const DashboardPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [lambdaResult, setLambdaResult] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    setError(null);
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
      console.log('Generate report result:', generateResult);
      setLambdaResult(JSON.stringify(generateResult, null, 2));

      // Stap 2: Haal de presigned URL op
      const fetchUrlResponse = await fetch('https://hju8bk24lh.execute-api.us-east-1.amazonaws.com/prod/geturl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username })
      });
      if (!fetchUrlResponse.ok) {
        throw new Error(`Failed to fetch presigned URL: ${await fetchUrlResponse.text()}`);
      }
      const fetchUrlResult = await fetchUrlResponse.json();
      console.log('Fetched presigned URL:', fetchUrlResult);
      const parsedResult = JSON.parse(fetchUrlResult.body);
      const presignedUrl = parsedResult.presignedUrl;

      // Stap 3: Haal de inhoud van het bestand op met de presigned URL
      const fileResponse = await fetch(presignedUrl);
      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch file content: ${await fileResponse.text()}`);
      }
      const fileText = await fileResponse.text();
      setFileContent(fileText);
    } catch (error) {
      console.error('Error in generateAndFetchReport:', error);
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard</h1>
      <h2>Welcome, {username}</h2>
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      <div style={{ marginBottom: '20px' }}>
        <h3>Report Content</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : fileContent ? (
          <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap' }}>
            {fileContent}
          </pre>
        ) : (
          <p>No content available. Generate a report first.</p>
        )}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Generate Report</h3>
        <button onClick={generateAndFetchReport} disabled={isLoading} style={{ marginBottom: '10px' }}>
          {isLoading ? 'Generating...' : 'Generate and Fetch Report'}
        </button>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {lambdaResult || 'Lambda function result will appear here'}
        </pre>
      </div>
    </div>
  );
};

export default DashboardPage;
