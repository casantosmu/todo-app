import { useTranslation } from "react-i18next";

export default function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng).catch(console.error);
  };

  return (
    <>
      <h1>{t("welcomeMessage")}</h1>
      <div>
        <button
          type="button"
          onClick={() => {
            changeLanguage("en");
          }}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => {
            changeLanguage("es");
          }}
        >
          Español
        </button>
      </div>
    </>
  );
}
