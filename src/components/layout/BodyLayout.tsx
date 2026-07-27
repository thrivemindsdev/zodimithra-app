import { memo, type ReactNode } from "react";

const BodyLayout = ({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <main
      className={`pb-25 h-[calc(100vh-100px)] overflow-y-auto ${className}`}
    >
      {children}
    </main>
  );
};

export default memo(BodyLayout);
