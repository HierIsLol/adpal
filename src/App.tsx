import { listTodos } from './graphql/queries';
import { useState, useEffect } from 'react';

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

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://your-appsync-api-endpoint/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'your-api-key',
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
    <div>
      <h1>Todo List</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.content} - {todo.isDone ? 'Done' : 'Not Done'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
