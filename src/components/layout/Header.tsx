import { ChevronLeft, MessageSquareText, Wallet } from "lucide-react";
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  RightIcon?: boolean;
  walletAmount?: number;
  onWalletClick?: () => void;
  onChatClick?: () => void;
  redirectPath?: string;
}

const Header = ({
  title,
  subtitle = "",
  showBackButton = false,
  RightIcon = false,
  walletAmount = 0,
  onWalletClick,
  onChatClick,
  redirectPath,
}: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    if (redirectPath) {
      navigate(redirectPath);
    } else {
      navigate(-1);
    }
  }, [navigate, redirectPath]);

  return (
    <header className="flex items-center justify-between bg-white pb-4">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <button
            type="button"
            onClick={handleBack}
            className="text-secondary -ml-2"
            aria-label="Go back"
          >
            <ChevronLeft size={28} strokeWidth={2} />
          </button>
        )}

        <div>
          <h2 className="text-gradient font-header text-xl font-light">
            {title}
          </h2>

          {subtitle && (
            <p className="text-sm text-text-secondary font-body">{subtitle}</p>
          )}
        </div>
      </div>

      {RightIcon && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onWalletClick}
            className="flex items-center gap-2 rounded-full border border-primary px-2 py-1"
          >
            <Wallet size={16} className="text-indigo-900" />

            <span className="text-sm font-body-content font-medium text-primary">
              ₹{walletAmount}
            </span>
          </button>

          <button type="button" onClick={onChatClick} aria-label="Open chat">
            <MessageSquareText size={24} className="text-indigo-900" />
          </button>
        </div>
      )}
    </header>
  );
};

export default memo(Header);
