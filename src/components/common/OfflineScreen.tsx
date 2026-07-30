import React from "react";
import { WifiOff, RefreshCw, AlertCircle } from "lucide-react";

interface OfflineScreenProps {
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const OfflineScreen: React.FC<OfflineScreenProps> = ({
  onRetry,
  isRetrying = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon Container */}
        <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 shadow-inner relative">
          <WifiOff className="w-10 h-10 animate-pulse" />
          <div className="absolute -bottom-1 -right-1 p-1 bg-red-500/20 rounded-full border border-red-500/30 text-red-400">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white tracking-tight">
          No Internet Connection
        </h2>

        {/* Message */}
        <p className="text-sm text-slate-400 mt-2.5 leading-relaxed">
          Please check your Wi-Fi or mobile data network and try again to continue using ZodiMithra.
        </p>

        {/* Status Indicator */}
        <div className="w-full bg-slate-800/40 border border-slate-800 rounded-2xl p-3 my-5 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span>Waiting for network connectivity...</span>
        </div>

        {/* Action Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 active:scale-[0.98] text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
            {isRetrying ? "Checking Connection..." : "Retry Connection"}
          </button>
        )}
      </div>
    </div>
  );
};

export default OfflineScreen;
