import "./App.css";
import { useState } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

function App() {
  const [todoList, setTodoList] = useState([
    { id: 1, title: "review resources", isCompleted: false },
    { id: 2, title: "take notes", isCompleted: false },
    { id: 3, title: "code out app", isCompleted: false },
  ]);

  function addTodo(title) {
    const cleanedTitle = title.trim();
    if (!cleanedTitle) return;

    const newTodo = {
      id: crypto.randomUUID(),
      title: cleanedTitle,
      isCompleted: false,
    };

    setTodoList([...todoList, newTodo]);
  }

  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) return { ...todo, isCompleted: true };
      return todo;
    });
    setTodoList(updatedTodos);
  }

  return (
    <div className="todo-card">
      <h1 className="title">Todo List</h1>

      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  );
}

export default App;
