import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const words = [
  { word: 'REACT', hint: 'A JavaScript library for building user interfaces' },
  { word: 'TYPESCRIPT', hint: 'JavaScript with syntax for types' },
  { word: 'DEVELOPER', hint: 'Someone who writes code' },
  { word: 'PROGRAMMING', hint: 'Writing instructions for computers' },
  { word: 'JAVASCRIPT', hint: 'A popular web programming language' },
  { word: 'INTERFACE', hint: 'Where users interact with programs' },
  { word: 'DATABASE', hint: 'Stores and organizes data' },
  { word: 'ALGORITHM', hint: 'Step-by-step problem solving procedure' },
  { word: 'FUNCTION', hint: 'A reusable block of code' },
  { word: 'VARIABLE', hint: 'Stores data in programming' }
];

export default function WordScramble() {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [hint, setHint] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('wordScrambleHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showHint, setShowHint] = useState(false);

  const scrambleWord = (word: string) => {
    return word
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };

  const selectNewWord = useCallback(() => {
    const { word, hint } = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(word);
    setHint(hint);
    setScrambledWord(scrambleWord(word));
    setUserInput('');
    setShowHint(false);
  }, []);

  const startNewGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameStatus('playing');
    selectNewWord();
  };

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          setGameStatus('lost');
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toUpperCase() === currentWord) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('wordScrambleHighScore', newScore.toString());
      }
      selectNewWord();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold mb-2">Word Scramble</h3>
        <div className="flex justify-center gap-4 text-gray-400">
          <p>Score: {score}</p>
          <p>High Score: {highScore}</p>
          <p className={`${timeLeft <= 10 ? 'text-red-500' : ''}`}>
            Time: {timeLeft}s
          </p>
        </div>
      </div>

      {gameStatus === 'playing' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <div className="text-center mb-8">
            <motion.h2
              key={scrambledWord}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold mb-4 tracking-wider"
            >
              {scrambledWord}
            </motion.h2>
            
            {showHint && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400 italic"
              >
                Hint: {hint}
              </motion.p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.toUpperCase())}
              className="w-full bg-gray-800/50 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Type your answer..."
            />
            
            <div className="flex gap-4 justify-center">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg font-semibold"
              >
                Submit
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gray-700/50 rounded-lg font-semibold"
                onClick={() => setShowHint(true)}
              >
                Show Hint
              </motion.button>
            </div>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h4 className="text-2xl font-bold mb-4">
            {gameStatus === 'won' ? '🎉 You Won!' : '⏰ Times Up!'}
          </h4>
          <p className="text-gray-400 mb-6">
            Final Score: {score}
            {score === highScore && score > 0 && ' (New High Score!)'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg font-semibold"
            onClick={startNewGame}
          >
            Play Again
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}