import "./App.css";
import { useCallback, useEffect, useReducer, useState } from "react";
import TodoForm from "./features/TodoForm";
import TodoList from "./features/TodoList/TodoList";
import TodosViewForm from "./features/TodosViewForm";
import {
  airtableAuthHeader,
  airtableRequest,
  airtableUrl,
  todoToFields,
} from "./utils/airtable";
import styles from "./App.module.css";
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from "./reducers/todos.reducer";

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");

  const encodeUrl = useCallback(() => {
    const sortQuery = `sort[0][field]=${encodeURIComponent(sortField)}&sort[0][direction]=${encodeURIComponent(sortDirection)}`;
    let url = `${airtableUrl}?${sortQuery}`;
    if (queryString) {
      const escapedQuery = queryString.replace(/"/g, '\\"');
      const formula = `SEARCH("${escapedQuery}", {title})`;
      url += `&filterByFormula=${encodeURIComponent(formula)}`;
    }
    return url;
  }, [sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });

      const options = {
        method: "GET",
        headers: {
          Authorization: airtableAuthHeader,
        },
      };

      try {
        const resp = await airtableRequest(encodeUrl(), options);
        const { records } = await resp.json();
        dispatch({ type: todoActions.loadTodos, records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error });
      }
    };

    fetchTodos();
  }, [sortField, sortDirection, queryString, encodeUrl]);

  async function addTodo(title) {
    const cleanedTitle = title.trim();
    if (!cleanedTitle) return;

    const newTodo = {
      title: cleanedTitle,
      isCompleted: false,
    };

    const payload = {
      records: [
        {
          fields: todoToFields(newTodo),
        },
      ],
    };

    const options = {
      method: "POST",
      headers: {
        Authorization: airtableAuthHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      dispatch({ type: todoActions.startRequest });
      const resp = await airtableRequest(encodeUrl(), options);
      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, records });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
      dispatch({ type: todoActions.endRequest });
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoState.todoList.find(
      (todo) => todo.id === editedTodo.id
    );
    dispatch({ type: todoActions.updateTodo, editedTodo });

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: todoToFields(editedTodo),
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: airtableAuthHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      dispatch({ type: todoActions.startRequest });
      await airtableRequest(encodeUrl(), options);
      dispatch({ type: todoActions.endRequest });
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error: { message: `${error.message}. Reverting todo...` },
      });
      dispatch({ type: todoActions.endRequest });
    }
  }

  async function completeTodo(todoToComplete) {
    const originalTodo = todoState.todoList.find(
      (todo) => todo.id === todoToComplete.id
    );
    dispatch({ type: todoActions.completeTodo, id: todoToComplete.id });

    const payload = {
      records: [
        {
          id: todoToComplete.id,
          fields: todoToFields({ ...todoToComplete, isCompleted: true }),
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: airtableAuthHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      await airtableRequest(encodeUrl(), options);
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error: { message: `${error.message}. Reverting todo...` },
      });
    }
  }

  return (
    <div className={styles.todoCard}>
      <h1 className={styles.title}>Todo List</h1>

      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
      <TodoList
        todoList={todoState.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
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

      {todoState.errorMessage ? (
        <div className={styles.errorContainer}>
          <hr />
          <p>{todoState.errorMessage}</p>
          <button
            type="button"
            onClick={() => dispatch({ type: todoActions.clearError })}
          >
            Dismiss
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default App;
