import { faker } from "@faker-js/faker";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import render from "../../../../tests/render";
import TaskList from "./TaskList";

describe("TaskList", () => {
  it("should allow a user to create a task, see it, complete it, and see it moved", async () => {
    const user = userEvent.setup();
    render(<TaskList />);

    const taskTitle = faker.lorem.sentence(3);

    // Find the "add new task" button and click it.
    const addTaskFab = screen.getByRole("button", { name: /add new task/i });
    await user.click(addTaskFab);

    // Get the input and button from the modal.
    const modal = screen.getByRole("dialog");
    const input = within(modal).getByRole("textbox", { name: /new task/i });
    const submitButton = within(modal).getByRole("button", { name: /add/i });

    // The submit button should be disabled until text is entered.
    expect(submitButton).toBeDisabled();
    await user.type(input, taskTitle);
    expect(submitButton).toBeEnabled();

    // Submit the new task.
    await user.click(submitButton);
    await user.keyboard("{Escape}");

    // Find the new task in the "pending" list.
    const pendingSection = screen.getByRole("region", { name: /tasks/i });
    const pendingTask = await within(pendingSection).findByText(taskTitle);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const pendingTaskItem = pendingTask.closest("li")!;
    expect(pendingTaskItem).toBeInTheDocument();

    // Find the complete button within the task item and click it.
    const checkbox = within(pendingTaskItem).getByRole("button");
    await user.click(checkbox);

    // Wait for the task to be removed from the pending list.
    await waitFor(() => {
      const newTask = within(pendingSection).queryByText(taskTitle);
      expect(newTask).not.toBeInTheDocument();
    });

    // Verify the task now appears in the "completed" list.
    const completedSection = screen.getByRole("region", { name: /completed/i });
    const completedTask = await within(completedSection).findByText(taskTitle);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const completedTaskItem = completedTask.closest("li")!;
    expect(completedTaskItem).toBeInTheDocument();
  });
});
