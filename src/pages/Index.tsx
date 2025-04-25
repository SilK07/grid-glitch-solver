
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import SudokuGrid from "@/components/SudokuGrid";
import { solveSudoku, validateBoard, deepCopyBoard } from "@/utils/sudokuSolver";

const Index = () => {
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState<string>(
    '[\n  ["5","3",".",".","7",".",".",".","."],\n  ["6",".",".","1","9","5",".",".","."],\n  [".","9","8",".",".",".",".","6","."],\n  ["8",".",".",".","6",".",".",".","3"],\n  ["4",".",".","8",".","3",".",".","1"],\n  ["7",".",".",".","2",".",".",".","6"],\n  [".","6",".",".",".",".","2","8","."],\n  [".",".",".","4","1","9",".",".","5"],\n  [".",".",".",".","8",".",".","7","9"]\n]'
  );
  const [originalBoard, setOriginalBoard] = useState<string[][] | null>(null);
  const [solvedBoard, setSolvedBoard] = useState<string[][] | null>(null);
  const [solving, setSolving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSolve = () => {
    try {
      setError(null);
      setSolving(true);
      
      // Parse the input JSON
      const board: string[][] = JSON.parse(inputValue);
      
      // Validate the board format
      if (!validateBoard(board)) {
        throw new Error("Invalid Sudoku board format. Please check your input.");
      }
      
      // Store the original board for display
      const originalCopy = deepCopyBoard(board);
      setOriginalBoard(originalCopy);
      
      // Create a copy of the board to solve (so we don't modify the original)
      const boardToSolve = deepCopyBoard(board);
      
      // Solve the Sudoku
      const solved = solveSudoku(boardToSolve);
      
      if (solved) {
        setSolvedBoard(boardToSolve);
        toast({
          title: "Sudoku solved successfully!",
          description: "The solution has been found using backtracking algorithm.",
        });
      } else {
        setSolvedBoard(null);
        toast({
          title: "No solution exists",
          description: "This Sudoku puzzle cannot be solved.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setSolvedBoard(null);
      setOriginalBoard(null);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setSolving(false);
    }
  };

  // Create an empty 9x9 board filled with "."
  const createEmptyBoard = (): string[][] => {
    return Array(9).fill(null).map(() => Array(9).fill("."));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sudoku Solver</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter a 9x9 Sudoku puzzle in the format shown below. The '.' character represents empty cells.
            Our algorithm will solve it using backtracking.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Input Puzzle</h2>
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder='[["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]'
              className="font-mono text-sm h-72"
            />
            
            <div className="flex justify-center">
              <Button 
                onClick={handleSolve} 
                disabled={solving} 
                className="w-full md:w-auto"
              >
                {solving ? "Solving..." : "Solve Sudoku"}
              </Button>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Original Puzzle</h2>
              <SudokuGrid 
                board={originalBoard || createEmptyBoard()} 
                isOriginal={true} 
              />
            </div>
            
            {solvedBoard && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Solved Puzzle</h2>
                <SudokuGrid board={solvedBoard} />
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-12 text-sm text-gray-500 bg-white p-4 rounded-md border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-2">How it works:</h3>
          <p className="mb-2">
            This solver uses the <span className="font-semibold">Backtracking Algorithm</span>, 
            a depth-first search technique where we:
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Find an empty cell in the puzzle</li>
            <li>Try placing digits 1-9 in the cell</li>
            <li>Check if the digit is valid in the current position (row, column, and 3x3 box)</li>
            <li>If valid, recursively try to solve the rest of the puzzle</li>
            <li>If we reach a point where we can't place any digit, we backtrack to previous cells and try different values</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Index;
