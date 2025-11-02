import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500"></div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
