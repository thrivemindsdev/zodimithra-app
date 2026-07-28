import { ENV } from "@/config/env";
import { openAppStore } from "@/utils/playStore";
import { Download, RefreshCw, ShieldCheck } from "lucide-react";
import React from "react";

interface UpdateModalProps {
  appName: string;
  currentVersion: string;
  currentBuild: string;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  appName,
  currentVersion,
  currentBuild,
}) => {
  const storeName = ENV.IS_IOS ? "Apple App Store" : "Google Play Store";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Background Accent Glows */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 shadow-inner">
          <Download className="w-8 h-8 animate-bounce" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white tracking-tight">
          Update Available
        </h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          A new version of{" "}
          <span className="text-slate-200 font-medium">{appName}</span> is
          required to continue.
        </p>

        {/* Version Comparison */}
        <div className="w-full bg-slate-800/50 border border-slate-800 rounded-2xl p-3 my-5 flex justify-around items-center text-xs">
          <div className="flex flex-col items-center">
            <span className="text-slate-500 font-medium mb-0.5">Installed</span>
            <span className="text-slate-300 font-semibold">
              v{currentVersion} ({currentBuild})
            </span>
          </div>
          <div className="h-6 w-px bg-slate-700/50" />
          <div className="flex flex-col items-center">
            <span className="text-emerald-500 font-medium mb-0.5">
              Required
            </span>
            <span className="text-emerald-400 font-semibold">
              v{ENV.TARGET_VERSION} ({ENV.TARGET_BUILD})
            </span>
          </div>
        </div>

        {/* Dynamic Verification Badge */}
        <div className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Official release verified by {storeName}</span>
        </div>

        {/* Action Button */}
        <button
          onClick={openAppStore}
          className="w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Update on {ENV.IS_IOS ? "App Store" : "Play Store"}
        </button>
      </div>
    </div>
  );
};
