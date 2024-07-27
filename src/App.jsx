import React, { useState } from 'react';
import SudokuGrid from './components/SudokuGrid';
import logo from './logo/logo.png'
import './index.css';

const App = () => {
  const [grid, setGrid] = useState(Array(9).fill().map(() => Array(9).fill('')));

  const handleGridExtracted = (extractedGrid) => {
    setGrid(extractedGrid);
  };

  return (
    <div className="min-h-screen bg-zinc-800 mx-auto pt-4 flex flex-col items-center">
      <div className="flex justify-center mt-2 mb-5">
        <img src={logo} alt="SudoWiz Logo" className="h-20 sm:h-20 md:h-30 lg:h-30" />
      </div>
      <div>
        <SudokuGrid initialGrid={grid} />
      </div>
    </div>
  );
};

export default App;