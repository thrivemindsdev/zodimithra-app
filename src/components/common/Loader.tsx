import { LoaderCircle } from "lucide-react";
import { memo } from "react";

const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoaderCircle className="animate-spin text-primary" size={40} />
    </div>
  );
};

export default memo(Loader);
