import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const DashboardPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser();
    fetchFileContent();
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

  const fetchFileContent = async () => {
    try {
      const { credentials } = await fetchAuthSession();
      
      const s3Client = new S3Client({
        region: 'us-east-1',
        credentials: fromCognitoIdentityPool({
          clientConfig: { region: 'us-east-1' },
          identityPoolId: 'us-east-1_hDRllzVfc', // Replace with your actual Identity Pool ID
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
      } else {
        throw new Error('File content is empty');
      }
    } catch (error) {
      console.error('Error fetching file content:', error);
      setError(`Error fetching file content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const triggerLambdaFunction = async () => {
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

      if (!response.ok) {
        throw new Error(`Failed to trigger Lambda function: ${await response.text()}`);
      }

      const result = await response.json();
      console.log('Lambda function triggered:', result);
      alert('Lambda function triggered successfully');
    } catch (error) {
      console.error('Error triggering Lambda function:', error);
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard</h1>
      <h2>Welcome, {username}</h2>
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      <div style={{ marginBottom: '20px' }}>
        <h3>Trigger Lambda Function</h3>
        <button onClick={triggerLambdaFunction} style={{ marginBottom: '10px' }}>
          Trigger Lambda
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
