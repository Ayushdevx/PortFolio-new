import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const emojis = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎪', '🎯', '🎲', '🎮', '🎨', '🎭'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('memoryBestScore');
    return saved ? parseInt(saved) : Infinity;
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const initializeGame = () => {
    const shuffledCards = [...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setGameStarted(false);
    setGameCompleted(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (!gameStarted) setGameStarted(true);
    if (flippedCards.length === 2 || cards[id].isMatched || flippedCards.includes(id)) return;

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(m => m + 1);
      const [firstId, secondId] = newFlippedCards;
      
      if (cards[firstId].emoji === cards[secondId].emoji) {
        setCards(cards => cards.map(card => 
          card.id === firstId || card.id === secondId
            ? { ...card, isMatched: true }
            : card
        ));
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  useEffect(() => {
    if (gameStarted && cards.every(card => card.isMatched)) {
      setGameCompleted(true);
      if (moves < bestScore) {
        setBestScore(moves);
        localStorage.setItem('memoryBestScore', moves.toString());
      }
    }
  }, [cards, moves, bestScore, gameStarted]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold mb-2">Memory Match</h3>
        <p className="text-gray-400 mb-4">
          Moves: {moves} | Best: {bestScore === Infinity ? '-' : bestScore}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8"
      >
        {cards.map(card => (
          <motion.button
            key={card.id}
            whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
            className={`w-20 h-20 rounded-lg flex items-center justify-center text-3xl
              ${card.isMatched ? 'bg-green-500/20' : 'bg-gray-800/50'}
              ${!card.isMatched && 'hover:bg-gray-700/50'}
              transition-colors cursor-pointer`}
            onClick={() => handleCardClick(card.id)}
          >
            <AnimatePresence mode="wait">
              {(card.isFlipped || card.isMatched || flippedCards.includes(card.id)) ? (
                <motion.span
                  key="front"
                  initial={{ rotateY: -180 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {card.emoji}
                </motion.span>
              ) : (
                <motion.span
                  key="back"
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: -180 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-500"
                >
                  ?
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </motion.div>

      {gameCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h4 className="text-xl font-bold mb-4">
            {moves === bestScore ? '🎉 New Best Score!' : 'Game Complete!'}
          </h4>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg font-semibold"
            onClick={initializeGame}
          >
            Play Again
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}