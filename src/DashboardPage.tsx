import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const DashboardPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [lambdaResult, setLambdaResult] = useState('');
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
        setLambdaResult(JSON.stringify(result, null, 2));
        
        // Wacht 15 seconden en haal dan de S3-inhoud op
        setTimeout(() => {
          fetchS3Content();
        }, 15000);
      } else {
        const errorText = await response.text();
        throw new Error(`API request failed: ${errorText}`);
      }
    } catch (error: unknown) {
      console.error('Error calling Lambda function:', error);
      if (error instanceof Error) {
        setLambdaResult(`Error: ${error.message}`);
      } else {
        setLambdaResult('An unknown error occurred');
      }
    }
  };

  const fetchS3Content = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      const token = tokens?.idToken?.toString();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const filename = `${username}_report_${new Date().toISOString().split('T')[0]}.json`;

      const response = await fetch('https://9xk13nx1mf.execute-api.us-east-1.amazonaws.com/default/s3latenzien', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Custom-Filename': filename
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          // Als we een URL krijgen, tonen we die in het iframe
          console.log('S3 Content URL:', data.url);
        } else {
          console.error('Error: Unexpected response format');
        }
      } else {
        throw new Error('Failed to fetch S3 content');
      }
    } catch (error) {
      console.error('Error fetching S3 content:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard</h1>
      <h2>Welcome, {username}</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      
      <div style={{ marginBottom: '20px' }}>
        <h3>S3 Content</h3>
        <iframe 
          src="https://advertiser-performance-website.s3.us-east-1.amazonaws.com/54984478-1031-70bb-55f1-7d6a47775c95_index.html?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQD38wLIcUK5qzZxhcR%2B3X3FQaA69FngpquiKuP0AdjcUAIhANlDljyXu62kSm0ABIHVQU%2BvUV1FuohNvjL%2BhpvJazRCKu0CCNH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMzgxNDkxODU3OTUzIgwpOAcLyee%2F8Vp9EEcqwQIXZT8%2Ba2jKt98pO5x0Byo7L2bR9yH%2BN7M9FacMy%2BBCNjNzUdVGhsODx1rmd9UCIquQ8rvT%2FNX4OP5DrxinIxJaBh9GJSUrW9XsUWLSVdgxcoEEtnEuwaIgG%2BMTQHG2o3OXnmPRDoE6wNUmsT8K435lo2TNnl23xkgcmCRifCFLKNhVKzZJ2pnLUUbpXyRo%2BqUZmJByZNv5FGTz91eKGH4Sq30qiRe2A4ncVNECQ8HdVE6pU5RVJYxN%2BSd38ahkNdzFf5IWGNEm0dC3H9xrlyJuH3xpg%2BySwY0tTiehd3ce062fpjnOKnM%2FE9WvkZmxDmTAuJ%2BTmZQQlXqO9wu%2BKqD%2FvaJbzdmqt7lNfF7TRb%2FI3VBDShAudC8yTpvGGz1z%2FItX7xWsWlbDV4ZzVQ6fr9OwDDGThhgGV2wt39ahmw2CAXUw%2Fo%2FCtQY6sgIZmTbqB6Uw%2F5Hr8xdxstc5e%2Bq52sMlfSg8jzLClLxtj0AlwGoxJwbK%2FfHpEXaWbFJfuOGodAVMNBeJjpS5CrNVRUSEBqCBQ843%2BvYu8%2Fv1FNtGDxZlFKQqIfkJ7z1Nf%2Fo0yl%2FLyiLxjtB5IuobspgUR%2BUchWgO6DZI9DU5Ct6l5zs7FOVr2GvMRwae%2F96u9HX8%2BblRilZNueAWLgsnJbpeNP2y8kYjNjVqYcKNEUHBRAE0sEgd4LzBNw1W7nuAuJvTyRXxlACXbgiXPX8T2k4%2FmgNrIZ7Sm9Dzxf3fgKD4fXspFwDaOVmgYiYA8%2F2xJDfli5mj61O6mKEvpCVNyQq2h2L9ixoJrLyd0ACd%2B07B89fJILBFR8OAN9b0ITC0bPlIwcoJnPy5FWu8Jb655Ei%2FWd8%3D"
          width="100%"
          height="600px"
          title="S3 Content"
        ></iframe>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Lambda Function</h3>
        <button onClick={callLambdaFunction} style={{ marginBottom: '10px', marginRight: '10px' }}>Call Lambda Function</button>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {lambdaResult || 'Lambda function result will appear here'}
        </pre>
      </div>
    </div>
  );
};

export default DashboardPage;
