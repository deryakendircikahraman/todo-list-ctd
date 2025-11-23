import "./App.css";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";

function App() {
  return (
    <div className="app">
      <h1 className="app-title">My Todos</h1>

      <div className="app-card">
        <TodoForm />
        <TodoList />
      </div>
    </div>
  );
}

export default App;
