import { useState, useEffect, useRef } from 'react';
import GameBoard from './components/GameBoard';
import { initializeBoard, addRandomTile, canMove, hasWon } from './utils/boardUtils';
import { moveLeft, moveRight, moveUp, moveDown } from './utils/gameLogic';
import './App.css';

function App() {
  const [gridSize, setGridSize] = useState(4);
  const [board, setBoard] = useState(() => initializeBoard(4));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('2048-best-score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameStatus, setGameStatus] = useState('playing');
  const [animationState, setAnimationState] = useState({ newTile: null, mergedTiles: [] });
  const touchStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best-score', score.toString());
    }
  }, [score, bestScore]);

  const handleRestart = () => {
    setBoard(initializeBoard(gridSize));
    setScore(0);
    setGameStatus('playing');
    setAnimationState({ newTile: null, mergedTiles: [] });
  };

  const handleGridSizeChange = (newSize) => {
    setGridSize(newSize);
    setBoard(initializeBoard(newSize));
    setScore(0);
    setGameStatus('playing');
    setAnimationState({ newTile: null, mergedTiles: [] });
  };

  const handleContinue = () => {
    setGameStatus('continue');
  };

  const handleMove = (moveFunction) => {
    if (gameStatus === 'lost') return;

    const { board: newBoard, score: scoreGained, moved, mergedPositions } = moveFunction(board);
    
    if (moved) {
      const { board: boardWithNewTile, newTilePosition } = addRandomTile(newBoard);
      setBoard(boardWithNewTile);
      setScore(prevScore => prevScore + scoreGained);
      setAnimationState({ newTile: newTilePosition, mergedTiles: mergedPositions });

      setTimeout(() => {
        setAnimationState({ newTile: null, mergedTiles: [] });
      }, 200);

      if (gameStatus === 'playing' && hasWon(boardWithNewTile)) {
        setGameStatus('won');
      } else if (!canMove(boardWithNewTile)) {
        setGameStatus('lost');
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleMove(moveLeft);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleMove(moveRight);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleMove(moveUp);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleMove(moveDown);
          break;
        default:
          break;
      }
    };

    const handleTouchStart = (e) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    const handleTouchEnd = (e) => {
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };

      const deltaX = touchEnd.x - touchStartRef.current.x;
      const deltaY = touchEnd.y - touchStartRef.current.y;
      const minSwipeDistance = 30;

      if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
        return;
      }

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          handleMove(moveRight);
        } else {
          handleMove(moveLeft);
        }
      } else {
        if (deltaY > 0) {
          handleMove(moveDown);
        } else {
          handleMove(moveUp);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [board, score, gameStatus]);

  return (
    <div className="app">
      <div className="game-container">
        <header className="game-header">
          <h1>2048</h1>
          <div className="header-right">
            <div className="score-container">
              <div className="score-label">SCORE</div>
              <div className="score-value">{score}</div>
            </div>
            <div className="score-container">
              <div className="score-label">BEST</div>
              <div className="score-value">{bestScore}</div>
            </div>
            <button className="restart-button" onClick={handleRestart}>
              New Game
            </button>
          </div>
        </header>
        
        <div className="size-selector">
          <span className="size-label">Board Size:</span>
          {[3, 4, 5, 6].map(size => (
            <button
              key={size}
              className={`size-button ${gridSize === size ? 'active' : ''}`}
              onClick={() => handleGridSizeChange(size)}
            >
              {size}x{size}
            </button>
          ))}
        </div>

        <GameBoard board={board} animationState={animationState} />

        <div className="instructions">
          <p className="instructions-title">How to play:</p>
          <p className="instructions-text">
            Use <strong>arrow keys</strong> or <strong>swipe</strong> to move tiles. 
            When two tiles with the same number touch, they merge into one!
          </p>
        </div>

        {gameStatus === 'won' && (
          <div className="game-message">
            <div className="message-content">
              <p>You Win!</p>
              <div className="message-buttons">
                <button className="message-button" onClick={handleContinue}>
                  Keep Playing
                </button>
                <button className="message-button" onClick={handleRestart}>
                  New Game
                </button>
              </div>
            </div>
          </div>
        )}
        {gameStatus === 'lost' && (
          <div className="game-message">
            <div className="message-content">
              <p>Game Over!</p>
              <button className="message-button" onClick={handleRestart}>
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;