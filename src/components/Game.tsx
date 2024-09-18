import React from 'react';
import { useState } from 'react';
import '../styles/Game.css';
import Board from '../assets/images/board.svg';
import Pawn from '../assets/images/pieces/pawn-w.svg';

const Game = () => {
  const [board, setBoard] = useState([
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ]);
  return (
    <div className='game'>
      <div className="board">
        <img src={Board} alt='board'/>
      </div>
      <div className="piece">
        <img src={Pawn} alt='board'/>
      </div>
    </div>
  );
}

export default Game;