import React from 'react';
import { useState } from 'react';
import '../styles/Game.css';
import Board from '../assets/images/board.svg';
import BoardTile from './BoardTile';

const Game = () => {
  const [board, setBoard] = useState([
    ['Rb', 'Nb', 'Bb', 'Qb', 'Kb', 'Bb', 'Nb', 'Rb'],
    ['Pb', 'Pb', 'Pb', 'Pb', 'Pb', 'Pb', 'Pb', 'Pb'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['Pw', 'Pw', 'Pw', 'Pw', 'Pw', 'Pw', 'Pw', 'Pw'],
    ['Rw', 'Nw', 'Bw', 'Qw', 'Kw', 'Bw', 'Nw', 'Rw'],
  ]);
  return (
    <div className='game'>
      <div className="board">  
        {board.map((row, i) => {
          let light = i % 2 === 0;
          return row.map((piece, j) => {
            light = !light;
            return <BoardTile pieceName={piece} key={i * 8 + j} bg={light}></BoardTile>
          });
        })}
      </div>
    </div>
  );
}

export default Game;