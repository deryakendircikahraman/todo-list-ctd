import "./App.css";
import { useEffect, useState } from "react";
import TodoForm from "./features/TodoForm";
import TodoList from "./features/TodoList/TodoList";
import {
  airtableAuthHeader,
  airtableRequest,
  airtableUrl,
  recordToTodo,
  todoToFields,
} from "./utils/airtable";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const options = {
        method: "GET",
        headers: {
          Authorization: airtableAuthHeader,
        },
      };

      try {
        const resp = await airtableRequest(airtableUrl, options);
        const { records } = await resp.json();
        const fetchedTodos = records.map((record) => recordToTodo(record));
        setTodoList(fetchedTodos);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

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
      setIsSaving(true);
      const resp = await airtableRequest(airtableUrl, options);
      const { records } = await resp.json();

      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!savedTodo.isCompleted) savedTodo.isCompleted = false;

      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    const updatedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo
    );

    setTodoList(updatedTodos);

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
      setIsSaving(true);
      await airtableRequest(airtableUrl, options);
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      const revertedTodos = todoList.map((todo) =>
        todo.id === editedTodo.id ? originalTodo : todo
      );
      setTodoList(revertedTodos);
    } finally {
      setIsSaving(false);
    }
  }

  async function completeTodo(todoToComplete) {
    const originalTodo = todoList.find((todo) => todo.id === todoToComplete.id);
    const completedTodo = { ...todoToComplete, isCompleted: true };
    const updatedTodos = todoList.map((todo) =>
      todo.id === todoToComplete.id ? completedTodo : todo
    );
    setTodoList(updatedTodos);

    const payload = {
      records: [
        {
          id: todoToComplete.id,
          fields: todoToFields(completedTodo),
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
      await airtableRequest(airtableUrl, options);
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      const revertedTodos = todoList.map((todo) =>
        todo.id === todoToComplete.id ? originalTodo : todo
      );
      setTodoList(revertedTodos);
    }
  }

  return (
    <div className="todo-card">
      <h1 className="title">Todo List</h1>

      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />

      {errorMessage ? (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button type="button" onClick={() => setErrorMessage("")}>
            Dismiss
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default App;
