import { useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (workingTodoTitle.trim() === "") return;

    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInputWithLabel
        elementId="todoTitle"
        label="Todo"
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />
      <button type="submit" disabled={workingTodoTitle.trim() === ""}>
        {isSaving ? "Saving..." : "Add Todo"}
      </button>
    </form>
  );
}

export default TodoForm;

