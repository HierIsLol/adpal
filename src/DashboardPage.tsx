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

      // Stap 2: Poll voor de bestandsinhoud
      let attempts = 0;
      const maxAttempts = 10;
      const pollInterval = 5000; // 5 seconden

      const pollForContent = async () => {
        try {
          const fetchContentResponse = await fetch('https://hju8bk24lh.execute-api.us-east-1.amazonaws.com/prod/geturl', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ username })
          });

          if (fetchContentResponse.ok) {
            const content = await fetchContentResponse.text();
            if (content && content !== 'File not ready') {
              setFileContent(content);
              setIsLoading(false);
              return;
            }
          }

          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(pollForContent, pollInterval);
          } else {
            throw new Error('Max attempts reached. Report generation timed out.');
          }
        } catch (error) {
          console.error('Error in pollForContent:', error);
          setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      };

      pollForContent();
    } catch (error) {
      console.error('Error in generateAndFetchReport:', error);
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          <p>Loading... This may take up to a minute.</p>
        ) : fileContent ? (
          <div dangerouslySetInnerHTML={{ __html: fileContent }} />
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
