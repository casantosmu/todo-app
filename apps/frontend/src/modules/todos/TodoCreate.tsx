import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button";
import InputText from "../../components/InputText";
import { useTodoCreate } from "./api";
import type { Todo } from "./types";

interface FormInput {
  name: string;
}

interface TodoCreateProps {
  onCreate: (todo: Todo) => void;
}

export default function TodoCreate({ onCreate }: TodoCreateProps) {
  const { t } = useTranslation();

  const todoCreateMutation = useTodoCreate({
    onSuccess: onCreate,
    onError() {
      console.error("error");
    },
  });

  const { register, handleSubmit, watch } = useForm<FormInput>();

  const onSubmit = (data: FormInput) => {
    todoCreateMutation.mutate(data);
  };

  const isButtonDisabled = watch("name", "").trim() === "";

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputText
        id="task-name"
        label={t("taskLabel")}
        placeholder={t("taskPlaceholder")}
        autoFocus
        autoComplete="off"
        {...register("name")}
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
