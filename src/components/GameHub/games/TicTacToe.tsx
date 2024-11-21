import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Player = 'X' | 'O' | null;
type Board = Player[];

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerNext, setIsPlayerNext] = useState(true);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);

  const checkWinner = (squares: Board): Player | 'draw' | null => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(square => square !== null) ? 'draw' : null;
  };

  const minimax = (squares: Board, depth: number, isMaximizing: boolean): number => {
    const result = checkWinner(squares);
    if (result === 'X') return -10 + depth;
    if (result === 'O') return 10 - depth;
    if (result === 'draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = 'O';
          const score = minimax(squares, depth + 1, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = 'X';
          const score = minimax(squares, depth + 1, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const findBestMove = (squares: Board): number => {
    let bestScore = -Infinity;
    let bestMove = 0;

    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = 'O';
        const score = minimax(squares, 0, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  const handleClick = (index: number) => {
    if (board[index] || !isPlayerNext || winner) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerNext(false);
  };

  useEffect(() => {
    const currentWinner = checkWinner(board);
    if (currentWinner) {
      setWinner(currentWinner);
      return;
    }

    if (!isPlayerNext) {
      setTimeout(() => {
        const bestMove = findBestMove([...board]);
        const newBoard = [...board];
        newBoard[bestMove] = 'O';
        setBoard(newBoard);
        setIsPlayerNext(true);
      }, 500);
    }
  }, [board, isPlayerNext]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerNext(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold mb-2">Tic Tac Toe</h3>
        <p className="text-gray-400">
          {winner
            ? winner === 'draw'
              ? "It's a draw!"
              : `${winner} wins!`
            : `${isPlayerNext ? 'Your' : "AI's"} turn`}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8">
        {board.map((value, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: value ? 1 : 1.05 }}
            whileTap={{ scale: value ? 1 : 0.95 }}
            className="w-24 h-24 bg-gray-800/50 rounded-lg flex items-center justify-center text-3xl font-bold border border-white/10"
            onClick={() => handleClick(index)}
          >
            {value && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={value === 'X' ? 'text-blue-500' : 'text-red-500'}
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
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold"
        onClick={resetGame}
      >
        New Game
      </motion.button>
    </div>
  );
}