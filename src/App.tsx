import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => {
        if (data.data && data.data.items) {
          setTodos(data.data.items);
        } else {
          console.error("Invalid data structure:", data);
        }
      },
    });

    // Fetch initial data
    client.models.Todo.list().then((data) => {
      if (data.data && data.data.items) {
        setTodos(data.data.items);
      } else {
        console.error("Invalid data structure:", data);
      }
    });

    // Clean up the subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  async function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      try {
        await client.models.Todo.create({ content });
        const data = await client.models.Todo.list();
        if (data.data && data.data.items) {
          setTodos(data.data.items);
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Error creating todo:", error);
        // Log the detailed error
        console.error("Detailed error:", JSON.stringify(error, null, 2));
      }
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
              <li key={todo.id}>{todo.content}</li>
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
