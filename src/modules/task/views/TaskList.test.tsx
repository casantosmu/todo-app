/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { faker } from "@faker-js/faker";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import render from "../../../../tests/render";
import db, { clearDatabase } from "../../../lib/db";
import sleep from "../../../lib/sleep";
import TaskList from "./TaskList";

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await db.destroy();
});

describe("TaskList", () => {
  it("should allow a user to create a task, see it, complete it, and then delete it", async () => {
    const user = userEvent.setup();
    render(<TaskList />);

    const taskTitle = faker.lorem.sentence(3);

    // Find the "add new task" button and click it.
    const addTaskFab = screen.getByRole("button", { name: /add new task/i });
    await user.click(addTaskFab);

    // Get the input and button from the modal.
    const createModal = screen.getByRole("dialog");
    const input = within(createModal).getByRole("textbox", {
      name: /new task/i,
    });
    const submitButton = within(createModal).getByRole("button", {
      name: /add/i,
    });

    // The submit button should be disabled until text is entered.
    expect(submitButton).toBeDisabled();
    await user.type(input, taskTitle);
    expect(submitButton).toBeEnabled();

    // Submit the new task.
    await user.click(submitButton);
    await user.click(
      within(createModal).getByRole("button", {
        name: /close/i,
      })
    );

    // Find the new task in the "pending" list.
    const pendingSection = screen.getByRole("region", { name: /tasks/i });
    const pendingTask = await within(pendingSection).findByText(taskTitle);
    const pendingTaskItem = pendingTask.closest("li")!;
    expect(pendingTaskItem).toBeInTheDocument();

    // Find the complete button within the task item and click it.
    const checkbox = within(pendingTaskItem).getByRole("button", {
      name: new RegExp(`mark "${taskTitle}" as completed`, "i"),
    });
    await user.click(checkbox);

    // Wait for the task to be removed from the pending list.
    await waitFor(() => {
      const newTask = within(pendingSection).queryByText(taskTitle);
      expect(newTask).not.toBeInTheDocument();
    });

    // Verify the task now appears in the "completed" list.
    const completedSection = screen.getByRole("region", { name: /completed/i });
    const completedTask = await within(completedSection).findByText(taskTitle);
    const completedTaskItem = completedTask.closest("li")!;
    expect(completedTaskItem).toBeInTheDocument();

    // Right-click the completed task item to open its context menu.
    await user.pointer({ keys: "[MouseRight]", target: completedTaskItem });

    // Find and click the "delete" option in the context menu.
    const deleteMenuItem = await screen.findByRole("menuitem", {
      name: /delete/i,
    });
    await user.click(deleteMenuItem);

    // Find and click the confirmation button inside a confirmation dialog.
    const deleteModal = await screen.findByRole("dialog", {
      name: /delete task?/i,
    });
    const deleteButton = within(deleteModal).getByRole("button", {
      name: /delete/i,
    });
    await user.click(deleteButton);

    // Wait for the task to be removed from the UI.
    await waitFor(() => {
      const deletedTask = screen.queryByText(taskTitle);
      expect(deletedTask).not.toBeInTheDocument();
    });
  });

  it("should allow a user to update a task's title and completion status from the edit modal", async () => {
    const user = userEvent.setup();
    render(<TaskList />);

    const originalTaskTitle = faker.lorem.sentence(4);
    const updatedTaskTitle = faker.lorem.sentence(4);

    // Create a new task to work with.
    const addTaskFab = screen.getByRole("button", { name: /add new task/i });
    await user.click(addTaskFab);

    const createModal = screen.getByRole("dialog");
    const input = within(createModal).getByRole("textbox", {
      name: /new task/i,
    });
    const submitButton = within(createModal).getByRole("button", {
      name: /add/i,
    });

    await user.type(input, originalTaskTitle);
    await user.click(submitButton);
    await user.click(
      within(createModal).getByRole("button", {
        name: /close/i,
      })
    );

    const pendingSection = screen.getByRole("region", { name: /tasks/i });
    const taskItem = await within(pendingSection).findByText(originalTaskTitle);
    const taskListItem = taskItem.closest("li")!;

    // Open the edit modal by clicking the task.
    const editButton = within(taskListItem).getByRole("button", {
      name: new RegExp(`edit task "${originalTaskTitle}"`, "i"),
    });
    await user.click(editButton);

    const editModal = await screen.findByRole("dialog", {
      name: new RegExp(`edit task "${originalTaskTitle}"`, "i"),
    });

    // Update the task title.
    const titleInput = within(editModal).getByRole("textbox", {
      name: /change the task title/i,
    });
    await user.clear(titleInput);
    await user.type(titleInput, updatedTaskTitle);

    // Close the modal and wait for the debounced update to apply.
    await user.click(
      within(editModal).getByRole("button", {
        name: /close/i,
      })
    );
    const updatedTask =
      await within(pendingSection).findByText(updatedTaskTitle);
    expect(updatedTask).toBeInTheDocument();

    const oldTask = within(pendingSection).queryByText(originalTaskTitle);
    expect(oldTask).not.toBeInTheDocument();

    // Re-open the edit modal and mark the task as completed.
    await user.click(editButton);

    const editModalAgain = await screen.findByRole("dialog", {
      name: new RegExp(`edit task "${updatedTaskTitle}"`, "i"),
    });
    const completeButton = within(editModalAgain).getByRole("button", {
      name: new RegExp(`mark "${updatedTaskTitle}" as completed`, "i"),
    });
    await user.click(completeButton);
    await user.click(
      within(editModalAgain).getByRole("button", {
        name: /close/i,
      })
    );

    // Wait for the task to be removed from the pending list.
    await waitFor(() => {
      const pendingTask = within(pendingSection).queryByText(updatedTaskTitle);
      expect(pendingTask).not.toBeInTheDocument();
    });

    // The task should now be in the "Completed" list.
    const completedSection = screen.getByRole("region", { name: /completed/i });
    const completedTask =
      await within(completedSection).findByText(updatedTaskTitle);
    expect(completedTask).toBeInTheDocument();
  });

  it("should open the correct edit modal for each newly added task", async () => {
    const user = userEvent.setup();
    render(<TaskList />);

    const task1Title = faker.lorem.sentence(4);
    const task2Title = faker.lorem.sentence(4);

    const addTaskFab = screen.getByRole("button", { name: /add new task/i });
    await user.click(addTaskFab);

    const createModal = screen.getByRole("dialog");
    const input = within(createModal).getByRole("textbox", {
      name: /new task/i,
    });
    const submitButton = within(createModal).getByRole("button", {
      name: /add/i,
    });

    // Add the first task
    await user.type(input, task1Title);
    await user.click(submitButton);
    await waitFor(() => {
      expect(input).toHaveValue("");
    });

    // Add the second task
    await user.type(input, task2Title);
    await user.click(submitButton);
    await waitFor(() => {
      expect(input).toHaveValue("");
    });

    // Close create task modal
    await user.click(
      within(createModal).getByRole("button", {
        name: /close/i,
      })
    );

    const pendingSection = screen.getByRole("region", { name: /tasks/i });

    // Open edit task 1
    const task1EditBtn = within(pendingSection).getByRole("button", {
      name: new RegExp(`edit task "${task1Title}"`, "i"),
    });
    await user.click(task1EditBtn);
    const task1Modal = await screen.findByRole("dialog");
    await within(task1Modal).findByDisplayValue(task1Title);
    await user.click(
      within(task1Modal).getByRole("button", {
        name: /close/i,
      })
    );

    // Open edit task 2
    const task2EditBtn = within(pendingSection).getByRole("button", {
      name: new RegExp(`edit task "${task2Title}"`, "i"),
    });
    await user.click(task2EditBtn);
    const task2Modal = await screen.findByRole("dialog");
    await within(task2Modal).findByDisplayValue(task2Title);
    await screen.findByRole("dialog", {
      name: new RegExp(`edit task "${task2Title}"`, "i"),
    });
  });

  it("should maintain focus on the input field after a debounced update", async () => {
    const user = userEvent.setup();
    render(<TaskList />);

    const taskTitle = faker.lorem.sentence(3);

    // Create task
    const addTaskFab = screen.getByRole("button", { name: /add new task/i });
    await user.click(addTaskFab);
    const createModal = screen.getByRole("dialog");
    await user.type(
      within(createModal).getByRole("textbox", { name: /new task/i }),
      taskTitle
    );
    await user.click(within(createModal).getByRole("button", { name: /add/i }));
    await user.click(
      within(createModal).getByRole("button", { name: /close/i })
    );

    // Open edit modal
    const taskItem = await screen.findByText(taskTitle);
    await user.click(
      within(taskItem.closest("li")!).getByRole("button", {
        name: new RegExp(`edit task "${taskTitle}"`, "i"),
      })
    );

    // Update task title
    const editModal = await screen.findByRole("dialog");
    const titleInput = within(editModal).getByRole("textbox", {
      name: /change the task title/i,
    });
    await user.type(titleInput, " - updated");

    await sleep(1_000);

    expect(titleInput).toHaveFocus();
  });
});
