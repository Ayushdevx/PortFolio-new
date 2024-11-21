import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Volume2, VolumeX, Trophy, RotateCcw, Shield } from 'lucide-react';

type Player = 'X' | 'O' | null;
type Board = Player[];
type Difficulty = 'easy' | 'medium' | 'hard';
type GameStats = {
  wins: number;
  losses: number;
  draws: number;
};

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerNext, setIsPlayerNext] = useState(true);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [sound, setSound] = useState(true);
  const [stats, setStats] = useState<GameStats>({ wins: 0, losses: 0, draws: 0 });
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lastWinner, setLastWinner] = useState<Player | 'draw' | null>(null);

  // Sound effects setup
  const playSound = (type: 'move' | 'win' | 'lose' | 'draw') => {
    if (!sound) return;
    const sounds = {
      move: [523.25, 659.25], // C5, E5
      win: [523.25, 659.25, 783.99], // C5, E5, G5
      lose: [523.25, 466.16, 392.00], // C5, Bb4, G4
      draw: [523.25, 587.33, 523.25], // C5, D5, C5
    };

    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const notes = sounds[type];
    let time = ctx.currentTime;
    notes.forEach((freq, i) => {
      oscillator.frequency.setValueAtTime(freq, time + i * 0.1);
    });

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + notes.length * 0.1);

    oscillator.start(time);
    oscillator.stop(time + notes.length * 0.1);
  };

  const checkWinner = (squares: Board): [Player | 'draw' | null, number[] | null] => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], combo];
      }
    }
    return [squares.every(square => square !== null) ? 'draw' : null, null];
  };

  const minimax = (squares: Board, depth: number, isMaximizing: boolean, alpha: number = -Infinity, beta: number = Infinity): number => {
    const [result] = checkWinner(squares);
    if (result === 'X') return -10 + depth;
    if (result === 'O') return 10 - depth;
    if (result === 'draw') return 0;

    if (difficulty === 'easy' && Math.random() < 0.3) {
      return Math.random() * 20 - 10;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = 'O';
          const score = minimax(squares, depth + 1, false, alpha, beta);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
          if (difficulty !== 'hard') break;
          alpha = Math.max(alpha, bestScore);
          if (beta <= alpha) break;
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = 'X';
          const score = minimax(squares, depth + 1, true, alpha, beta);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
          if (difficulty !== 'hard') break;
          beta = Math.min(beta, bestScore);
          if (beta <= alpha) break;
        }
      }
      return bestScore;
    }
  };

  const findBestMove = (squares: Board): number => {
    let bestScore = -Infinity;
    let bestMoves: number[] = [];

    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = 'O';
        const score = minimax(squares, 0, false);
        squares[i] = null;
        
        if (score > bestScore) {
          bestScore = score;
          bestMoves = [i];
        } else if (score === bestScore) {
          bestMoves.push(i);
        }
      }
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  };

  const handleClick = (index: number) => {
    if (board[index] || !isPlayerNext || winner) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerNext(false);
    playSound('move');
  };

  useEffect(() => {
    const [currentWinner, currentWinningLine] = checkWinner(board);
    
    if (currentWinner) {
      setWinner(currentWinner);
      setWinningLine(currentWinningLine);
      setLastWinner(currentWinner);
      
      const newStats = { ...stats };
      if (currentWinner === 'X') {
        newStats.wins++;
        setStreak(streak + 1);
        playSound('win');
      } else if (currentWinner === 'O') {
        newStats.losses++;
        setStreak(0);
        playSound('lose');
      } else {
        newStats.draws++;
        playSound('draw');
      }
      setStats(newStats);
      return;
    }

    if (!isPlayerNext) {
      setTimeout(() => {
        const bestMove = findBestMove([...board]);
        const newBoard = [...board];
        newBoard[bestMove] = 'O';
        setBoard(newBoard);
        setIsPlayerNext(true);
        playSound('move');
      }, 500);
    }
  }, [board, isPlayerNext]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  const getCellColor = (index: number, value: Player) => {
    if (!winningLine?.includes(index)) {
      return value === 'X' ? 'text-blue-500' : 'text-red-500';
    }
    return value === 'X' ? 'text-blue-400 animate-pulse' : 'text-red-400 animate-pulse';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            Tic Tac Toe
          </h1>
          <div className="flex justify-center gap-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings2 className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
              onClick={() => setSound(!sound)}
            >
              {sound ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </motion.button>
          </div>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-800 rounded-lg p-4 mb-4"
              >
                <h3 className="text-lg font-semibold mb-2">Difficulty</h3>
                <div className="flex gap-2 justify-center">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                    <button
                      key={level}
                      className={`px-4 py-2 rounded-lg capitalize ${
                        difficulty === level
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                          : 'bg-gray-700'
                      }`}
                      onClick={() => setDifficulty(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mb-4 px-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-xl font-bold">{stats.wins}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="text-xl font-bold">{stats.losses}</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-gray-500" />
              <span className="text-xl font-bold">{stats.draws}</span>
            </div>
          </div>

          <div className="text-lg font-semibold mb-4">
            {winner ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`text-2xl ${
                  winner === 'X'
                    ? 'text-blue-500'
                    : winner === 'O'
                    ? 'text-red-500'
                    : 'text-gray-400'
                }`}
              >
                {winner === 'draw' ? "It's a draw!" : `${winner} wins!`}
              </motion.div>
            ) : (
              <div className="text-gray-400">
                {isPlayerNext ? 'Your turn' : "AI's turn"}
              </div>
            )}
            {streak > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-sm text-yellow-500 mt-1"
              >
                🔥 Win streak: {streak}
              </motion.div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {board.map((value, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: value ? 1 : 1.05 }}
              whileTap={{ scale: value ? 1 : 0.95 }}
              className={`aspect-square bg-gray-800/50 rounded-lg flex items-center justify-center text-4xl font-bold border-2 ${
                !value && !winner && isPlayerNext
                  ? 'border-white/20 hover:border-white/40'
                  : 'border-transparent'
              }`}
              onClick={() => handleClick(index)}
            >
              {value && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className={getCellColor(index, value)}
                >
                  {value}
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-lg shadow-lg"
          onClick={resetGame}
        >
          New Game
        </motion.button>

        {lastWinner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-sm text-gray-400"
          >
            Last game: {lastWinner === 'draw' ? "Draw" : `${lastWinner} won`}
          </motion.div>
        )}
      </div>
    </div>
  );
}