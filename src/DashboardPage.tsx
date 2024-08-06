import React, { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const DashboardPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  // Hardcoded file content
  const fileContent = `This is the content of the file:
s3://advertiser-performance-website/54984478-1031-70bb-55f1-7d6a47775c95_latest_url.txt

You can replace this text with the actual content of your file.`;

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
        body: JSON.stringify({ username: 'user' }) // You might want to replace 'user' with the actual username if available
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
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      <div style={{ marginBottom: '20px' }}>
        <h3>Trigger Lambda Function</h3>
        <button onClick={triggerLambdaFunction} style={{ marginBottom: '10px' }}>
          Trigger Lambda
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>File Content</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {fileContent}
        </pre>
      </div>
    </div>
  );
};

export default DashboardPage;
