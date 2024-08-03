import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

// Definieer een type voor de chartData items
type ChartDataItem = {
  name: string;
  value: number;
};

const DashboardPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [s3Content, setS3Content] = useState('');
  const [lambdaResult, setLambdaResult] = useState('');
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    getCurrentUser();
    fetchS3Content();
    fetchChartData();
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
    }
  };

  const fetchS3Content = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      const token = tokens?.idToken?.toString();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('https://your-api-gateway-url.com/get-s3-content', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        const data = await response.text();
        setS3Content(data);
      } else {
        throw new Error('Failed to fetch S3 content');
      }
    } catch (error: unknown) {
      console.error('Error fetching S3 content:', error);
      if (error instanceof Error) {
        setS3Content(`Error: ${error.message}`);
      } else {
        setS3Content('An unknown error occurred while fetching S3 content');
      }
    }
  };

  const callLambdaFunction = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      const token = tokens?.idToken?.toString();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('https://pb2g7k50l9.execute-api.us-east-1.amazonaws.com/prod/token_ophalen', {
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

  const fetchChartData = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      const token = tokens?.idToken?.toString();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Replace this URL with your actual API endpoint for fetching chart data
      const response = await fetch('https://your-api-gateway-url.com/get-chart-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data: ChartDataItem[] = await response.json();
        setChartData(data);
      } else {
        throw new Error('Failed to fetch chart data');
      }
    } catch (error: unknown) {
      console.error('Error fetching chart data:', error);
      // You might want to set some state here to show an error message in the UI
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard</h1>
      <h2>Welcome, {username}</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>S3 Content</h3>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {s3Content || 'Loading S3 content...'}
        </pre>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Lambda Function</h3>
        <button onClick={callLambdaFunction} style={{ marginBottom: '10px' }}>Call Lambda Function</button>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {lambdaResult || 'Lambda function result will appear here'}
        </pre>
      </div>
      
      <div>
        <h3>Chart Data (JSON format)</h3>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify(chartData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DashboardPage;
