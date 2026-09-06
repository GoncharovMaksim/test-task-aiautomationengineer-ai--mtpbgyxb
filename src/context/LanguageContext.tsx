"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations, TranslationKey } from "../i18n/translations";
import { Game } from "../domain/entities/Game";
import { localizeGame } from "../i18n/localizeGame";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  localize: (game: Game) => Game;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("ru");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("metacritic_lang") as Language;
    if (saved === "ru" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("metacritic_lang", lang);
    }
  };

  const toggleLanguage = () => {
    const next = language === "ru" ? "en" : "ru";
    setLanguage(next);
  };

  const t = (key: TranslationKey): string => {
    const langDict = translations[language] || translations.ru;
    return langDict[key] || translations.en[key] || key;
  };

  const localize = (game: Game): Game => {
    return localizeGame(game, language);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        localize,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
