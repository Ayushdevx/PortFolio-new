import React, { useState, useEffect } from 'react';
import { 
  Github, Linkedin, Twitter, 
  Send, ExternalLink, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function UltimatePortfolioFooter() {
  const [activeInteraction, setActiveInteraction] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringCta, setIsHoveringCta] = useState(false);

  // Intersection Observer
  const [footerRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Enhanced Starry Background
  const generateStars = () => {
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * 300,
      size: Math.random() * 3 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2
    }));
  };

  const [stars, setStars] = useState(generateStars());

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/Ayushdevx",
      name: "GitHub",
      gradient: "from-gray-800 to-gray-600",
      description: "Code Repositories"
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/Ayushdevai",
      name: "LinkedIn",
      gradient: "from-blue-600 to-blue-400",
      description: "Professional Network"
    },
    {
      icon: Twitter,
      href: "https://x.com/AyushXGentleman?t=9Ml-G13s6PIyUnjS5sDtQw&s=09",
      name: "Twitter",
      gradient: "from-cyan-500 to-blue-500",
      description: "Digital Insights"
    }
  ];

  // Floating animation for CTA button
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Sparkle positions for CTA button
  const sparklePositions = [
    { x: -20, y: -20 },
    { x: 20, y: -20 },
    { x: -20, y: 20 },
    { x: 20, y: 20 }
  ];

  return (
    <footer 
      ref={footerRef}
      className="relative bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden py-16"
    >
      {/* Enhanced Starry Background */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ 
              x: star.x, 
              y: -50,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              y: star.y,
              opacity: [0, star.opacity, 0],
              scale: [0, 1, 0],
              transition: { 
                duration: star.duration, 
                delay: star.delay,
                repeat: Infinity,
                repeatType: 'reverse'
              }
            }}
            style={{
              position: 'absolute',
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)'
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0"
        >
          {/* Branding Section */}
          <div className="text-center md:text-left">
            <motion.h2 
              initial={{ x: -100, opacity: 0 }}
              animate={inView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold tracking-wide"
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Ayush Upadhyay
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 mt-2 text-sm tracking-wider"
            >
              Digital Innovator | Full Stack Developer | Tech Enthusiast
            </motion.p>
          </div>

          {/* Enhanced Social Links */}
          <div className="flex space-x-6">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group"
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -10, 10, -10, 0],
                  transition: {
                    rotate: {
                      duration: 0.5,
                      ease: "easeInOut"
                    }
                  }
                }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setActiveInteraction(social.name)}
                onHoverEnd={() => setActiveInteraction(null)}
              >
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-r ${social.gradient} 
                    rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-500`}
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1.5 }}
                />
                <social.icon 
                  className="relative z-10 w-8 h-8 text-gray-300 group-hover:text-white 
                    transition-colors duration-300"
                />
                
                <AnimatePresence>
                  {activeInteraction === social.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.8 }}
                      className="absolute -bottom-16 left-1/2 -translate-x-1/2 
                        bg-black/90 text-white text-xs px-4 py-2 rounded-lg 
                        shadow-lg border border-white/20 w-48 text-center
                        backdrop-blur-sm"
                    >
                      {social.description}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 
                        border-l-8 border-r-8 border-b-8 
                        border-transparent border-b-black/90" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Get in Touch Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <motion.a
            href="https://ayushupadhyay.carrd.co"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block"
            onMouseEnter={() => setIsHoveringCta(true)}
            onMouseLeave={() => setIsHoveringCta(false)}
            animate={floatingAnimation}
          >
            <motion.div
              className="relative flex items-center space-x-3 
                bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
                px-8 py-4 rounded-full cursor-pointer
                shadow-lg shadow-blue-500/20 group
                hover:shadow-xl hover:shadow-blue-500/30 
                transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-white font-medium">Get in Touch</span>
              <ExternalLink className="w-4 h-4 text-white/70 ml-2 group-hover:translate-x-1 
                transition-transform duration-300" />
              
              {/* Sparkle Effects */}
              <AnimatePresence>
                {isHoveringCta && sparklePositions.map((pos, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [pos.x, pos.x * 1.5],
                      y: [pos.y, pos.y * 1.5]
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.75, delay: index * 0.1 }}
                    className="absolute"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.a>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-500 text-sm mt-8"
          >
            © 2024 Ayush Upadhyay. All rights reserved. 
            <br />
            <span className="text-gray-600">Crafted with passion and precision</span>
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}
