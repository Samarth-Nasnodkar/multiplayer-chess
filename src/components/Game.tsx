import React from 'react';
import '../styles/Game.css';
import BoardTile from './BoardTile';
import pieceSide from '../helpers/pieceSide';
import gameStatus from '../helpers/gameStatus';
import castlingState from '../helpers/castlingState';

interface GameProps {
  board: string[][],
  utils: {
    getColName: (index: number) => string,
    getRowName: (index: number) => string,
    getPieceSide: (piece: string) => pieceSide,
    getPieceName: (id: number) => string,
    rotatePlayingSide: () => void,
    getPlayingSide: () => pieceSide,
    getGameStaus: () => gameStatus,
    getCastlingState: (side: pieceSide) => castlingState,  
  }
};

const Game = (props: GameProps) => {
  return (
    <div className='game'>
      <div className="board">  
        {props.board.map((row, i) => {
          let light = i % 2 === 0;
          return row.map((_, j) => {
            const elemId = i * 8 + j;
            light = !light;
            return <BoardTile board={props.board} id={elemId} utils={props.utils} key={elemId} bg={light}></BoardTile>
          });
        })}
      </div>
    </div>
  );
}

export default Game;