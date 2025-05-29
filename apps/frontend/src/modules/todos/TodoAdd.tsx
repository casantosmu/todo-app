import { Plus } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button";
import InputText from "../../components/InputText";

export default function TodoAdd() {
  const { t } = useTranslation();
  const [taskName, setTaskName] = useState("");

  const handleTaskNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTaskName(event.target.value);
  };

  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("SUBMIT!! Task: ", taskName);
  };

  const isButtonDisabled = taskName.trim() === "";

  return (
    <form onSubmit={handleOnSubmit} className="space-y-4">
      <InputText
        id="task-name"
        label={t("taskLabel")}
        placeholder={t("taskPlaceholder")}
        autoFocus
        value={taskName}
        onChange={handleTaskNameChange}
        autoComplete="off"
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
