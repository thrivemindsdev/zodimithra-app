import { memo, type ReactNode } from "react";

const BodyLayout = ({ children }: { children?: ReactNode }) => {
  return <main className="pb-25 h-[calc(100vh-100px)] overflow-y-auto">{children}</main>;
};

export default memo(BodyLayout);
