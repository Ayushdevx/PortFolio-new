import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved) : 0;
  });

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    generateFood();
    setIsPaused(false);
  };

  const checkCollision = (head: Position): boolean => {
    return (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    const head = { ...snake[0] };
    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }

    if (checkCollision(head)) {
      setIsGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('snakeHighScore', score.toString());
      }
      return;
    }

    const newSnake = [head, ...snake];
    if (head.x === food.x && head.y === food.y) {
      setScore(s => s + 10);
      generateFood();
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  }, [direction, snake, food, isPaused, isGameOver, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, INITIAL_SPEED - Math.min(score, 100));
    return () => clearInterval(gameLoop);
  }, [moveSnake, score]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold mb-2">Snake Game</h3>
        <p className="text-gray-400 mb-2">Score: {score} | High Score: {highScore}</p>
        <p className="text-sm text-gray-500">Use arrow keys to move, space to pause</p>
      </div>

      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="relative bg-gray-800/50 rounded-lg p-4"
        style={{
          width: GRID_SIZE * CELL_SIZE + 40,
          height: GRID_SIZE * CELL_SIZE + 40
        }}
      >
        {snake.map((segment, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute bg-green-500 rounded-sm"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE + 20,
              top: segment.y * CELL_SIZE + 20,
              backgroundColor: index === 0 ? '#22c55e' : '#4ade80'
            }}
          />
        ))}
        <motion.div
          className="absolute bg-red-500 rounded-full"
          style={{
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            left: food.x * CELL_SIZE + 20,
            top: food.y * CELL_SIZE + 20
          }}
          animate={{
            scale: [1, 1.1, 1],
            transition: {
              duration: 0.5,
              repeat: Infinity
            }
          }}
        />
      </motion.div>

      {(isGameOver || isPaused) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              {isGameOver ? 'Game Over!' : 'Paused'}
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold"
              onClick={isGameOver ? resetGame : () => setIsPaused(false)}
            >
              {isGameOver ? 'Play Again' : 'Resume'}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}