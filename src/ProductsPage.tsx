import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Array<{ ean: string; title: string; percentage?: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://6kvaz936z5.execute-api.us-east-1.amazonaws.com/prod/startProductFetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username }),
      });

      if (!response.ok) {
        throw new Error('Failed to start product fetch');
      }

      const data = await response.json();
      console.log('Response from startProductFetch:', data);
      setProducts([]); // Clear existing products
      setError('Product fetch started. Please wait for the process to complete.');
    } catch (err) {
      setError('Error starting product fetch. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePercentageChange = (ean: string, percentage: number) => {
    setProducts(prevProducts => prevProducts.map(product => 
      product.ean === ean ? { ...product, percentage } : product
    ));
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
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {products.length === 0 ? (
          <p>Geen producten gevonden. Klik op de knop om het ophalen van producten te starten.</p>
        ) : (
          products.map(product => (
            <div key={product.ean} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0', padding: '10px', border: '1px solid #ddd' }}>
              <div>
                <strong>{product.title}</strong>
                <br />
                <small>EAN: {product.ean}</small>
              </div>
              <input
                type="number"
                value={product.percentage || ''}
                onChange={(e) => handlePercentageChange(product.ean, Number(e.target.value))}
                placeholder="Percentage"
                style={{ width: '80px' }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
