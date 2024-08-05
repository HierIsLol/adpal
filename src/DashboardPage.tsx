import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const DashboardPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [lambdaResult, setLambdaResult] = useState('');
  const [presignedUrl, setPresignedUrl] = useState('');
  const [reportContent, setReportContent] = useState('');
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
        console.log('Lambda function result:', result);
        setLambdaResult(JSON.stringify(result, null, 2));
        
        if (result.body) {
          const bodyObj = JSON.parse(result.body);
          if (bodyObj.urlKey) {
            await fetchPresignedUrl(bodyObj.urlKey);
          }
        }
      } else {
        const errorText = await response.text();
        throw new Error(`API request failed: ${errorText}`);
      }
    } catch (error) {
      console.error('Error calling Lambda function:', error);
      setLambdaResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const fetchPresignedUrl = async (urlKey: string) => {
    try {
      const { tokens } = await fetchAuthSession();
      const token = tokens?.idToken?.toString();

      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`https://niitq7f67k.execute-api.us-east-1.amazonaws.com/prod/getUrl?key=${urlKey}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const url = await response.text();
        console.log('Fetched presigned URL:', url);
        setPresignedUrl(url);
        await fetchReportContent(url);
      } else {
        throw new Error(`Failed to fetch presigned URL: ${await response.text()}`);
      }
    } catch (error) {
      console.error('Error fetching presigned URL:', error);
      setError(`Failed to fetch report URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const fetchReportContent = async (url: string) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const content = await response.text();
        setReportContent(content);
      } else {
        throw new Error(`Failed to fetch report content: ${await response.text()}`);
      }
    } catch (error) {
      console.error('Error fetching report content:', error);
      setError(`Failed to fetch report content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard</h1>
      <h2>Welcome, {username}</h2>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      <div style={{ marginBottom: '20px' }}>
        <h3>Report Content</h3>
        {reportContent ? (
          <div dangerouslySetInnerHTML={{ __html: reportContent }} />
        ) : (
          <p>No content available. Generate a report first.</p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Lambda Function</h3>
        <button onClick={callLambdaFunction} style={{ marginBottom: '10px' }}>Generate Report</button>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {lambdaResult || 'Lambda function result will appear here'}
        </pre>
      </div>
    </div>
  );
};

export default DashboardPage;
