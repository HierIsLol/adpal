import React, { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

const ProductsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthenticator((context) => [context.user]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Sending request to start product fetch");
      const response = await fetch('https://6kvaz936z5.execute-api.us-east-1.amazonaws.com/prod/startProductFetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username }),
      });

      console.log("Received response:", response);
      const data = await response.json();
      console.log("Parsed response data:", data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start product fetch');
      }

      setError('Product fetch started successfully. Please wait for the process to complete.');
    } catch (err) {
      console.error('Error:', err);
      setError(`Error starting product fetch: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '20px' }}>
      <h1>Producten</h1>
      <button 
        onClick={fetchProducts}
        disabled={isLoading}
        style={{ 
          fontSize: '18px', 
          padding: '10px 20px', 
          backgroundColor: '#083464', 
          border: 'none', 
          cursor: 'pointer', 
          color: 'white', 
          margin: '10px' 
        }}
      >
        {isLoading ? 'Bezig met starten...' : 'Start product ophalen'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ProductsPage;
