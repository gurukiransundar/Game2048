import { TILE_COLORS } from '../constants/gameConstants';
import './Tile.css';

const Tile = ({ value, isNew, isMerged, tileSize }) => {
  const backgroundColor = TILE_COLORS[value] || TILE_COLORS.default;
  const fontSize = value >= 1024 ? `${tileSize * 0.35}px` : value >= 128 ? `${tileSize * 0.45}px` : `${tileSize * 0.55}px`;
  const textColor = value >= 8 ? '#f9f6f2' : '#776e65';

  const tileClasses = `tile ${isNew ? 'tile-new' : ''} ${isMerged ? 'tile-merged' : ''}`;

  return (
    <div 
      className={tileClasses}
      style={{ 
        backgroundColor,
        color: textColor,
        fontSize,
        width: `${tileSize}px`,
        height: `${tileSize}px`
      }}
    >
      {value !== 0 && value}
    </div>
  );
};

export default Tile;