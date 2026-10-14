import { useMemo, useState, type FormEvent } from "react";

type Todo = {
  id: number;
  description: string;
  completed: boolean;
};

type Filter = "All" | "Done" | "Todo";

const initialTodos: Todo[] = [
  { id: 1, description: "Complete 10k steps", completed: true },
  { id: 2, description: "Drink 4 litre water", completed: false },
  { id: 3, description: "Complete the assignment", completed: false },
  { id: 4, description: "Finish PR Review ", completed: false },
  { id: 5, description: "Run 4km", completed: false },
];

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newDescription, setNewDescription] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

  // Ordering requirements:
  // 1. Completed tasks are shown first, followed by pending tasks.
  // 2. Newly added todos appear at the end of the pending list.
  const visibleTodos = useMemo(() => {
    const completedTasks = todos.filter((t) => t.completed);
    const pendingTasks = todos.filter((t) => !t.completed);
    const ordered = [...completedTasks, ...pendingTasks];

    if (filter === "Done") return completedTasks;
    if (filter === "Todo") return pendingTasks;
    return ordered;
  }, [todos, filter]);

  function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTodos((current) => [
      ...current,
      {
        id: Date.now(),
        description: newDescription,
        completed: false,
      },
    ]);
    setNewDescription("");
  }

  function startEditing(todo: Todo) {
    if (todo.completed) return;
    setEditingId(todo.id);
    setEditDescription(todo.description);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditDescription("");
  }

  function confirmEditing(id: number) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, description: editDescription } : todo
      )
    );
    cancelEditing();
  }

  function toggleCompleted(todo: Todo) {
    if (todo.completed) return;

    setTodos((current) =>
      current.map((item) =>
        item.id === todo.id ? { ...item, completed: true } : item
      )
    );
    if (editingId === todo.id) {
      cancelEditing();
    }
  }

  function initiateDelete(todo: Todo) {
    if (!todo.completed) return;
    setTodoToDelete(todo);
  }

  function confirmDelete() {
    if (todoToDelete) {
      setTodos((current) => current.filter((item) => item.id !== todoToDelete.id));
      if (editingId === todoToDelete.id) {
        cancelEditing();
      }
      setTodoToDelete(null);
    }
  }

  function cancelDelete() {
    setTodoToDelete(null);
  }

  const filters: Filter[] = ["All", "Done", "Todo"];

  return (
    <div className="app-container">
      {/* SECTION 1: TodoInput */}
      <section className="section-input" aria-labelledby="todo-input-title">
        <h2 id="todo-input-title" className="section-title">
          TodoInput
        </h2>
        <div className="card input-card">
          <form onSubmit={addTodo} className="todo-form">
            <input
              type="text"
              className="todo-input"
              placeholder="New Todo"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              aria-label="New Todo description"
            />
            <button type="submit" className="btn btn-primary btn-block add-task-btn">
              Add new task
            </button>
          </form>
        </div>
      </section>

      {/* SECTION 2: TodoList */}
      <section className="section-list" aria-labelledby="todo-list-title">
        <h2 id="todo-list-title" className="section-title">
          TodoList
        </h2>

        {/* Filter buttons: Visible only when at least 1 todo item exists */}
        {todos.length > 0 && (
          <div className="filters-container" role="group" aria-label="Todo Filters">
            {filters.map((filterName) => (
              <button
                key={filterName}
                type="button"
                className={`btn btn-filter ${filter === filterName ? "selected" : ""}`}
                onClick={() => setFilter(filterName)}
                aria-pressed={filter === filterName}
              >
                {filterName}
              </button>
            ))}
          </div>
        )}

        {/* Messaging: When no todos exist or when current filter has no items */}
        {visibleTodos.length === 0 ? (
          <div className="empty-message-container" role="status">
            <p className="empty-message">No todo is available</p>
          </div>
        ) : (
          <div className="todo-items-list">
            {visibleTodos.map((todo) => {
              const isEditing = editingId === todo.id;

              return (
                <div
                  key={todo.id}
                  className={`todo-item-card ${todo.completed ? "is-completed" : ""}`}
                >
                  {isEditing ? (
                    <div className="edit-mode-row">
                      <input
                        type="text"
                        autoFocus
                        className="edit-input"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmEditing(todo.id);
                          if (e.key === "Escape") cancelEditing();
                        }}
                        aria-label="Edit description"
                      />
                      <div className="edit-actions">
                        <button
                          type="button"
                          className="btn btn-confirm"
                          onClick={() => confirmEditing(todo.id)}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          className="btn btn-cancel"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`todo-text ${todo.completed ? "todo-completed-text" : ""}`}
                      >
                        {todo.description}
                      </span>

                      <div className="todo-actions">
                        {/* Checkbox: Standard input checkbox */}
                        <input
                          type="checkbox"
                          className="todo-checkbox"
                          checked={todo.completed}
                          onChange={() => toggleCompleted(todo)}
                          disabled={todo.completed}
                          aria-label={`Mark "${todo.description}" as completed`}
                          title={
                            todo.completed
                              ? "Completed (cannot undo)"
                              : "Click to complete"
                          }
                        />

                        {/* Edit Text Button: Silver background with black text */}
                        <button
                          type="button"
                          className="btn btn-silver-edit"
                          onClick={() => startEditing(todo)}
                          disabled={todo.completed}
                          title={
                            todo.completed
                              ? "Completed tasks cannot be edited"
                              : "Edit todo"
                          }
                        >
                          Edit
                        </button>

                        {/* Delete Text Button: Red background with white text */}
                        <button
                          type="button"
                          className="btn btn-red-delete"
                          onClick={() => initiateDelete(todo)}
                          disabled={!todo.completed}
                          title={
                            todo.completed
                              ? "Delete todo"
                              : "Complete this todo before deleting"
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Confirmation Dialog / Modal before deletion */}
      {todoToDelete && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-dialog">
            <h3 id="modal-title" className="modal-title">
              Delete Confirmation
            </h3>
            <p className="modal-message">
              Are you sure you want to delete this completed task?
            </p>
            <p className="modal-todo-preview">"{todoToDelete.description}"</p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger-confirm"
                onClick={confirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
