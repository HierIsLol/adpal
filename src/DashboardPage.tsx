import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

// We definiëren een type voor de chartData
type ChartDataItem = {
  name: string;
  value: number;
};

type RechartsComponents = {
  PieChart: React.ComponentType<any>;
  Pie: React.ComponentType<any>;
  Cell: React.ComponentType<any>;
  BarChart: React.ComponentType<any>;
  Bar: React.ComponentType<any>;
  XAxis: React.ComponentType<any>;
  YAxis: React.ComponentType<any>;
  CartesianGrid: React.ComponentType<any>;
  Tooltip: React.ComponentType<any>;
  Legend: React.ComponentType<any>;
};

const DashboardPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [s3Content, setS3Content] = useState('');
  const [lambdaResult, setLambdaResult] = useState('');
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  const [RechartsComponents, setRechartsComponents] = useState<RechartsComponents | null>(null);

  useEffect(() => {
    getCurrentUser();
    fetchS3Content();
    fetchChartData();

    const { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = (window as any).Recharts;
    setRechartsComponents({ PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend });
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
      const response = await fetch('https://your-api-gateway-url.com/get-s3-content', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.text();
        setS3Content(data);
      }
    } catch (error) {
      console.error('Error fetching S3 content:', error);
    }
  };

  const callLambdaFunction = async () => {
    try {
      const response = await fetch('https://your-api-gateway-url.com/call-lambda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      if (response.ok) {
        const result = await response.json();
        setLambdaResult(JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.error('Error calling Lambda function:', error);
    }
  };

  const fetchChartData = () => {
    const data: ChartDataItem[] = [
      { name: 'Category A', value: 400 },
      { name: 'Category B', value: 300 },
      { name: 'Category C', value: 300 },
      { name: 'Category D', value: 200 },
    ];
    setChartData(data);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (!RechartsComponents) {
    return <div>Loading charts...</div>;
  }

  const { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = RechartsComponents;

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
      
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h3>Pie Chart</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={chartData}
              cx={200}
              cy={200}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        
        <div>
          <h3>Bar Chart</h3>
          <BarChart width={400} height={400} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
