import { useTranslation } from "react-i18next";
import InputText from "../../components/InputText";

export default function TodoAddInput() {
  const { t } = useTranslation();

  return (
    <InputText
      id="task-name"
      label={t("taskLabel")}
      placeholder={t("taskPlaceholder")}
      autoFocus
    />
  );
}
