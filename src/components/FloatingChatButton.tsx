import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const FloatingChatButton = () => {
  const controls = useAnimation();

  useEffect(() => {
    let isMounted = true;

    const animate = async () => {
      if (!isMounted) return;
      
      await controls.start({
        y: [-5, 5, -5],
        transition: {
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        },
      });
    };

    animate();

    return () => {
      isMounted = false;
      controls.stop();
    };
  }, [controls]);

  return (
    <motion.div
      animate={controls}
      className="fixed bottom-20 right-8 z-[60]"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <a
        href="https://t.me/kptchat_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center"
      >
        {/* Pulsing background effect */}
        <span className="absolute animate-ping h-full w-full rounded-full bg-primary-400 opacity-20"></span>
        <span className="absolute h-full w-full rounded-full bg-primary-500 opacity-40"></span>
        
        {/* Main button */}
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <MessageCircle className="h-7 w-7 text-white" />
        </span>
      </a>
    </motion.div>
  );
};

export default FloatingChatButton;