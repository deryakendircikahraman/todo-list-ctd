const baseId = import.meta.env.VITE_BASE_ID;
const tableName = import.meta.env.VITE_TABLE_NAME;
const pat = import.meta.env.VITE_PAT;

export const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;
export const airtableAuthHeader = `Bearer ${pat}`;

export function getAirtableConfigError() {
  const missing = [];
  if (!pat) missing.push("VITE_PAT");
  if (!baseId) missing.push("VITE_BASE_ID");
  if (!tableName) missing.push("VITE_TABLE_NAME");

  if (missing.length === 0) return "";
  return `Missing Airtable config: ${missing.join(", ")}. Add them to .env.local and restart the dev server.`;
}

export function recordToTodo(record) {
  const todo = {
    id: record.id,
    ...record.fields,
  };

  // Airtable omits false/empty fields from the response; normalize here.
  if (!todo.isCompleted) todo.isCompleted = false;
  if (!todo.title) todo.title = "";

  return todo;
}

export function todoToFields(todo) {
  return {
    title: todo.title,
    isCompleted: todo.isCompleted,
  };
}

export async function airtableRequest(url, options) {
  const resp = await fetch(url, options);
  if (!resp.ok) {
    const contentType = resp.headers.get("content-type") || "";

    
    if (contentType.includes("application/json")) {
      const data = await resp.json().catch(() => null);
      const message =
        data?.error?.message ||
        data?.message ||
        `Request failed (${resp.status})`;
      throw new Error(message);
    }

    const text = await resp.text().catch(() => "");
    throw new Error(text || `Request failed (${resp.status})`);
  }
  return resp;
}


