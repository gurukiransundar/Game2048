export const moveLeft = (board) => {
    let newBoard = [];
    let scoreGained = 0;
    let moved = false;
    let mergedPositions = [];
  
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
      const { newRow, score, hasMoved, merged } = slideAndMergeRow(board[rowIndex]);
      newBoard.push(newRow);
      scoreGained += score;
      if (hasMoved) moved = true;
      
      merged.forEach(colIndex => {
        mergedPositions.push({ row: rowIndex, col: colIndex });
      });
    }
  
    return { board: newBoard, score: scoreGained, moved, mergedPositions };
  };
  
  export const moveRight = (board) => {
    let newBoard = [];
    let scoreGained = 0;
    let moved = false;
    let mergedPositions = [];
  
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
      const reversed = [...board[rowIndex]].reverse();
      const { newRow, score, hasMoved, merged } = slideAndMergeRow(reversed);
      newBoard.push(newRow.reverse());
      scoreGained += score;
      if (hasMoved) moved = true;
      
      merged.forEach(colIndex => {
        mergedPositions.push({ row: rowIndex, col: board[rowIndex].length - 1 - colIndex });
      });
    }
  
    return { board: newBoard, score: scoreGained, moved, mergedPositions };
  };
  
  export const moveUp = (board) => {
    const transposed = transposeBoard(board);
    const { board: movedBoard, score, moved, mergedPositions } = moveLeft(transposed);
    
    const finalMergedPositions = mergedPositions.map(pos => ({
      row: pos.col,
      col: pos.row
    }));
    
    return { board: transposeBoard(movedBoard), score, moved, mergedPositions: finalMergedPositions };
  };
  
  export const moveDown = (board) => {
    const transposed = transposeBoard(board);
    const { board: movedBoard, score, moved, mergedPositions } = moveRight(transposed);
    
    const finalMergedPositions = mergedPositions.map(pos => ({
      row: pos.col,
      col: pos.row
    }));
    
    return { board: transposeBoard(movedBoard), score, moved, mergedPositions: finalMergedPositions };
  };
  
  const transposeBoard = (board) => {
    return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
  };
  
  const slideAndMergeRow = (row) => {
    let newRow = row.filter(cell => cell !== 0);
    let score = 0;
    let hasMoved = false;
    let merged = [];
  
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] = newRow[i] * 2;
        score += newRow[i];
        newRow.splice(i + 1, 1);
        hasMoved = true;
        merged.push(i);
      }
    }
  
    while (newRow.length < row.length) {
      newRow.push(0);
    }
  
    if (JSON.stringify(row) !== JSON.stringify(newRow)) {
      hasMoved = true;
    }
  
    return { newRow, score, hasMoved, merged };
  };