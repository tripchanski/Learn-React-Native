import { useState } from "react";
import { Todo } from "@/types";

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      const newTodo: Todo = { id: newId, title: text, completed: false };
      setTodos([newTodo, ...todos]);
      setText("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return {
    todos,
    text,
    setText,
    addTodo,
    toggleTodo,
    deleteTodo,
    setTodos,
  };
};
