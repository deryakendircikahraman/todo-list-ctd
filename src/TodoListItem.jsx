function TodoListItem({ todo, onCompleteTodo }) {
  return (
    <li className="todo-item">
      <label>
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => onCompleteTodo(todo.id)}
        />
        <span>{todo.title}</span>
      </label>
    </li>
  );
}

export default TodoListItem;
