import "./App.css";
import { useState } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

function App() {
  const [newTodo, setNewTodo] = useState("new todo..."); // state

  const todos = [
    { id: 1, title: "review resources" },
    { id: 2, title: "take notes" },
    { id: 3, title: "code out app" },
  ];

  return (
    <div className="todo-card">
      <h1 className="title">Todo List</h1>

      <TodoForm />

      {/* Part 2: state değeri burada gösteriliyor */}
      <p className="preview">{newTodo}</p>

      <TodoList todos={todos} />
    </div>
  );
}

export default App;
