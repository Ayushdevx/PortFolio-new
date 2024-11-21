import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, X, Type, Target, Grid3X3, Brain, Shuffle } from 'lucide-react';
import TicTacToe from './games/TicTacToe';
import SnakeGame from './games/SnakeGame';
import TypingTest from './games/TypingTest';
import MemoryGame from './games/MemoryGame';
import WordScramble from './games/WordScramble';

const games = [
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    icon: Grid3X3,
    component: TicTacToe,
    description: "Classic game of X's and O's with unbeatable AI",
    color: 'from-purple-500 to-pink-500',
    difficulty: 'Medium'
  },
  {
    id: 'snake',
    name: 'Snake',
    icon: Target,
    component: SnakeGame,
    description: 'Navigate the snake to eat food and grow longer',
    color: 'from-green-500 to-emerald-500',
    difficulty: 'Hard'
  },
  {
    id: 'typing',
    name: 'Speed Typer',
    icon: Type,
    component: TypingTest,
    description: 'Test your typing speed and accuracy',
    color: 'from-blue-500 to-cyan-500',
    difficulty: 'Easy'
  },
  {
    id: 'memory',
    name: 'Memory Match',
    icon: Brain,
    component: MemoryGame,
    description: 'Match pairs of cards to test your memory',
    color: 'from-yellow-500 to-orange-500',
    difficulty: 'Medium'
  },
  {
    id: 'wordscramble',
    name: 'Word Scramble',
    icon: Shuffle,
    component: WordScramble,
    description: 'Unscramble words against the clock',
    color: 'from-red-500 to-rose-500',
    difficulty: 'Hard'
  }
];

export default function GameHub() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showHub, setShowHub] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const SelectedGameComponent = selectedGame 
    ? games.find(game => game.id === selectedGame)?.component 
    : null;

  const filteredGames = games.filter(game => {
    const matchesDifficulty = !difficultyFilter || game.difficulty === difficultyFilter;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  return (
    <section id="games" className="py-20 min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent inline-flex items-center gap-2">
            <Gamepad2 className="w-8 h-8" />
            Game Hub
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Take a break and enjoy these interactive games. Challenge yourself or compete with AI!
          </p>

          {showHub && !selectedGame && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <input
                type="text"
                placeholder="Search games..."
                className="px-4 py-2 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex gap-2">
                {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                  <motion.button
                    key={difficulty}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      difficultyFilter === difficulty
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                    }`}
                    onClick={() => setDifficultyFilter(
                      difficultyFilter === difficulty ? null : difficulty
                    )}
                  >
                    {difficulty}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {showHub && !selectedGame ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredGames.map((game) => (
                <motion.div
                  key={game.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 cursor-pointer border border-white/10 hover:border-white/20 transition-colors"
                  onClick={() => setSelectedGame(game.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${game.color} p-4`}>
                      <game.icon className="w-full h-full text-white" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${game.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                        game.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'}`}>
                      {game.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
                  <p className="text-gray-400">{game.description}</p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            selectedGame && SelectedGameComponent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2"
                  onClick={() => setSelectedGame(null)}
                >
                  <X className="w-6 h-6" />
                </motion.button>
                <SelectedGameComponent />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}