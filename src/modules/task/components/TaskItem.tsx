import * as ContextMenu from "@radix-ui/react-context-menu";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../components/Button";
import CheckboxButton from "../../../components/CheckboxButton";
import Modal from "../../../components/Modal";
import useTaskDelete from "../hooks/useTaskDelete";
import useTaskToggleCompletion from "../hooks/useTaskToggleCompletion";
import type Task from "../types/Task";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onEdit }: TaskItemProps) {
  const { t } = useTranslation();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const { toggleCompletion } = useTaskToggleCompletion({
    onError: console.error,
  });

  const taskDeleteMutation = useTaskDelete({
    onError: console.error,
  });

  const handleToggleTask = () => {
    toggleCompletion(task);
  };

  const handleConfirmDelete = () => {
    taskDeleteMutation.mutate(task);
    setDeleteModalOpen(false);
  };

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleOnEdit = () => {
    onEdit(task);
  };

  return (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
          <li className="relative flex w-full items-center rounded-lg border border-gray-200 bg-white p-4">
            <CheckboxButton
              isChecked={!!task.completedAt}
              onClick={handleToggleTask}
              className="z-1"
              aria-label={t(
                task.completedAt ? "toggleTaskPending" : "toggleTaskCompleted",
                { taskTitle: task.title },
              )}
            />

            <span
              className={`pl-3 ${
                task.completedAt
                  ? "text-gray-500 line-through"
                  : "text-gray-800"
              }`}
            >
              {task.title}
            </span>

            <button
              type="button"
              onClick={handleOnEdit}
              className="absolute inset-0 cursor-pointer rounded-lg border-none bg-transparent focus:ring-2 focus:ring-gray-500 focus:outline-none"
              aria-label={t("editTask", { taskTitle: task.title })}
            />
          </li>
        </ContextMenu.Trigger>

        <ContextMenu.Portal>
          <ContextMenu.Content
            onCloseAutoFocus={(event) => {
              event.preventDefault();
            }}
            className="z-30 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
          >
            <ContextMenu.Item
              className="flex cursor-pointer items-center px-4 py-2 text-sm text-red-500 select-none data-[highlighted]:bg-red-50 data-[highlighted]:outline-none"
              onSelect={openDeleteModal}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("delete")}
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        aria-labelledby="delete-task-title"
      >
        <h2 id="delete-task-title" className="text-lg font-bold text-gray-900">
          {t("deleteConfirmationTitle")}
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          {t("deleteConfirmationMessage", { taskTitle: task.title })}
        </p>

        <div className="mt-6 flex justify-end space-x-3">
          <Button color="secondary" onClick={closeDeleteModal}>
            {t("cancel")}
          </Button>

          <Button color="danger" onClick={handleConfirmDelete}>
            {t("delete")}
          </Button>
        </div>
      </Modal>
    </>
  );
}
