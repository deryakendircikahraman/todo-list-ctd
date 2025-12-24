import { useState } from "react";

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (workingTodoTitle.trim() === "") return;

    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        id="todoTitle"
        type="text"
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />
      <button type="submit" disabled={workingTodoTitle.trim() === ""}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
