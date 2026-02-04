import { useState } from "react";
import styled from "styled-components";
import TextInputWithLabel from "../shared/TextInputWithLabel";

const StyledForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem;
`;

const StyledButton = styled.button`
  background: rgba(56, 189, 248, 0.25);
  border: 1px solid rgba(56, 189, 248, 0.45);
  border-radius: 0.5rem;
  padding: 0.45rem 0.75rem;
  color: #e0f2fe;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;

  &:hover:not(:disabled) {
    background: rgba(56, 189, 248, 0.35);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    font-style: italic;
  }
`;

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (workingTodoTitle.trim() === "") return;

    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle("");
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <TextInputWithLabel
        elementId="todoTitle"
        label="Todo"
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />
      <StyledButton type="submit" disabled={workingTodoTitle.trim() === ""}>
        {isSaving ? "Saving..." : "Add Todo"}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;

