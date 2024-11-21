import { Brain, Code, Database, Cpu, Network, Bot } from 'lucide-react';
import SkillCard from './SkillCard';
import { motion } from 'framer-motion';

const skills = [
  {
    icon: <Brain className="w-full h-full" />,
    title: 'Machine Learning',
    description: 'Deep learning, NLP, and computer vision expertise with PyTorch and TensorFlow',
    color: 'bg-purple-600',
  },
  {
    icon: <Code className="w-full h-full" />,
    title: 'Full Stack Development',
    description: 'Building scalable applications with React, Node.js, and modern frameworks',
    color: 'bg-blue-600',
  },
  {
    icon: <Database className="w-full h-full" />,
    title: 'Data Engineering',
    description: 'Big data processing and analytics with Apache Spark and SQL',
    color: 'bg-green-600',
  },
  {
    icon: <Cpu className="w-full h-full" />,
    title: 'System Design',
    description: 'Architecting scalable and distributed systems',
    color: 'bg-red-600',
  },
  {
    icon: <Network className="w-full h-full" />,
    title: 'Cloud Computing',
    description: 'AWS, Azure, and GCP infrastructure management',
    color: 'bg-yellow-600',
  },
  {
    icon: <Bot className="w-full h-full" />,
    title: 'AI Development',
    description: 'Building intelligent systems and automation solutions',
    color: 'bg-pink-600',
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Skills & Expertise
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Combining cutting-edge technologies with innovative solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <SkillCard key={index} {...skill} />
          ))}
        </div>
      </div>
    </section>
  );
}