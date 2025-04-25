
// This utility contains functions for solving Sudoku puzzles using backtracking algorithm

/**
 * Solves a Sudoku puzzle using backtracking algorithm
 * @param board The 9x9 Sudoku board (2D array)
 * @returns boolean - True if solution is found, false otherwise
 */
export const solveSudoku = (board: string[][]): boolean => {
  // Find an empty cell
  const emptyCell = findEmptyCell(board);
  
  // If no empty cell is found, the board is solved
  if (!emptyCell) return true;
  
  const [row, col] = emptyCell;
  
  // Try placing digits 1-9 in the empty cell
  for (let num = 1; num <= 9; num++) {
    const numStr = num.toString();
    
    // Check if the digit can be placed in the current cell
    if (isValid(board, row, col, numStr)) {
      // Place the digit
      board[row][col] = numStr;
      
      // Recursively try to solve the rest of the board
      if (solveSudoku(board)) {
        return true;
      }
      
      // If placing the digit didn't lead to a solution,
      // backtrack by resetting the cell
      board[row][col] = ".";
    }
  }
  
  // No solution found with the current configuration
  return false;
};

/**
 * Finds an empty cell in the Sudoku board
 * @param board The 9x9 Sudoku board
 * @returns Coordinates [row, col] of an empty cell, or null if no empty cells
 */
const findEmptyCell = (board: string[][]): [number, number] | null => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === ".") {
        return [row, col];
      }
    }
  }
  return null;
};

/**
 * Checks if placing a number in the given position is valid
 * @param board The 9x9 Sudoku board
 * @param row Row index (0-8)
 * @param col Column index (0-8)
 * @param num Number to check (1-9 as string)
 * @returns boolean - True if placement is valid, false otherwise
 */
const isValid = (board: string[][], row: number, col: number, num: string): boolean => {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }
  
  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[boxRow + r][boxCol + c] === num) return false;
    }
  }
  
  return true;
};

/**
 * Validates input Sudoku board format and content
 * @param board The 9x9 Sudoku board
 * @returns boolean - True if valid, false otherwise
 */
export const validateBoard = (board: any): boolean => {
  // Check if board is an array of 9 rows
  if (!Array.isArray(board) || board.length !== 9) return false;
  
  // Check each row
  for (let row = 0; row < 9; row++) {
    // Check if row is an array of 9 cells
    if (!Array.isArray(board[row]) || board[row].length !== 9) return false;
    
    // Check each cell in the row
    for (let col = 0; col < 9; col++) {
      const cell = board[row][col];
      // Check if cell is either a digit 1-9 or "."
      if (!(cell === "." || (cell >= "1" && cell <= "9"))) return false;
    }
  }
  
  return true;
};

/**
 * Helper to create a deep copy of a Sudoku board
 * @param board The 9x9 Sudoku board
 * @returns A deep copy of the board
 */
export const deepCopyBoard = (board: string[][]): string[][] => {
  return board.map(row => [...row]);
};
