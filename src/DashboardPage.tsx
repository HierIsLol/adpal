import { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const DashboardPage = () => {
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

  const callLambdaFunction = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      const token = tokens?.idToken?.toString();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      console.log('Calling Lambda function...');
      const response = await fetch('https://niitq7f67k.execute-api.us-east-1.amazonaws.com/prod/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username })
      });

      console.log('Response received:', response);
      if (response.ok) {
        const result = await response.json();
        console.log('Parsed result:', result);
        setLambdaResult(JSON.stringify(result, null, 2));
        
        if (typeof result === 'string') {
          // Als de result een string is, probeer het te parsen
          try {
            const parsedResult = JSON.parse(result);
            console.log('Parsed string result:', parsedResult);
            if (parsedResult.presignedUrl) {
              setPresignedUrl(parsedResult.presignedUrl);
            }
          } catch (e) {
            console.error('Failed to parse result string:', e);
          }
        } else if (result.body) {
          // Als result een object is met een body property
          try {
            const bodyObj = JSON.parse(result.body);
            console.log('Parsed body object:', bodyObj);
            if (bodyObj.presignedUrl) {
              setPresignedUrl(bodyObj.presignedUrl);
            }
          } catch (e) {
            console.error('Failed to parse result.body:', e);
          }
        } else if (result.presignedUrl) {
          // Als de presignedUrl direct beschikbaar is in het result object
          setPresignedUrl(result.presignedUrl);
        }
        
        console.log('Final presignedUrl state:', presignedUrl);
      } else {
        const errorText = await response.text();
        throw new Error(`API request failed: ${errorText}`);
      }
    } catch (error) {
      console.error('Error calling Lambda function:', error);
      setLambdaResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard</h1>
      <h2>Welcome, {username}</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      
      <div style={{ marginBottom: '20px' }}>
        <h3>S3 Content</h3>
        {presignedUrl ? (
          <iframe 
            src={presignedUrl}
            width="100%"
            height="600px"
            title="S3 Content"
          ></iframe>
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
