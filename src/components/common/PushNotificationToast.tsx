import { type NotificationPayload } from "@/services/pushNotification.service";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React from "react";

interface PushNotificationToastProps {
  notification: NotificationPayload | null;
  onClose: () => void;
  onClick?: () => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  notification,
  onClose,
  onClick,
}) => {
  if (!notification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md cursor-pointer"
        onClick={onClick}
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-800 dark:text-gray-100 p-4 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 flex items-start gap-3">
          <div className="p-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl shrink-0 overflow-hidden w-10 h-10 flex items-center justify-center">
            <img
              src="/ic_launcher.png"
              alt="ZodiMithra icon"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <h4 className="font-semibold text-sm truncate leading-tight">
              {notification.title || "New Notification"}
            </h4>
            {notification.body && (
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 leading-snug">
                {notification.body}
              </p>
            )}
            {notification.image && (
              <img
                src={notification.image}
                alt="Notification banner"
                className="mt-2 rounded-lg max-h-32 w-full object-cover border border-gray-100 dark:border-gray-800"
              />
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
