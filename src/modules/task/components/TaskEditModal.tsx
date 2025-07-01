import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CheckboxButton from "../../../components/CheckboxButton";
import InputText from "../../../components/InputText";
import Modal from "../../../components/Modal";
import debounce from "../../../lib/debounce";
import useTaskToggleCompletion from "../hooks/useTaskToggleCompletion";
import useTaskUpdate from "../hooks/useTaskUpdate";
import type Task from "../types/Task";

interface FormValue {
  title?: string | undefined;
}

interface TaskEditModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdate: (updatedTask: Task) => void;
}

export default function TaskEditModal({
  task,
  isOpen,
  onClose,
  onTaskUpdate,
}: TaskEditModalProps) {
  const { t } = useTranslation();

  const { register, watch, reset } = useForm({
    defaultValues: {
      title: task.title,
    },
  });

  const taskUpdateMutation = useTaskUpdate({
    onSuccess: onTaskUpdate,
    onError: console.error,
  });

  const { toggleCompletion } = useTaskToggleCompletion({
    onSuccess: onTaskUpdate,
    onError: console.error,
  });

  const handleToggleTask = () => {
    toggleCompletion(task);
  };

  useEffect(() => {
    reset({
      title: task.title,
    });
  }, [task, reset]);

  const taskUpdateMutationMutate = taskUpdateMutation.mutate;

  useEffect(() => {
    const debouncedCb = debounce((formValue: FormValue) => {
      const debouncedTitle = formValue.title;

      if (debouncedTitle?.trim() && debouncedTitle !== task.title) {
        taskUpdateMutationMutate({ ...task, title: debouncedTitle });
      }
    }, 500);

    const subscription = watch(debouncedCb);

    return () => {
      subscription.unsubscribe();
    };
  }, [task, taskUpdateMutationMutate, watch]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} aria-labelledby="edit-task-title">
      <h2 id="edit-task-title" className="sr-only">
        {t("editTask", { taskTitle: task.title })}
      </h2>

      <div className="flex items-center mb-4">
        <CheckboxButton
          isChecked={!!task.completedAt}
          onClick={handleToggleTask}
          aria-label={t(
            task.completedAt ? "toggleTaskPending" : "toggleTaskCompleted",
            { taskTitle: task.title }
          )}
        />
        <span className="text-lg font-bold text-gray-900 ml-3">
          {t("tasksTitle")}
        </span>
      </div>

      <InputText
        id="edit-task-title-input"
        label={t("taskTitleLabel")}
        placeholder={t("taskTitleLabel")}
        labelVisible={false}
        autoComplete="off"
        {...register("title")}
      />

      <div className="mt-4 text-sm text-gray-500">
        {t("createdAt")}:{" "}
        {new Date(task.createdAt).toLocaleString(undefined, {
          dateStyle: "long",
          timeStyle: "short",
        })}
      </div>

      {/* <div className="mt-6 flex justify-end">
          <Button
            color="danger"
            variant="outline"
            onClick={handleDeleteFromEditModal}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t("delete")}
          </Button>
        </div> */}
    </Modal>
  );
}
