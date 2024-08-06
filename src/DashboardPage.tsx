import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const DashboardPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [processStatus, setProcessStatus] = useState('');
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
    setProcessStatus('Initiating report generation...');
    try {
      const { tokens } = await fetchAuthSession();
      const token = tokens?.idToken?.toString();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Start the Step Function execution
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
      setProcessStatus('Report generation started. Checking status...');

      // Start polling for status
      await pollStatus(token);
    } catch (error) {
      console.error('Error in generateAndFetchReport:', error);
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const pollStatus = async (token: string) => {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes total
    const pollInterval = 5000; // 5 seconds

    const checkStatus = async () => {
      try {
        console.log(`Checking status for username: ${username}`);
        const statusResponse = await fetch('https://0hrvtzi8gg.execute-api.us-east-1.amazonaws.com/prod/getstatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ username })
        });

        console.log(`Status response status: ${statusResponse.status}`);
        if (!statusResponse.ok) {
          throw new Error(`Failed to fetch status: ${await statusResponse.text()}`);
        }

        const statusData = await statusResponse.json();
        console.log('Status data:', statusData);

        if (!statusData.status) {
          throw new Error('Status is undefined in the response');
        }

        if (statusData.status === 'COMPLETED') {
          setProcessStatus('Report generation completed.');
          setIsLoading(false);
          // Here you would typically fetch and display the report
        } else if (statusData.status === 'ERROR') {
          throw new Error(`Report generation failed: ${statusData.error || 'Unknown error'}`);
        } else {
          attempts++;
          if (attempts < maxAttempts) {
            setProcessStatus(`Still processing... Attempt ${attempts} of ${maxAttempts}`);
            setTimeout(checkStatus, pollInterval);
          } else {
            throw new Error('Max attempts reached. Report generation timed out.');
          }
        }
      } catch (error) {
        console.error('Error in checkStatus:', error);
        setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    await checkStatus();
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
        <h3>Generate Report</h3>
        <button onClick={generateAndFetchReport} disabled={isLoading} style={{ marginBottom: '10px' }}>
          {isLoading ? 'Processing...' : 'Generate and Fetch Report'}
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
