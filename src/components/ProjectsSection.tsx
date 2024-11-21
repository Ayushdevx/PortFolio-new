import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const projects = [
  {
    title: 'Rascade.in',
    description: 'AI-powered e-commerce platform with personalized recommendations',
    image: 'https://plus.unsplash.com/premium_photo-1681400690940-8eff232a8f7d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['React', 'Node.js', 'TensorFlow', 'AWS'],
    liveUrl: 'https://rascade.in',
    githubUrl: 'https://github.com/yourusername/rascade',
  },
  {
    title: 'Breaking Bonds',
    description: 'Machine learning model for Bail and judicial Development',
    image: 'https://plus.unsplash.com/premium_photo-1681487977919-306ef7194d98?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['Python', 'PyTorch', 'React', 'MongoDB'],
    liveUrl: 'https://breaking-bonds.vercel.app',
    githubUrl: 'https://github.com/yourusername/breaking-bonds',
  },
  {
    title: 'DhanGyan',
    description: 'Financial literacy platform with AI-powered insights',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
    tags: ['Next.js', 'GPT-3', 'Firebase', 'TailwindCSS'],
    liveUrl: 'https://dhan-gyan.vercel.app',
    githubUrl: 'https://github.com/yourusername/dhangyan',
  },
  {
    title: 'LiveScope',
    description: 'Complete Solution for students object detection pdf to quiz text to video attention derection',
    image: 'https://images.unsplash.com/photo-1517503733723-8ea1cf616798?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['javaScript', 'Skribble.live', 'Html', 'TailwindCSS'],
    liveUrl: 'https://app.scribbler.live/?jsnb=github:DurvankGade/LiveScope-Real-time-Object-Detection/ScribbleNotebook',
    githubUrl: 'https://github.com/yourusername/dhangyan',
  },
];

export default function ProjectsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="projects" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          ref={ref}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Featured Projects
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Showcasing innovative solutions and technical expertise
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
              className="group relative bg-gray-900 rounded-lg overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-4">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <ExternalLink className="w-6 h-6 text-gray-900" />
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Github className="w-6 h-6 text-gray-900" />
                  </a>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-sm bg-gray-800 rounded-full text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}