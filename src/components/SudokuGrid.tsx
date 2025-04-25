
import React from "react";
import { cn } from "@/lib/utils";

interface SudokuGridProps {
  board: string[][];
  isOriginal?: boolean;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({ board, isOriginal = false }) => {
  return (
    <div className="grid grid-cols-9 gap-[1px] bg-gray-300 p-[1px] w-full max-w-md mx-auto">
      {board.map((row, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          {row.map((cell, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className={cn(
                "aspect-square flex items-center justify-center bg-white",
                "text-lg font-medium border-0",
                // Add borders for 3x3 boxes
                (colIndex + 1) % 3 === 0 && colIndex < 8 && "border-r-2 border-r-gray-400",
                (rowIndex + 1) % 3 === 0 && rowIndex < 8 && "border-b-2 border-b-gray-400",
                // Style for original numbers vs solved numbers
                isOriginal && cell !== "." ? "text-blue-600 font-bold" : "text-gray-800",
                // Style for empty cells
                cell === "." && "text-transparent"
              )}
            >
              {cell === "." ? "." : cell}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SudokuGrid;
