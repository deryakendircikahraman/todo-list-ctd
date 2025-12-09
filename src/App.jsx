import "./App.css";
import { useState } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

function App() {
  const [newTodo, setNewTodo] = useState("new todo...");

  return (
    <div className="todo-card">
      <h1 className="title">Todo List</h1>

      <TodoForm />

      <p>{newTodo}</p>

      <TodoList />
    </div>
  );
}

export default App;
