import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const DashboardPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [processStatus, setProcessStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);

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
          setProcessStatus('Report generation completed. Fetching file content...');
          await fetchFileContent();
          setIsLoading(false);
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

  const fetchFileContent = async () => {
    try {
      const { credentials } = await fetchAuthSession();
      
      const s3Client = new S3Client({
        region: 'us-east-1',
        credentials: fromCognitoIdentityPool({
          clientConfig: { region: 'us-east-1' },
          identityPoolId: 'your-identity-pool-id', // Replace with your actual Identity Pool ID
        }),
      });

      const command = new GetObjectCommand({
        Bucket: 'advertiser-performance-website',
        Key: '54984478-1031-70bb-55f1-7d6a47775c95_latest_url.txt',
      });

      const response = await s3Client.send(command);
      const content = await response.Body?.transformToString();
      
      if (content) {
        setFileContent(content);
        setProcessStatus('File content loaded successfully.');
      } else {
        throw new Error('File content is empty');
      }
    } catch (error) {
      console.error('Error fetching file content:', error);
      setError(`Error fetching file content: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        <h3>Generate Report</h3>
        <button onClick={generateAndFetchReport} disabled={isLoading} style={{ marginBottom: '10px' }}>
          {isLoading ? 'Processing...' : 'Generate and Fetch Report'}
        </button>
      </div>
      {fileContent && (
        <div style={{ marginTop: '20px' }}>
          <h3>File Content</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
            {fileContent}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
