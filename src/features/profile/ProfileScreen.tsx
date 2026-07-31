import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useGetUserDetailsQuery } from "@/queries/userQueries";
import { useAuthStore } from "@/store/authStore";
import {
  Bell,
  ChevronRight,
  Crown,
  Globe,
  History,
  LogOut,
  Trash2,
  Wallet,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LANGUAGES } from "../auth/LanguagesScreen";
import { Capacitor } from "@capacitor/core";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  onClick?: () => void;
  danger?: boolean;
}

// Reusable Menu Item Component
const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  badge,
  onClick,
  danger = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between py-4 border-b border-gray-200 last:border-0 hover:bg-gray-50/50 transition-colors text-left group`}
    >
      <div className="flex items-center gap-4">
        <div className={danger ? "text-red-600" : "text-primary"}>{icon}</div>
        <span
          className={`font-medium text-sm font-body ${danger ? "text-red-600" : "text-text-primary"}`}
        >
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {badge && (
          <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
        {!badge && !danger && (
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
        )}
      </div>
    </button>
  );
};

const ProfileScreen = () => {
  const { t, i18n } = useTranslation();
  const selectedLanguae = i18n.language ?? "en";
  // Find the language object matching the active i18n language code
  const currentLangObj = LANGUAGES.find((lang) => lang.id === selectedLanguae);

  // Get the display name, fallback to "English" if not found
  const currentLanguageName = currentLangObj ? currentLangObj.name : "English";
  const navigate = useNavigate();
  const { data: userDetails } = useGetUserDetailsQuery();
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;

    await logout();
    navigate("/login", { replace: true });
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "WARNING: Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      console.log("Account deleted");
    }
  };

  return (
    <>
      <Header title={t("profile.title")} showBackButton redirectPath="/home" />
      <BodyLayout>
        <>
          {/* Header Profile Section */}
          <div
            onClick={() => navigate("/edit-profile")}
            className="flex items-center justify-between p-4 border-b border-gray-200 group cursor-pointer hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-32 sm:h-32 rounded-full border-2 border-gray-200 overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center">
                {userDetails?.image_url ? (
                  <img
                    src={userDetails?.image_url}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 font-extrabold text-gray-700 text-lg">
                    {userDetails?.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-body uppercase font-bold text-primary">
                  {userDetails?.name}
                </h2>
                <p className="text-sm font-body text-text-secondary">
                  {phoneNumber}
                </p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Main Options List */}
          <div className="px-4">
            <MenuItem
              icon={<Bell className="w-6 h-6" />}
              label={t("profile.notification")}
            />
            <MenuItem
              icon={<Wallet className="w-6 h-6" />}
              label={t("profile.wallet")}
            />
            <MenuItem
              icon={<History className="w-6 h-6" />}
              label={t("profile.orderHistory")}
            />
            {Capacitor.getPlatform() !== "ios" &&
              <MenuItem
                icon={<Crown className="w-6 h-6" />}
                label={t("profile.subscription")}
                badge="Free Plan"
                onClick={() => navigate("/premium")}
              />
            }
            <MenuItem
              icon={<Globe className="w-6 h-6" />}
              label={t("profile.changeLanguage")}
              badge={currentLanguageName}
              onClick={() => navigate("/languages")}
            />

            <MenuItem
              icon={<LogOut className="w-6 h-6 text-red-600" />}
              label={t("profile.logout")}
              danger
              onClick={handleLogout}
            />
            <MenuItem
              icon={<Trash2 className="w-6 h-6 text-red-600" />}
              label={t("profile.deleteAccount")}
              danger
              onClick={handleDeleteAccount}
            />
          </div>
        </>
      </BodyLayout>
    </>
  );
};

export default ProfileScreen;
