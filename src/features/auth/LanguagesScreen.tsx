import ToastModal from "@/components/common/ToastModal";
import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useToastModal } from "@/hooks/useToastModal";
import { Check, Circle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export interface Language {
  id: string;
  nativeChar: string;
  name: string;
  subtitle?: string;
  layout: "full" | "grid";
}

export const LANGUAGES: Language[] = [
  {
    id: "en",
    nativeChar: "A",
    name: "English",
    subtitle: "Global - Universal",
    layout: "full",
  },
  { id: "hi", nativeChar: "अ", name: "हिन्दी", layout: "grid" },
  { id: "bn", nativeChar: "অ", name: "বাংলা", layout: "grid" },
  { id: "te", nativeChar: "అ", name: "తెలుగు", layout: "grid" },
  { id: "ml", nativeChar: "അ", name: "മലയാളം", layout: "grid" },
  { id: "ta", nativeChar: "அ", name: "தமிழ்", layout: "grid" },
  { id: "gu", nativeChar: "અ", name: "ગુજરાતી", layout: "grid" },
];

export default function LanguageScreen() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const activeLanguage = i18n.language ?? "en";
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>(activeLanguage);
  const { toastState, showSuccess, hideToast } = useToastModal();

  const fullWidthLang = LANGUAGES.find((lang) => lang.layout === "full");
  const gridLangs = LANGUAGES.filter((lang) => lang.layout === "grid");

  const handleLanguageSelect = async (id: string) => {
    await i18n.changeLanguage(id);
    setSelectedLanguage(id);
    showSuccess(
      t("language.changedSuccess", "Language Changed Successfully"),
      t("language.changedDesc", "Your language has been changed successfully!"),
      t("common.continue", "Continue"),
      () => {
        navigate("/home");
      },
    );
  };

  return (
    <main className="p-4 overflow-hidden h-screen">
      <Header title={t("language.title", "Your Language")} showBackButton />
      <BodyLayout>
        <div className="flex justify-center items-center font-body">
          <div className="w-full max-w-md bg-white rounded-4xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {t("language.title", "Your Language")}
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-medium tracking-wide">
                {t(
                  "language.subTitle",
                  "Let's personalize your cosmic journey",
                )}
              </p>
            </div>

            <div className="space-y-4">
              {fullWidthLang && (
                <button
                  onClick={() => handleLanguageSelect(fullWidthLang.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left ${
                    selectedLanguage === fullWidthLang.id
                      ? "border-primary bg-purple-50/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-serif text-gray-900 w-8 text-center">
                      {fullWidthLang.nativeChar}
                    </span>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 font-serif">
                        {fullWidthLang.name}
                      </h4>
                      <p className="text-xs text-gray-500 font-serif mt-0.5">
                        {fullWidthLang.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center w-5 h-5">
                    {selectedLanguage === fullWidthLang.id ? (
                      <Check className="h-5 w-5 text-primary stroke-3" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-300" />
                    )}
                  </div>
                </button>
              )}

              <div className="grid grid-cols-2 gap-4">
                {gridLangs.map((lang) => {
                  const isSelected = selectedLanguage === lang.id;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageSelect(lang.id)}
                      className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-200 aspect-4/3 ${
                        isSelected
                          ? "border-primary bg-purple-50/10"
                          : "border-gray-100 bg-amber-50/5 hover:border-gray-200"
                      }`}
                    >
                      <span className="text-3xl font-normal text-gray-900 mb-1">
                        {lang.nativeChar}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {lang.name}
                      </span>

                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <Check className="h-4 w-4 text-primary stroke-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <ToastModal
            isOpen={toastState.isOpen}
            status={toastState.status}
            title={toastState.title}
            description={toastState.description}
            buttonText={toastState.buttonText}
            onDone={hideToast}
          />
        </div>
      </BodyLayout>
    </main>
  );
}
