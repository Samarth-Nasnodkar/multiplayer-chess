import React from 'react';
import '../styles/Game.css';
import BoardTile from './BoardTile';

interface GameProps {
  board: string[][],
  utils: {
    getColName: (index: number) => string,
    getRowName: (index: number) => string,
    getPieceSide: (piece: string) => string,
    getPieceName: (id: number) => string,
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