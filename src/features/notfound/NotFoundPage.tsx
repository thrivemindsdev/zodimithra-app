import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-[70vh] flex-col items-center justify-center text-center"
    >
      <AlertCircle
        size={64}
        className="mb-4 text-red-500"
      />

      <h1 className="text-6xl font-bold">
        404
      </h1>

      <h2 className="mt-2 text-2xl font-semibold">
        Page Not Found
      </h2>

      <p className="mt-2 max-w-md text-gray-500">
        Sorry, the page you are looking for does not
        exist or has been moved.
      </p>

      <Link
        to="/home"
        className="mt-6 flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-white hover:opacity-90"
      >
        <Home size={18} />
        Back to Home
      </Link>
    </motion.div>
  );
};

export default NotFoundPage;