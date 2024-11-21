import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const texts = [
  "The quick brown fox jumps over the lazy dog.",
  "Pack my box with five dozen liquor jugs.",
  "How vexingly quick daft zebras jump!",
  "The five boxing wizards jump quickly.",
  "Sphinx of black quartz, judge my vow."
];

export default function TypingTest() {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startNewGame = () => {
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    setText(randomText);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setWpm(null);
    setAccuracy(null);
    setIsFinished(false);
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!startTime && value) {
      setStartTime(Date.now());
    }

    setUserInput(value);

    if (value === text) {
      const endTime = Date.now();
      setEndTime(endTime);
      const timeInMinutes = (endTime - (startTime || endTime)) / 60000;
      const wordsTyped = text.split(' ').length;
      const calculatedWpm = Math.round(wordsTyped / timeInMinutes);
      setWpm(calculatedWpm);

      let correctChars = 0;
      for (let i = 0; i < text.length; i++) {
        if (value[i] === text[i]) correctChars++;
      }
      const calculatedAccuracy = Math.round((correctChars / text.length) * 100);
      setAccuracy(calculatedAccuracy);
      setIsFinished(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold mb-2">Speed Typing Test</h3>
        <p className="text-gray-400">Type the text below as quickly and accurately as possible</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mb-8 p-6 bg-gray-800/50 rounded-lg"
      >
        <p className="text-lg mb-4 leading-relaxed">
          {text.split('').map((char, index) => {
            let color = 'text-gray-400';
            if (index < userInput.length) {
              color = userInput[index] === char ? 'text-green-500' : 'text-red-500';
            }
            return (
              <motion.span
                key={index}
                className={color}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
              >
                {char}
              </motion.span>
            );
          })}
        </p>

        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={isFinished}
          className="w-full bg-gray-700/50 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Start typing..."
        />
      </motion.div>

      {isFinished && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center mb-8"
        >
          <h4 className="text-xl font-semibold mb-4">Results</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-blue-500">{wpm}</p>
              <p className="text-sm text-gray-400">Words per minute</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-green-500">{accuracy}%</p>
              <p className="text-sm text-gray-400">Accuracy</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold"
        onClick={startNewGame}
      >
        {isFinished ? 'Try Again' : 'New Text'}
      </motion.button>
    </div>
  );
}