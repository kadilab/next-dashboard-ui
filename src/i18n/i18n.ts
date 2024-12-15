import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend) // Load translations from files
  .use(LanguageDetector) // Automatically detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    fallbackLng: "en", // Fallback language
    supportedLngs: ["en", "fr", "es"], // Supported languages
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Translation file path
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    debug: false, // Enable this for debugging
  });

export default i18n;
