import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ca from "../i18n/ca/translation.json";
import en from "../i18n/en/translation.json";
import es from "../i18n/es/translation.json";
import config from "./config";

i18n
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    debug: config.env.isDev,
    resources: {
      en: { translation: en },
      ca: { translation: ca },
      es: { translation: es },
    },
    interpolation: {
      escapeValue: false,
    },
  })
  .catch(console.error);
