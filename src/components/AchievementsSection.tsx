import React, { useState, useEffect } from 'react';
import { 
  Award, Trophy, Star, Medal, 
  ExternalLink, Filter, Share2,
  ChevronRight, Sparkles
} from 'lucide-react';

const achievementsData = [
  {
    icon: <Award />,
    title: "Best Hackathon Project",
    description: "1st Winner at Skribble pad hackathon  ",
    year: 2024,
    category: "Competition",
    stats: {
      participants: "500+",
      prize: "Rs 20,000",
      teamSize: 3
    },
    color: "from-amber-400 to-orange-500",
    link: "#",
    tags: ["Hackathon", "Innovation", "First Place"]
  }, {
    icon: <Award />,
    title: "VOYAGE HACKATHON",
    description: "BIGGEST Entrepreneurship HACKATHON AND ESUMIT  ",
    year: 2024,
    category: "Competition",
    stats: {
      participants: "3000+",
      prize: "Rs 25,000",
      teamSize: 4
    },
    color: "from-amber-400 to-orange-500",
    link: "#",
    tags: ["Hackathon", "Innovation", "THIRD Place"]
  },
  {
    icon: <Trophy />,
    title: "CLUB WEBSITE ",
    description: "MADE WEBSITE FOR CLUBS LIKE FYI,IEEE RAS,ENACTUS,MICROSOFT STUDENT INNOVATION CLUB",
    year: 2024,
    category: "Professional",
    stats: {
      projects: "25+",
      clients: "12",
      rating: "4.9/5"
    },
    color: "from-blue-400 to-cyan-500",
    link: "#",
    tags: ["Web Dev", "Excellence"]
  },
  {
    icon: <Star />,
    title: "Open Source Contributor",
    description: "Major contributions to community projects",
    year: 2023,
    category: "Community",
    stats: {
      commits: "500+",
      PRs: "120",
      stars: "1.2k"
    },
    color: "from-purple-400 to-pink-500",
    link: "#",
    tags: ["Open Source", "Community"]
  },
  {
    icon: <Medal />,
    title: "Academic Excellence",
    description: "Highest GPA in Computer Science",
    year: 2020,
    category: "Academic",
    stats: {
      gpa: "4.0",
      rank: "1st",
      honors: "3"
    },
    color: "from-green-400 to-emerald-500",
    link: "#",
    tags: ["Academic", "CS"]
  }
];

const AchievementsSection = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [...new Set(achievementsData.map(a => a.category))];
  const years = [...new Set(achievementsData.map(a => a.year))];

  const filteredAchievements = achievementsData.filter(achievement => {
    if (selectedYear && achievement.year !== selectedYear) return false;
    if (selectedCategory && achievement.category !== selectedCategory) return false;
    return true;
  });

  return (
    <section className="min-h-screen py-16 bg-gradient-to-b from-[#0a0a0a] to-[#121212] relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent inline-block transform hover:scale-105 transition-transform duration-300">
            Notable Achievements
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A showcase of milestones and recognition across different domains
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <div className="flex gap-2 flex-wrap justify-center">
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedYear === year
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Achievement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredAchievements.map((achievement, index) => (
            <div
              key={index}
              className={`transform transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative group h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative h-full bg-gray-900 rounded-2xl p-6 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-all duration-300">
                  {/* Icon with gradient background */}
                  <div className={`w-16 h-16 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-r ${achievement.color} transform group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {achievement.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-600">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {achievement.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {Object.entries(achievement.stats).map(([key, value]) => (
                      <div key={key} className="text-center p-2 rounded-lg bg-gray-800/50">
                        <div className="text-sm text-gray-400">{key}</div>
                        <div className="font-bold text-white">{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {achievement.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-400">
                      {achievement.year}
                    </span>
                    <button className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-300">
                      <Share2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Hover effect overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${achievement.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default AchievementsSection;
