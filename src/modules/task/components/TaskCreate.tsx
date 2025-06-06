import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Button from "../../../components/Button";
import InputText from "../../../components/InputText";
import useTaskCreate from "../hooks/useTaskCreate";
import type Task from "../types/Task";

interface FormInput {
  title: string;
}

interface TaskCreateProps {
  onCreate: (task: Task) => void;
}

export default function TaskCreate({ onCreate }: TaskCreateProps) {
  const { t } = useTranslation();

  const { register, handleSubmit, watch, reset } = useForm<FormInput>();

  const taskCreateMutation = useTaskCreate({
    onSuccess(data) {
      onCreate(data);
      reset();
    },
    onError: console.error,
  });

  const onSubmit = (data: FormInput) => {
    taskCreateMutation.mutate(data);
  };

  const isButtonDisabled = watch("title", "").trim() === "";

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputText
        id="task-title"
        label={t("taskLabel")}
        placeholder={t("taskPlaceholder")}
        autoFocus
        autoComplete="off"
        {...register("title")}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isButtonDisabled}>
          <Plus className="w-5 h-5 mr-2" strokeWidth={1.5} />
          {t("addTaskButton")}
        </Button>
      </div>
    </form>
  );
}
