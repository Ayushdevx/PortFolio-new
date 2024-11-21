import { motion } from 'framer-motion';
import { Brain, Code, Sparkles, ChevronDown, FileDown } from 'lucide-react';
import TypewriterText from './TypewriterText';
import ParticleCanvas from './ParticleField';

export default function HeroSection() {
  const handleDownloadResume = () => {
    // Replace with your actual resume URL
    const resumeUrl = 'https://github.com/Ayushdevx/Ayush-Resume/raw/main/Ayush%20Upadhyay%20RESUME%20%282%29.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Ayush_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <ParticleCanvas />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative inline-block"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center">
              <span className="flex items-center space-x-5">
                <Brain className="w-8 h-8 text-pink-600" />
                <span className="pr-6 text-gray-100 text-lg">AI/ML Engineer</span>
              </span>
              <span className="text-indigo-400 px-6 border-l border-indigo-600">
                <Code className="w-6 h-6 inline-block mr-2" />
                Full Stack Developer
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 text-6xl font-bold tracking-tight text-white sm:text-7xl"
          >
            <TypewriterText text="Hi, I'm Ayush" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg leading-8 text-gray-300"
          >
            Building tomorrow's tech today with AI, ML, and innovative solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <a
              href="#projects"
              className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium transition duration-300 ease-out border-2 border-purple-500 rounded-md shadow-md text-xl"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-500 group-hover:translate-x-0 ease">
                <Sparkles className="w-6 h-6" />
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-purple-500 transition-all duration-300 transform group-hover:translate-x-full ease">View Projects</span>
              <span className="relative invisible">View Projects</span>
            </a>

            <button
              onClick={handleDownloadResume}
              className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium transition duration-300 ease-out border-2 border-pink-500 rounded-md shadow-md text-xl"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-pink-500 group-hover:translate-x-0 ease">
                <FileDown className="w-6 h-6" />
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-pink-500 transition-all duration-300 transform group-hover:translate-x-full ease">Download CV</span>
              <span className="relative invisible">Download CV</span>
            </button>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <ChevronDown className="w-8 h-8 text-gray-400" />
      </motion.div>
    </section>
  );
}