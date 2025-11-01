# Kanban Board Component

## 🔴 Live Storybook

[https://kanban-board-ayush-orcin.vercel.app/]

> **Note:** This is the main submission. All features are demonstrated in the "Interactive" and "LargeDataset" stories.

---

## 🚀 Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/Ayush-Pathak2006/Kanban-Board.git]
    ```
2.  Navigate into the project:
    ```bash
    cd [Kanba-Board]
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Run the Storybook:
    ```bash
    npm run storybook
    ```

---

## 🏗️ Architecture

My approach was to build the components from the "inside out," starting with the smallest piece (`KanbanCard`) and moving up to the `KanbanColumn` and finally the `KanbanBoard`.

* **State Management:** All state is managed within the "Interactive" Storybook story using React `useState` hooks. This allows for a fully self-contained demo of all functionality without needing a separate application.
* **Drag-and-Drop:** Implemented using `@dnd-kit/core` as required.
    * `useDraggable` is on the `KanbanCard`.
    * `useDroppable` is on both the `KanbanColumn` (to accept new cards) and the `KanbanCard` (to allow for reordering).
    * Sensors (`MouseSensor`, `TouchSensor`) are configured with an `activationConstraint` to differentiate between a "click" (to open the modal) and a "drag" (to move the card).
* **Performance:** Performance is handled in two main ways as required
    1.  `React.memo` is used on both `KanbanCard` and `KanbanColumn` to prevent unnecessary re-renders during state changes.
    2.  A lightweight virtualization is implemented in `KanbanColumn` that only renders tasks within the visible viewport, allowing it to handle 500+ tasks smoothly.
* **Modals:** A reusable `Modal` primitive was built in `src/primitives/Modal.tsx`. This component is used by `TaskModal.tsx` to display and edit task details.

---

## ✨ Features

-   [x] **Drag-and-Drop:** Move tasks between columns and reorder tasks within a single column.
-   [x] **Task CRUD:** Full Create, Read, Update, and Delete for tasks.
-   [x] **Create Task:** Click "+ Add a card" on any column to open the modal and create a new task in that column.
-   [x] **Edit Task:** Click any card to open the modal. You can edit the title, description, priority, and status.
-   [x] **Delete Task:** A "Delete" button in the modal removes the task.
-   [x] **WIP Limits:** Columns show a red border and an updated task count when the number of tasks exceeds the `maxTasks` limit.
-   [x] **Performance:** Handles large lists (500+ tasks) using `React.memo` and virtualization.
-   [x] **Click vs. Drag:** A 5px drag distance constraint prevents a drag from firing on a simple click.
-   [x] **Keyboard Shortcuts:** Press `Enter` in the modal (except in the textarea) to save. Press `Escape` to close.
-   [ ] *Keyboard Accessibility (Drag-and-Drop): Not implemented.*

---

## 📚 Storybook Stories

This project fulfills all Storybook requirements from the assignment:

* **`Interactive`:** The main playground. This story is fully functional with all features: drag-and-drop, modals, create, edit, delete, and WIP limits.
* **`LargeDataset`:** A performance test story. It includes one column with 500+ virtualized tasks to demonstrate smooth scrolling.
* **`Default`:** A static, non-interactive view of a standard board.
* **`Empty`:** A static view of a board with no tasks.

---

## 🛠️ Technologies

* React 18 + TypeScript
* Vite
* Tailwind CSS (with required design tokens)
* Storybook
* `@dnd-kit/core`