import React, { useState } from 'react';
import './App.css';
import Game from './components/Game';
import { closestCorners, DndContext, DragEndEvent } from '@dnd-kit/core';
import checkMoveValidity from './helpers/moveValidity';
import pieceSide from './helpers/pieceSide';

function App() {
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

  const getColName = (index: number) => {
    return 'abcdefgh'[index];
  };

  const getRowName = (index: number) => {
    return (8 - index).toString();
  }

  const getPieceSide = (piece: string) => {
    return piece[1] === 'w' ? pieceSide.white : pieceSide.black;
  }

  const getPieceName = (id: number) => {
    const i = Math.floor(id / 8);
    const j = id % 8;
    return board[i][j];
  };

  const utils = {
    getColName,
    getRowName,
    getPieceSide,
    getPieceName,
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if (active.id === over?.id) return;
    
    const isValidMove = checkMoveValidity(board, active.data.current?.value, over?.data.current?.value) && 
                        active?.data.current?.value.side !== getPieceSide(getPieceName(over?.id as number));

    if (!isValidMove) return;
    
    const activeIndex = Number(active.id);
    const overIndex = Number(over?.id);

    const newBoard = [...board];
    const ai = Math.floor(activeIndex / 8);
    const aj = activeIndex % 8;
    const oi = Math.floor(overIndex / 8);
    const oj = overIndex % 8;
    const piece = newBoard[ai][aj];
    newBoard[ai][aj] = '.';
    newBoard[oi][oj] = piece;
    setBoard(newBoard);
  };
  return (
    <div className="app">
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <Game board={board} utils={utils}/>
      </DndContext>
    </div>
  );
}

export default App;
