import React, { useState, useEffect } from 'react';
import solveSudoku from '../utils/sudokuSolver';

const SudokuGrid = ({ initialGrid }) => {
  const [grid, setGrid] = useState(Array(9).fill().map(() => Array(9).fill('')));
  const [solvedCells, setSolvedCells] = useState([]);

  useEffect(() => {
    if (initialGrid) {
      setGrid(initialGrid);
    }
  }, [initialGrid]);

  const handleChange = (rowIndex, colIndex, value) => {
    if (/^[1-9]$/.test(value) || value === '') {
      const updatedGrid = grid.map((row, rIdx) =>
        rIdx === rowIndex ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell)) : row
      );
      setGrid(updatedGrid);
    }
  };

  const handleSolve = () => {
    const gridCopy = grid.map(row => row.slice());
    const solvedCellsList = [];

    const isSolved = solveSudoku(gridCopy, solvedCellsList);

    if (isSolved) {
      setGrid(gridCopy);
      setSolvedCells(solvedCellsList);
    } else {
      alert('No solution exists!');
    }
  };

  const handleReset = () => {
    setGrid(Array(9).fill().map(() => Array(9).fill('')));
    setSolvedCells([]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="border-4 border-black p-1">
        <div className="grid grid-cols-9 gap-0">
          {grid.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                value={value}
                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                className={`w-12 h-12 text-center text-zinc-800 hover:bg-orange-300 hover:bg-opacity-100 text-2xl font-bold border
                            ${colIndex % 3 === 0 || colIndex === 0 ? 'border-l-4 border-gray-500' : 'border-l-1'}
                            ${rowIndex % 3 === 0 || rowIndex === 0 ? 'border-t-4 border-gray-500' : 'border-t-1'}
                            ${colIndex === 8 ? 'border-r-4 border-gray-500' : ''}
                            ${rowIndex === 8 ? 'border-b-4 border-gray-500' : ''}
                            ${colIndex !== 8 ? 'border-r-0 border-gray-500' : ''}
                            ${rowIndex !== 8 ? 'border-b-0 border-gray-500' : ''}
                            ${solvedCells.some(([r, c]) => r === rowIndex && c === colIndex) ? 'bg-green-300' : ''}
                            `}
                style={{ 
                  '-moz-appearance': 'textfield',
                  '-webkit-appearance': 'none',
                  'appearance': 'none'
                }}
              />
            ))
          )}
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button onClick={handleReset} className="px-4 py-2 bg-white border-2 hover:bg-zinc-500 hover:text-white border-orange-500 text-orange-500 font-bold rounded">
          Reset
        </button>
        <button onClick={handleSolve} className="px-4 py-2 bg-orange-500 hover:bg-orange-300 border-2 border-white text-white font-bold rounded">
          Solve
        </button>
      </div>
    </div>
  );
};

export default SudokuGrid;