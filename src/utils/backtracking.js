const doesNotExist = (grid, row, col, num) => {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }

  const startRow = row - row % 3;
  const startCol = col - col % 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

// Solve the Sudoku using backtracking
const solveSudoku = (grid, solvedCells = []) => {
  const findEmptyCell = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === '') return [row, col];
      }
    }
    return [-1, -1];
  };

  const [row, col] = findEmptyCell(grid);
  if (row === -1 && col === -1) return true;

  for (let num = 1; num <= 9; num++) {
    if (doesNotExist(grid, row, col, num.toString())) {
      grid[row][col] = num.toString();
      solvedCells.push([row, col]);
      if (solveSudoku(grid, solvedCells)) return true;
      grid[row][col] = '';
      solvedCells.pop();
    }
  }
  return false;
};

export default solveSudoku;