import TodoForm from "../features/TodoForm";
import TodoList from "../features/TodoList/TodoList";
import TodosViewForm from "../features/TodosViewForm";
import styles from "../App.module.css";

function TodosPage({
  todoList,
  isLoading,
  isSaving,
  errorMessage,
  onAddTodo,
  onUpdateTodo,
  onCompleteTodo,
  onClearError,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  return (
    <>
      <TodoForm onAddTodo={onAddTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={onCompleteTodo}
        onUpdateTodo={onUpdateTodo}
        isLoading={isLoading}
      />

      <hr />
      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      {errorMessage ? (
        <div className={styles.errorContainer}>
          <hr />
          <p>{errorMessage}</p>
          <button type="button" onClick={onClearError}>
            Dismiss
          </button>
        </div>
      ) : null}
    </>
  );
}

export default TodosPage;
