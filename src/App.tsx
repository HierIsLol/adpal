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
  const [todos, setTodos] = useState<Todo[]>([]);

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

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      // Voeg hier de logica toe om een nieuw todo-item aan te maken
      // Bijvoorbeeld een fetch-aanroep naar een createTodo-mutation in GraphQL
    }
  }

  return (
    <Router>
      <Authenticator>
        {({ signOut, user }) => (
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <h1>{user?.signInDetails?.loginId}'s todos</h1>
                  <button onClick={createTodo}>+ new</button>
                  <ul>
                    {todos.map((todo) => (
                      <li key={todo.id}>
                        {todo.content} - {todo.isDone ? 'Done' : 'Not Done'}
                      </li>
                    ))}
                  </ul>
                  <div>
                    🥳 App successfully hosted. Try creating a new todo.
                    <br />
                    <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
                      Review next step of this tutorial.
                    </a>
                  </div>
                  <button onClick={signOut}>Sign out</button>
                  <Link to="/store-link">
                    <button>Koppel mijn store</button>
                  </Link>
                </>
              } />
              <Route path="/store-link" element={<StoreLinkPage />} />
            </Routes>
          </main>
        )}
      </Authenticator>
    </Router>
  );
}

export default App;
