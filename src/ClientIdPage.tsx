import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';

const ClientIdPage = () => {
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [result, setResult] = useState('');
    const handleSubmit = async () => {
        const apiUrl = 'https://your-api-gateway-url/prod/client-id'; // Replace with your API Gateway URL
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clientId, clientSecret }),
            });
            const data = await response.text();
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
            setResult('Er is een fout opgetreden bij het koppelen van de store.');
        }
