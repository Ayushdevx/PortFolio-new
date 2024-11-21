import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated, to } from '@react-spring/web';

interface SkillCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  progress?: number;
  tags?: string[];
  linkUrl?: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  experience?: number; // Years of experience
}

const GlowingBorder = ({ color }: { color: string }) => (
  <div className="absolute inset-0 rounded-xl">
    <div className="absolute inset-[-2px] rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-border-flow" />
    <div className={`absolute inset-[-1px] rounded-xl ${color} opacity-30 blur-md`} />
  </div>
);

const FloatingParticles = ({ color }: { color: string }) => (
  <div className="absolute inset-0 overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute w-1 h-1 rounded-full ${color} opacity-30`}
        animate={{
          y: [-20, -100],
          x: Math.sin(i) * 20,
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
      />
    ))}
  </div>
);

const ProgressRing = ({ progress, color }: { progress: number; color: string }) => {
  const radius = 30;
  const strokeWidth = 4;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <motion.svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: -90 }}
        transition={{ duration: 0.5 }}
      >
        <circle
          stroke="#2a2a2a"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress / 100 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.svg>
      <motion.div
        className="absolute inset-0 flex items-center justify-center text-white font-bold"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        {progress}%
      </motion.div>
    </div>
  );
};

const ExperienceBadge = ({ years, color }: { years: number; color: string }) => (
  <motion.div
    className={`absolute top-4 left-4 ${color} bg-opacity-20 rounded-full px-3 py-1 text-xs font-medium`}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.1 }}
  >
    {years}+ Years
  </motion.div>
);

export default function SkillCard({
  icon,
  title,
  description,
  color,
  progress = 0,
  tags = [],
  linkUrl,
  skillLevel,
  experience,
}: SkillCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [{ rotateX, rotateY, scale }, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setMousePosition({ x, y });
    
    api.start({
      rotateX: ((y - centerY) / centerY) * -20,
      rotateY: ((x - centerX) / centerX) * 20,
      scale: 1.1,
    });
  };

  const colorMap: { [key: string]: string } = {
    'bg-blue-500': '#3B82F6',
    'bg-purple-500': '#8B5CF6',
    'bg-green-500': '#22C55E',
    'bg-red-500': '#EF4444',
    'bg-yellow-500': '#EAB308',
  };

  const baseColor = colorMap[color] || colorMap['bg-blue-500'];

  return (
    <animated.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setIsHovered(false);
        api.start({ rotateX: 0, rotateY: 0, scale: 1 });
      }}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        transform: to(
          [rotateX, rotateY, scale],
          (rx, ry, s) => `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})`
        ),
      }}
      className="relative group w-full max-w-sm"
    >
      <GlowingBorder color={color} />
      <FloatingParticles color={color} />
      
      <motion.div
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative overflow-hidden backdrop-blur-lg bg-black bg-opacity-80 rounded-xl p-6 border border-gray-800"
        style={{
          boxShadow: `0 0 20px 0 ${baseColor}25`,
        }}
      >
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <motion.div
              className={`${color} bg-opacity-20 rounded-xl p-4`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {icon}
              </motion.div>
            </motion.div>
            {progress > 0 && <ProgressRing progress={progress} color={baseColor} />}
          </div>

          {experience && <ExperienceBadge years={experience} color={color} />}

          <motion.h3
            className="text-2xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, white 0%, ${baseColor} 100%)`,
            }}
          >
            {title}
          </motion.h3>

          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.p
                className="text-gray-300 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {description}
              </motion.p>
            ) : (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-gray-300 leading-relaxed">{description}</p>
                
                {tags.length > 0 && (
                  <motion.div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <motion.span
                        key={tag}
                        className={`${color} bg-opacity-20 rounded-full px-3 py-1 text-sm font-medium`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                {linkUrl && (
                  <motion.a
                    href={linkUrl}
                    className="inline-flex items-center space-x-2 text-white"
                    whileHover={{ x: 5 }}
                  >
                    <span>Learn more</span>
                    <motion.svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ x: isHovered ? 5 : 0 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </motion.svg>
                  </motion.a>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="absolute bottom-4 right-4"
          animate={{ rotate: isExpanded ? 180 : 0 }}
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>

        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${baseColor}15 0%, transparent 70%)`,
            }}
          />
        )}
      </motion.div>
    </animated.div>
  );
}