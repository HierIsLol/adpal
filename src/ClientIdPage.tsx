import React, { useState } from 'react';

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
    };

    return (
        <div style={{ width: '434px', height: '886px', background: '#EEEEEE', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '32.50px', padding: '20px' }}>
                <h1>↓Volg de instructies</h1>
                <p>Om verbinding te kunnen maken met je store  hebben wij een koppelingsnummer nodig.</p>
                <div style={{ margin: '20px 0' }}>
                    <label>
                        Client ID:
                        <input type="text" value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="Vul je Client ID in" />
                    </label>
                </div>
                <div style={{ margin: '20px 0' }}>
                    <label>
                        Client Secret:
                        <input type="text" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} placeholder="Vul je Client Secret in" />
                    </label>
                </div>
                <button onClick={handleSubmit}>↓Koppel mijn store!</button>
                <div id="result" style={{ marginTop: '20px', color: 'green', fontWeight: 'bold' }}>{result}</div>
            </div>
        </div>
    );
};

export default ClientIdPage;
