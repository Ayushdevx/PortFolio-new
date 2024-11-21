import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Clock, Tag } from 'lucide-react';

const blogPosts = [
  {
    title: "Mastering React Hooks",
    excerpt: "Deep dive into advanced React Hooks and best practices...",
    date: "May 15, 2023",
    readTime: "5 min read",
    tags: ["React", "JavaScript", "Web Development"],
    image: "/api/placeholder/400/250"
  },
  {
    title: "AI in Web Development",
    excerpt: "Exploring the impact of AI technologies in modern web development...",
    date: "June 22, 2023",
    readTime: "7 min read",
    tags: ["AI", "Technology", "Future of Web"],
    image: "/api/placeholder/400/250"
  },
  {
    title: "Performance Optimization Techniques",
    excerpt: "Strategies to improve web application performance and user experience...",
    date: "July 10, 2023",
    readTime: "6 min read",
    tags: ["Performance", "Optimization", "Web Dev"],
    image: "/api/placeholder/400/250"
  }
];

const BlogSection = () => {
  const [activeFilter, setActiveFilter] = useState(null);

  const filteredPosts = activeFilter
    ? blogPosts.filter(post => post.tags.includes(activeFilter))
    : blogPosts;

  return (
    <section id="blog" className="py-16 bg-[#0f0f0f]">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          Latest Blog Posts
        </motion.h2>

        {/* Tag Filters */}
        <div className="flex justify-center space-x-4 mb-8">
          {['React', 'AI', 'Performance', 'Web Development'].map((tag) => (
            <motion.button
              key={tag}
              onClick={() => setActiveFilter(activeFilter === tag ? null : tag)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                activeFilter === tag 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-[#1e1e1e] text-gray-400 hover:bg-[#2a2a2a]'
              }`}
            >
              {tag}
            </motion.button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.2 
              }}
              className="bg-[#1e1e1e] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
            >
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-2 text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {post.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {post.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {post.date}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;