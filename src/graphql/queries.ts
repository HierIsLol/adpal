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
