# React Todo List Assignment

A Todo List application built with React, TypeScript, and Vite.
## Features & Implementation Details

1. **Structure & Layout**:
   - **`TodoInput` Section**: Centered title, clean card container with full-width text input (placeholder `New Todo`) and full-width `Add new task` teal button (`#17a2b8`).
   - **`TodoList` Section**: Centered title, three filter buttons (`All`, `Done`, `Todo`), and list cards for each task.
   - Initialized with sample tasks (`Learn ReactJS basics`, `Practice ReactJS`, `Learn Redux`, `Code portfolio in React`, `Learn React Native`).

2. **Actions (Text Buttons - No Icons)**:
   - **Checkbox**: Standard checkbox (`<input type="checkbox" />`). Once marked complete, users cannot undo completion.
   - **Edit Button**: Text button with silver background (`#c0c0c0`) and black text (`#000000`). Clicking it opens an inline editable text box with `Confirm` and `Cancel` buttons. Disabled on completed tasks.
   - **Delete Button**: Text button with red background (`#dc3545`) and white text (`#ffffff`). Enabled **only** on completed tasks (disabled on pending tasks).
   - **Delete Confirmation Modal**: Clicking Delete on a completed task opens a confirmation modal dialog (`Cancel` / `Confirm`) before removal.

3. **Ordering**:
   - Completed tasks are displayed first at the top.
   - Pending tasks follow successively.
   - Newly added tasks appear at the end of the pending list.

4. **Filters**:
   - 3 filters: `All`, `Done` (completed), and `Todo` (pending).
   - Only one filter is active at a time (`All` by default).
   - Per requirement 7, the selected filter button has an opacity of `0.6` to visually differentiate it from unselected filters.
   - Filtering buttons are hidden when no tasks exist.

5. **Messaging**:
   - Displays `No todo is available` when the list or current filter has no items.

## Setup & Running Locally

Prerequisite: Node.js 18+.

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

## Production Build

```bash
npm run build
npm run preview
```
