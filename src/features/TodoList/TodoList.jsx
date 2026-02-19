import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import TodoListItem from "./TodoListItem";
import styles from "./TodoList.module.css";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);
  const currentTodos = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );

  useEffect(() => {
    if (totalPages > 0) {
      if (
        isNaN(currentPage) ||
        currentPage < 1 ||
        currentPage > totalPages
      ) {
        navigate("/");
      }
    }
  }, [currentPage, totalPages, navigate]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: currentPage - 1 });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams({ page: currentPage + 1 });
    }
  };

  return (
    <>
      <ul className={styles.todoList}>
        {isLoading ? (
          <p>Todo list loading...</p>
        ) : filteredTodoList.length === 0 ? (
          <p>Add todo above to get started</p>
        ) : (
          currentTodos.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))
        )}
      </ul>
      {filteredTodoList.length > itemsPerPage && (
        <div className={styles.paginationControls}>
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default TodoList;

