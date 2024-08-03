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
  const [newTodoContent, setNewTodoContent] = useState<string>('');

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
      console.log('Fetched data:', responseData);  // Controleer of er data binnenkomt
      const items = responseData.data.listTodos.items;
      setTodos(items);
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addTodo = () => {
    if (newTodoContent.trim() === '') {
      return;
    }
    const newTodo: Todo = {
      id: new Date().toISOString(),
      content: newTodoContent,
      isDone: false,
    };
    setTodos([...todos, newTodo]);
    setNewTodoContent('');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Todo List</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.content} - {todo.isDone ? 'Done' : 'Not Done'}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          placeholder="New todo"
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
    </div>
  );
};

export default App;
