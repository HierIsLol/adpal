import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect, useState } from "react";
import { API, graphqlOperation } from 'aws-amplify';
import { listTodos } from './graphql/queries';

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
      const response = await API.graphql(graphqlOperation(listTodos)) as ListTodosResponse;
      const items = response.data.listTodos.items;
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
      // Hier moet je de logica toevoegen om een nieuw todo-item aan te maken via AWS Amplify
    }
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
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
        </main>
      )}
    </Authenticator>
  );
}

export default App;
