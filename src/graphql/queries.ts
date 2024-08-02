// src/graphql/queries.ts

export const listTodos = `query ListTodos {
  listTodos {
    items {
      id
      content
      isDone
    }
  }
}`;
