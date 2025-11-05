import { motion } from 'framer-motion';
import TeamCollaboration from '../components/TeamCollaboration';

export default function Team() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <TeamCollaboration />
      </motion.div>
    </div>
  );
}
