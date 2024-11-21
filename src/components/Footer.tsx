import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, Linkedin, Twitter, 
  Send, Code, Star, Zap, 
  Award, Rocket, Globe, 
  Cpu, MessageCircle, ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function UltimatePortfolioFooter() {
  const [activeInteraction, setActiveInteraction] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Intersection Observer
  const [footerRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Starry Background Particles
  const generateStars = () => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * 300,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      delay: Math.random() * 2
    }));
  };

  const [stars, setStars] = useState(generateStars());

  // Social and Interaction Links
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

  const interactionSections = [
    { 
      icon: Rocket, 
      href: "#projects",
      title: "Projects", 
      description: "Innovative tech solutions showcasing creative problem-solving",
      gradient: "from-purple-600 to-indigo-500"
    },
    { 
      icon: Award, 
      title: "Achievements", 
      description: "Recognized milestones and professional accomplishments",
      gradient: "from-green-500 to-emerald-400"
    },
    { 
      icon: Globe, 
      title: "Expertise", 
      description: "Cutting-edge technologies and specialized skills",
      gradient: "from-pink-500 to-red-500"
    }
  ];

  // Interactive cursor effect
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePosition({ x: clientX, y: clientY });
    cursorX.set(clientX);
    cursorY.set(clientY);
  };

  return (
    <footer 
      ref={footerRef}
      onMouseMove={handleMouseMove}
      className="relative bg-black text-white overflow-hidden py-16"
    >
      {/* Starry Background */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ 
              x: star.x, 
              y: -50,
              opacity: 0
            }}
            animate={{ 
              y: star.y,
              opacity: [0, star.opacity, 0],
              transition: { 
                duration: 3, 
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
              backgroundColor: 'rgba(255,255,255,0.7)'
            }}
          />
        ))}
      </div>

      {/* Interactive Cursor Glow */}
      <motion.div 
        style={{
          position: 'fixed',
          top: -50,
          left: -50,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none',
          zIndex: 50,
          x: cursorX,
          y: cursorY
        }}
      />

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
              className="text-4xl font-bold tracking-wide 
              bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 
              bg-clip-text text-transparent"
            >
              Ayush Upadhyay
            </motion.h2>
            <p className="text-gray-400 mt-2 text-sm tracking-wider">
              Digital Innovator | Full Stack Developer | Tech Enthusiast
            </p>
          </div>

          {/* Social Links */}
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
                  rotate: Math.random() * 10 - 5
                }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setActiveInteraction(social.name)}
                onHoverEnd={() => setActiveInteraction(null)}
              >
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-r ${social.gradient} 
                    rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-500`}
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1.2 }}
                />
                <social.icon 
                  className="relative z-10 w-8 h-8 text-gray-300 group-hover:text-white"
                />
                
                <AnimatePresence>
                  {activeInteraction === social.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute -bottom-16 left-1/2 -translate-x-1/2 
                        bg-black/80 text-white text-xs px-3 py-2 rounded-md 
                        shadow-lg border border-white/10 w-48 text-center"
                    >
                      {social.description}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Interactive Sections */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {interactionSections.map((section) => (
            <motion.div
              key={section.title}
              className="bg-white/5 rounded-xl p-6 border border-white/10 
              hover:border-blue-500/50 transition-all group cursor-pointer overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 10px 25px rgba(0,0,255,0.2)'
              }}
              onHoverStart={() => setActiveInteraction(section.title)}
              onHoverEnd={() => setActiveInteraction(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className={`p-3 rounded-full bg-gradient-to-r ${section.gradient} 
                    group-hover:rotate-12 transition-transform`}
                  >
                    <section.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                </div>
                <motion.div
                  whileHover={{ rotate: 90 }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ArrowRight className="w-6 h-6 text-blue-500" />
                </motion.div>
              </div>
              
              <AnimatePresence>
                {activeInteraction === section.title && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-gray-400 text-sm mt-4 overflow-hidden"
                  >
                    {section.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact and Final Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center space-x-3 
            bg-white/10 px-6 py-3 rounded-full 
            hover:bg-blue-500/20 transition-all cursor-pointer"
          >
            <Send className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300 font-medium">Get in Touch</span>
          </motion.div>
          
          <p className="text-gray-500 text-sm mt-4">
            © 2024 Ayush Upadhyay. All rights reserved. 
            Designed with passion and precision.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}