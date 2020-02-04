# sudokuSolverP5
This is a simple sudoku solver where it will solve the sudoku using rules (sole candidate, naked subset, etc).

this uses p5.clickable.js library from lartu.net to show the buttons.

the puzzles (sudoku examples) are stored in sketch.js and will be loaded with loadPuzzle() via createNextPuzzleButton().

solving is done by looping the puzzle through several sudoku solving method, and if it is not done yet it will repeat until
maximum number of loops has achieved.
