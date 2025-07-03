import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CheckboxButton from "../../../components/CheckboxButton";
import InputText from "../../../components/InputText";
import debounce from "../../../lib/debounce";
import useTaskToggleCompletion from "../hooks/useTaskToggleCompletion";
import useTaskUpdate from "../hooks/useTaskUpdate";
import type Task from "../types/Task";

interface FormValue {
  title?: string | undefined;
}

interface TaskEditModalProps {
  task: Task;
  onTaskUpdate: (updatedTask: Task) => void;
}

export default function TaskEdit({ task, onTaskUpdate }: TaskEditModalProps) {
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
    <>
      <div className="mb-4 flex items-center">
        <CheckboxButton
          isChecked={!!task.completedAt}
          onClick={handleToggleTask}
          aria-label={t(
            task.completedAt ? "toggleTaskPending" : "toggleTaskCompleted",
            { taskTitle: task.title },
          )}
        />
        <span className="ml-3 text-lg font-bold text-gray-900">
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
    </>
  );
}
