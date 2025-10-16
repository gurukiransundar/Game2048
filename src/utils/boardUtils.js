import { GRID_SIZE, TILE_VALUES, TILE_SPAWN_PROBABILITY, WIN_TILE } from '../constants/gameConstants';

export const createEmptyBoard = (size = GRID_SIZE) => {
  return Array(size).fill(null).map(() => Array(size).fill(0));
};

export const getEmptyCells = (board) => {
  const emptyCells = [];
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 0) {
        emptyCells.push({ row: rowIndex, col: colIndex });
      }
    });
  });
  return emptyCells;
};

export const addRandomTile = (board) => {
  const emptyCells = getEmptyCells(board);
  
  if (emptyCells.length === 0) {
    return { board, newTilePosition: null };
  }
  
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < TILE_SPAWN_PROBABILITY ? TILE_VALUES[0] : TILE_VALUES[1];
  
  const newBoard = board.map(row => [...row]);
  newBoard[randomCell.row][randomCell.col] = value;
  
  return { board: newBoard, newTilePosition: randomCell };
};

export const initializeBoard = (size = GRID_SIZE) => {
  let board = createEmptyBoard(size);
  const { board: board1 } = addRandomTile(board);
  const { board: board2 } = addRandomTile(board1);
  return board2;
};

export const canMove = (board) => {
  if (getEmptyCells(board).length > 0) {
    return true;
  }

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const current = board[row][col];
      
      if (col < board[row].length - 1 && current === board[row][col + 1]) {
        return true;
      }
      
      if (row < board.length - 1 && current === board[row + 1][col]) {
        return true;
      }
    }
  }

  return false;
};

export const hasWon = (board) => {
  for (let row of board) {
    for (let cell of row) {
      if (cell === WIN_TILE) {
        return true;
      }
    }
  }
  return false;
};