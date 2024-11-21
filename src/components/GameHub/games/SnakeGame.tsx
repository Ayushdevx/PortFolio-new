import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Pause, Play, RotateCcw, Trophy, Zap, Heart, Star } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const BASE_SPEED = 150;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };
type GameMode = 'classic' | 'timeAttack' | 'zen';
type PowerUp = {
  position: Position;
  type: 'speed' | 'point' | 'life';
  duration?: number;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lives, setLives] = useState(3);
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [timeLeft, setTimeLeft] = useState(60);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [difficulty, setDifficulty] = useState('normal');
  const [touchStart, setTouchStart] = useState<Position | null>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  
  const [highScores, setHighScores] = useState(() => {
    const saved = localStorage.getItem('snakeHighScores');
    return saved ? JSON.parse(saved) : {
      classic: 0,
      timeAttack: 0,
      zen: 0
    };
  });

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (
      snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
      powerUps.some(pu => pu.position.x === newFood.x && pu.position.y === newFood.y)
    );
    setFood(newFood);
  }, [snake, powerUps]);

  const generatePowerUp = useCallback(() => {
    if (Math.random() > 0.85 && powerUps.length < 2) {
      const types = ['speed', 'point', 'life'];
      const type = types[Math.floor(Math.random() * types.length)] as PowerUp['type'];
      let position;
      do {
        position = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE)
        };
      } while (
        snake.some(segment => segment.x === position.x && segment.y === position.y) ||
        (food.x === position.x && food.y === position.y)
      );
      
      setPowerUps(prev => [...prev, { position, type, duration: 10 }]);
    }
  }, [snake, food, powerUps]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    setLives(gameMode === 'zen' ? Infinity : 3);
    setTimeLeft(60);
    setPowerUps([]);
    setActivePowerUps([]);
    generateFood();
    setIsPaused(false);
  };

  const checkCollision = (head: Position): boolean => {
    const wallCollision = head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
    const selfCollision = snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    
    if (gameMode === 'zen') return selfCollision;
    return wallCollision || selfCollision;
  };

  const handlePowerUp = (head: Position) => {
    const powerUpIndex = powerUps.findIndex(pu => 
      pu.position.x === head.x && pu.position.y === head.y
    );

    if (powerUpIndex !== -1) {
      const powerUp = powerUps[powerUpIndex];
      setPowerUps(prev => prev.filter((_, index) => index !== powerUpIndex));

      switch (powerUp.type) {
        case 'speed':
          setActivePowerUps(prev => [...prev, 'speed']);
          setTimeout(() => {
            setActivePowerUps(prev => prev.filter(p => p !== 'speed'));
          }, 5000);
          break;
        case 'point':
          setScore(s => s + 50);
          break;
        case 'life':
          setLives(l => l + 1);
          break;
      }
    }
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setDirection(nextDirection);
    const head = { ...snake[0] };
    
    switch (nextDirection) {
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

    if (gameMode === 'zen' && (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE)) {
      if (head.x < 0) head.x = GRID_SIZE - 1;
      if (head.x >= GRID_SIZE) head.x = 0;
      if (head.y < 0) head.y = GRID_SIZE - 1;
      if (head.y >= GRID_SIZE) head.y = 0;
    }

    if (checkCollision(head)) {
      if (lives > 1) {
        setLives(l => l - 1);
        setSnake([{ x: 10, y: 10 }]);
        setDirection('RIGHT');
        setNextDirection('RIGHT');
        return;
      }
      setIsGameOver(true);
      const newHighScore = Math.max(highScores[gameMode], score);
      setHighScores(prev => ({
        ...prev,
        [gameMode]: newHighScore
      }));
      localStorage.setItem('snakeHighScores', JSON.stringify({
        ...highScores,
        [gameMode]: newHighScore
      }));
      return;
    }

    handlePowerUp(head);
    const newSnake = [head, ...snake];
    
    if (head.x === food.x && head.y === food.y) {
      setScore(s => s + 10);
      generateFood();
      generatePowerUp();
    } else {
      newSnake.pop();
    }
    
    setSnake(newSnake);
  }, [direction, nextDirection, snake, food, isPaused, isGameOver, score, lives, gameMode, highScores, generateFood, generatePowerUp, powerUps]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0 && direction !== 'LEFT') {
        setNextDirection('RIGHT');
      } else if (deltaX < 0 && direction !== 'RIGHT') {
        setNextDirection('LEFT');
      }
    } else {
      if (deltaY > 0 && direction !== 'UP') {
        setNextDirection('DOWN');
      } else if (deltaY < 0 && direction !== 'DOWN') {
        setNextDirection('UP');
      }
    }

    setTouchStart({
      x: touch.clientX,
      y: touch.clientY
    });
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showSettings) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, showSettings]);

  useEffect(() => {
    if (gameMode === 'timeAttack' && !isPaused && !isGameOver) {
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setIsGameOver(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameMode, isPaused, isGameOver]);

  useEffect(() => {
    const speedMultiplier = activePowerUps.includes('speed') ? 0.5 : 1;
    const difficultyMultiplier = {
      easy: 1.2,
      normal: 1,
      hard: 0.8
    }[difficulty];
    
    const gameLoop = setInterval(
      moveSnake,
      (BASE_SPEED - Math.min(score, 100)) * speedMultiplier * difficultyMultiplier
    );
    return () => clearInterval(gameLoop);
  }, [moveSnake, score, activePowerUps, difficulty]);

  const GameOverlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="text-center p-6 bg-gray-800/90 rounded-xl">
        <h3 className="text-2xl font-bold mb-4">
          {isGameOver ? 'Game Over!' : 'Paused'}
        </h3>
        {isGameOver && (
          <div className="mb-4">
            <p className="text-xl">Final Score: {score}</p>
            <p className="text-sm text-gray-400">High Score: {highScores[gameMode]}</p>
          </div>
        )}
        <div className="flex gap-2 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold flex items-center gap-2"
            onClick={isGameOver ? resetGame : () => setIsPaused(false)}
          >
            {isGameOver ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isGameOver ? 'Play Again' : 'Resume'}
          </motion.button>
          {!isGameOver && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg font-semibold flex items-center gap-2"
              onClick={resetGame}
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );

  const SettingsMenu = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="bg-gray-800/90 p-6 rounded-xl max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold mb-4">Settings</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Game Mode</h4>
            <div className="grid grid-cols-3 gap-2">
              {(['classic', 'timeAttack', 'zen'] as GameMode[]).map(mode => (
                <button
                  key={mode}
                  className={`p-2 rounded ${gameMode === mode ? 'bg-green-500' : 'bg-gray-700'}`}
                  onClick={() => setGameMode(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Difficulty</h4>
            <div className="grid grid-cols-3 gap-2">
              {['easy', 'normal', 'hard'].map(diff => (
                <button
                  key={diff}
                  className={`p-2 rounded ${difficulty === diff ? 'bg-green-500' : 'bg-gray-700'}`}
                  onClick={() => setDifficulty(diff)}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg font-semibold"
          onClick={() => {
            setShowSettings(false);
            resetGame();
          }}
        >
          Start Game
        </motion.button>
      </div>
    </motion.div>
  );

  if (showSettings) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <AnimatePresence>
          <SettingsMenu />
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="mb-4 text-center">
        <div className="flex items-center justify-between mb-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-gray-800"
            onClick={() => {
              setIsPaused(true);
              setShowSettings(true);
            }}
          >
            <Settings className="w-6 h-6" />
          </motion.button>
          <h3 className="text-2xl font-bold">Snake Game</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-gray-800"
            onClick={() => setIsPaused(p => !p)}
          >
            {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
          </motion.button>
        </div>
        
        <div className="flex justify-center gap-4 mb-2">
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>{score}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span>{lives}</span>
          </div>
          {gameMode === 'timeAttack' && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-blue-500" />
              <span>{timeLeft}s</span>
            </div>
          )}
          {activePowerUps.includes('speed') && (
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Speed Boost</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-400">High Score: {highScores[gameMode]}</p>
        <p className="text-xs text-gray-500 mt-1">
          {window.innerWidth <= 768 ? 'Swipe to move' : 'Use arrow keys to move, space to pause'}
        </p>
      </div>

      <motion.div
        ref={gameRef}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="relative bg-gray-800/50 rounded-lg p-4 touch-none"
        style={{
          width: GRID_SIZE * CELL_SIZE + 40,
          height: GRID_SIZE * CELL_SIZE + 40
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Game grid background */}
        <div className="absolute inset-4 grid grid-cols-20 grid-rows-20 gap-[1px] opacity-10">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="bg-gray-700" />
          ))}
        </div>

        {/* Snake body */}
        {snake.map((segment, index) => (
          <motion.div
            key={`${segment.x}-${segment.y}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute rounded-sm"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE + 20,
              top: segment.y * CELL_SIZE + 20,
              backgroundColor: index === 0 ? '#22c55e' : '#4ade80',
              boxShadow: index === 0 ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none'
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          className="absolute bg-red-500 rounded-full"
          style={{
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            left: food.x * CELL_SIZE + 20,
            top: food.y * CELL_SIZE + 20,
            boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
          }}
          animate={{
            scale: [1, 1.1, 1],
            transition: {
              duration: 0.5,
              repeat: Infinity
            }
          }}
        />

        {/* Power-ups */}
        {powerUps.map((powerUp, index) => (
          <motion.div
            key={index}
            className="absolute rounded-lg"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: powerUp.position.x * CELL_SIZE + 20,
              top: powerUp.position.y * CELL_SIZE + 20,
              backgroundColor: 
                powerUp.type === 'speed' ? '#eab308' :
                powerUp.type === 'point' ? '#6366f1' :
                '#ec4899'
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              transition: {
                duration: 1,
                repeat: Infinity
              }
            }}
          />
        ))}

        {/* Game over/pause overlay */}
        {(isGameOver || isPaused) && <GameOverlay />}
      </motion.div>
    </div>
  );
}