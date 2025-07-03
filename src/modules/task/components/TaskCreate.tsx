import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Button from "../../../components/Button";
import InputText from "../../../components/InputText";
import useTaskCreate from "../hooks/useTaskCreate";

interface FormInput {
  title: string;
}

export default function TaskCreate() {
  const { t } = useTranslation();

  const { register, handleSubmit, watch, reset } = useForm<FormInput>({
    defaultValues: {
      title: "",
    },
  });

  const taskCreateMutation = useTaskCreate({
    onSuccess() {
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
          <Plus className="mr-2 h-5 w-5" strokeWidth={1.5} />
          {t("addTaskButton")}
        </Button>
      </div>
    </form>
  );
}
