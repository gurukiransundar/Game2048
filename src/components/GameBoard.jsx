import Tile from './Tile';
import './GameBoard.css';

const GameBoard = ({ board, animationState }) => {
  const { newTile, mergedTiles } = animationState;
  const gridSize = board.length;
  const tileSize = gridSize <= 4 ? 100 : gridSize === 5 ? 80 : 65;
  const gap = 10;

  const isTileNew = (rowIndex, colIndex) => {
    return newTile && newTile.row === rowIndex && newTile.col === colIndex;
  };

  const isTileMerged = (rowIndex, colIndex) => {
    return mergedTiles.some(pos => pos.row === rowIndex && pos.col === colIndex);
  };

  return (
    <div className="game-board" style={{ padding: gap }}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row" style={{ gap: `${gap}px`, marginBottom: rowIndex === board.length - 1 ? 0 : `${gap}px` }}>
          {row.map((value, colIndex) => (
            <Tile 
              key={`${rowIndex}-${colIndex}`} 
              value={value}
              isNew={isTileNew(rowIndex, colIndex)}
              isMerged={isTileMerged(rowIndex, colIndex)}
              tileSize={tileSize}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;