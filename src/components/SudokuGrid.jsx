import React, { useState, useEffect, useRef } from 'react';
import solveSudoku from '../utils/backtracking';

// Main grid component
const SudokuGrid = ({ initialGrid }) => {
  const [grid, setGrid] = useState(Array(9).fill().map(() => Array(9).fill('')));
  const [solvedCells, setSolvedCells] = useState([]);
  const [focusedCell, setFocusedCell] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const inputRefs = useRef(Array(9).fill().map(() => Array(9).fill(null)));

// Initial grid
useEffect(() => {
  if (initialGrid) {
    setGrid(initialGrid);
  }
}, [initialGrid]);

// Numeric values
const handleChange = (rowIndex, colIndex, value) => {
  if (/^[1-9]$/.test(value) || value === '') {
    const isDuplicateRow = grid[rowIndex].some((cell, idx) => cell === value && idx !== colIndex);
    const isDuplicateCol = grid.some((row, idx) => row[colIndex] === value && idx !== rowIndex);

    const startRow = Math.floor(rowIndex / 3) * 3;
    const startCol = Math.floor(colIndex / 3) * 3;
      
    let isDuplicateSubgrid = false;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (grid[r][c] === value && (r !== rowIndex || c !== colIndex)) {
          isDuplicateSubgrid = true;
          break;
        }
      }
      if (isDuplicateSubgrid) break;
    }
  
    if (isDuplicateRow || isDuplicateCol || isDuplicateSubgrid) {
      alert('Duplicate values in the same row, column, or subgrid are not allowed');
      return;
    }
      
    const updatedGrid = grid.map((row, rIdx) =>
      rIdx === rowIndex ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell)) : row
    );
    setGrid(updatedGrid);
  }
};


// Solve button functionality
const handleSolve = () => {
  const gridCopy = grid.map(row => row.slice());
  const solvedCellsList = [];

  const isSolved = solveSudoku(gridCopy, solvedCellsList);

  if (isSolved) {
    setGrid(gridCopy);
    setSolvedCells(solvedCellsList);
    setIsSolved(true);
    setFocusedCell(null);
  } else {
    alert('No solution exists!');
  }
};

// Reset button functionality
const handleReset = () => {
  setGrid(Array(9).fill().map(() => Array(9).fill('')));
  setSolvedCells([]);
  setFocusedCell(null);
  setIsSolved(false);
};

// Keyboard functionality
const handleKeyDown = (e, rowIndex, colIndex) => {
  if (isSolved) return;

  const { key } = e;
  const gridSize = 9;

  if (key === 'ArrowUp' && rowIndex > 0) {
    e.preventDefault();
    setFocusedCell({ row: rowIndex - 1, col: colIndex });
    inputRefs.current[rowIndex - 1][colIndex].focus();
  } else if (key === 'ArrowDown' && rowIndex < gridSize - 1) {
    e.preventDefault();
    setFocusedCell({ row: rowIndex + 1, col: colIndex });
    inputRefs.current[rowIndex + 1][colIndex].focus();
  } else if (key === 'ArrowLeft' && colIndex > 0) {
    e.preventDefault();
    setFocusedCell({ row: rowIndex, col: colIndex - 1 });
    inputRefs.current[rowIndex][colIndex - 1].focus();
  } else if (key === 'ArrowRight' && colIndex < gridSize - 1) {
    e.preventDefault();
    setFocusedCell({ row: rowIndex, col: colIndex + 1 });
    inputRefs.current[rowIndex][colIndex + 1].focus();
  } else if (/^[1-9]$/.test(key)) {
    handleChange(rowIndex, colIndex, key);
  }
};

// Orange background on focus functionality
const handleFocus = (rowIndex, colIndex) => {
  if (isSolved) return;
  setFocusedCell({ row: rowIndex, col: colIndex });
};

// Main div
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
              onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
              onFocus={() => handleFocus(rowIndex, colIndex)}
              ref={(el) => inputRefs.current[rowIndex][colIndex] = el}
              className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-12 lg:h-12 text-center text-zinc-800 ${isSolved ? 'cursor-not-allowed' : 'hover:bg-orange-300 hover:bg-opacity-100'} text-2xl font-bold border
                          ${colIndex % 3 === 0 || colIndex === 0 ? 'border-l-4 border-gray-500' : 'border-l-1'}
                          ${rowIndex % 3 === 0 || rowIndex === 0 ? 'border-t-4 border-gray-500' : 'border-t-1'}
                          ${colIndex === 8 ? 'border-r-4 border-gray-500' : ''}
                          ${rowIndex === 8 ? 'border-b-4 border-gray-500' : ''}
                          ${colIndex !== 8 ? 'border-r-0 border-gray-500' : ''}
                          ${rowIndex !== 8 ? 'border-b-0 border-gray-500' : ''}
                          ${rowIndex % 2 === 0 && colIndex % 2 === 0 ? 'bg-gray-300' : ''}
                          ${rowIndex % 2 !== 0 && colIndex % 2 !== 0 ? 'bg-gray-300' : ''}
                          ${solvedCells.some(([r, c]) => r === rowIndex && c === colIndex) ? 'bg-green-300' : ''}
                          ${focusedCell?.row === rowIndex && focusedCell?.col === colIndex ? 'bg-orange-300' : ''}
                        `}
                style={{ 
                  '-moz-appearance': 'textfield',
                  '-webkit-appearance': 'none',
                  'appearance': 'none',
                  pointerEvents: isSolved ? 'none' : 'auto'
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