'use client';

import { motion } from 'framer-motion';
import LandingPage from '../app/components/landingpage/landingpage';

export default function LandingPageRoute() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: 'easeInOut' }}
    >
      <LandingPage />
    </motion.div>
  );
}