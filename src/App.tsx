import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect, useState } from "react";
import { listTodos } from './graphql/queries';
import StoreLinkPage from './StoreLinkPage';

type Todo = {
  id: string;
  content: string;
  isDone: boolean;
};

type ListTodosResponse = {
  data: {
    listTodos: {
      items: Todo[];
      nextToken?: string;
    };
  };
};

function App() {

  const fetchData = async () => {
    try {
      const response = await fetch('https://v6wglzzy3rgnfhgeks3ysp3ezq.appsync-api.us-east-1.amazonaws.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'da2-yan4cms26nbpjnzayiv5s3qrdm',
        },
        body: JSON.stringify({
          query: listTodos,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData: ListTodosResponse = await response.json();
      const items = responseData.data.listTodos.items;
      setTodos(items);
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Router>
      <Authenticator>
        {({ signOut, user }) => (
          <main style={{ position: 'relative' }}>
            <img 
              src="https://i.postimg.cc/Mp8Whhmw/Ad-Pal-logo-no-white.png" 
              style={{ width: '188px', height: '188px', left: '50%', top: '20px', transform: 'translateX(-50%)', position: 'absolute' }} 
              alt="AdPal Logo"
            />
            <div style={{ paddingTop: '220px', textAlign: 'center' }}>
              <h1>Welkom {user?.signInDetails?.loginId}</h1>
              <p>We zijn nog druk bezig, je kunt alvast je store koppelen :)</p>
              <Link to="/store-link">
                <button style={{ fontSize: '18px', padding: '10px 20px', backgroundColor: '#d3d3d3', border: 'none', cursor: 'pointer' }}>
                  Koppel mijn store
                </button>
              </Link>
              <button onClick={signOut} style={{ display: 'block', margin: '20px auto', backgroundColor: '#d3d3d3', border: 'none', cursor: 'pointer' }}>
                Sign out
              </button>
            </div>
            <Routes>
              <Route path="/store-link" element={<StoreLinkPage />} />
            </Routes>
          </main>
        )}
      </Authenticator>
    </Router>
  );
}

export default App;
