import React from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Star, Medal } from 'lucide-react';

const achievementsData = [
  {
    icon: <Award className="w-12 h-12 text-yellow-400" />,
    title: "Best Hackathon Project",
    description: "Winner at Tech Innovators Hackathon 2023",
    year: 2023
  },
  {
    icon: <Trophy className="w-12 h-12 text-blue-400" />,
    title: "Top Performer",
    description: "Outstanding Performance in Web Development",
    year: 2022
  },
  {
    icon: <Star className="w-12 h-12 text-purple-400" />,
    title: "Open Source Contributor",
    description: "Major contributions to community projects",
    year: 2021
  },
  {
    icon: <Medal className="w-12 h-12 text-green-400" />,
    title: "Academic Excellence",
    description: "Highest GPA in Computer Science",
    year: 2020
  }
];

const AchievementsSection = () => {
  return (
    <section id="achievements" className="py-16 bg-[#121212]">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          Achievements
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievementsData.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.2 
              }}
              className="bg-[#1e1e1e] rounded-xl p-6 text-center hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 border border-white/10"
            >
              <div className="flex justify-center mb-4">
                {achievement.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {achievement.title}
              </h3>
              <p className="text-gray-400 mb-2">
                {achievement.description}
              </p>
              <span className="text-sm text-purple-400">
                {achievement.year}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;