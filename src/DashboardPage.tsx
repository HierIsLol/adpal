import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const DashboardPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [lambdaResult, setLambdaResult] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processStatus, setProcessStatus] = useState('');

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
    setProcessStatus('Initiating report generation...');
    try {
      const { tokens } = await fetchAuthSession();
      const token = tokens?.idToken?.toString();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Stap 1: Start de keten van Lambda-functies
      const generateResponse = await fetch('https://niitq7f67k.execute-api.us-east-1.amazonaws.com/prod/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username })
      });
      if (!generateResponse.ok) {
        throw new Error(`Failed to start report generation: ${await generateResponse.text()}`);
      }
      const generateResult = await generateResponse.json();
      console.log('Generate report result:', generateResult);
      setLambdaResult(JSON.stringify(generateResult, null, 2));
      setProcessStatus('Report generation started. Waiting for completion...');

      // Stap 2: Poll voor de voltooiing van de laatste Lambda-functie
      let attempts = 0;
      const maxAttempts = 60; // 5 minuten totaal
      const pollInterval = 5000; // 5 seconden

      const pollForCompletion = async () => {
        try {
          const statusResponse = await fetch('https://0hrvtzi8gg.execute-api.us-east-1.amazonaws.com/prod/getstatus', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ username })
          });

          if (!statusResponse.ok) {
            throw new Error(`Failed to fetch status: ${await statusResponse.text()}`);
          }

          const statusData = await statusResponse.json();

          if (statusData.status === 'completed') {
            setProcessStatus('Report generation completed. Fetching content...');
            await fetchReportContent(token);
          } else if (statusData.status === 'in_progress') {
            attempts++;
            if (attempts < maxAttempts) {
              setProcessStatus(`Still processing... Attempt ${attempts} of ${maxAttempts}`);
              setTimeout(pollForCompletion, pollInterval);
            } else {
              throw new Error('Max attempts reached. Report generation timed out.');
            }
          } else {
            throw new Error(`Unexpected status: ${statusData.status}`);
          }
        } catch (error) {
          console.error('Error in pollForCompletion:', error);
          setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      };

      await pollForCompletion();
    } catch (error) {
      console.error('Error in generateAndFetchReport:', error);
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const fetchReportContent = async (token: string) => {
    try {
      const contentResponse = await fetch('https://hju8bk24lh.execute-api.us-east-1.amazonaws.com/prod/geturl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username })
      });

      if (!contentResponse.ok) {
        throw new Error(`Failed to fetch report content: ${await contentResponse.text()}`);
      }

      const contentData = await contentResponse.json();
      setFileContent(contentData.presignedUrl);
      setProcessStatus('Report content fetched successfully.');
    } catch (error) {
      console.error('Error in fetchReportContent:', error);
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
        <h3>Process Status</h3>
        <p>{processStatus}</p>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Report Content</h3>
        {isLoading ? (
          <p>Processing... This may take several minutes.</p>
        ) : fileContent ? (
          <a href={fileContent} target="_blank" rel="noopener noreferrer">View Report</a>
        ) : (
          <p>No content available. Generate a report first.</p>
        )}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Generate Report</h3>
        <button onClick={generateAndFetchReport} disabled={isLoading} style={{ marginBottom: '10px' }}>
          {isLoading ? 'Processing...' : 'Generate and Fetch Report'}
        </button>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {lambdaResult || 'Lambda function result will appear here'}
        </pre>
      </div>
    </div>
  );
};

export default DashboardPage;
