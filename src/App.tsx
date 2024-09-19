import React, { useState } from 'react';
import './App.css';
import Game from './components/Game';
import { closestCorners, DndContext, DragEndEvent } from '@dnd-kit/core';

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
  const getPieceName = (id: number) => {
    const i = Math.floor(id / 8);
    const j = id % 8;
    return board[i][j];
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if (active.id === over?.id) return;

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
    console.log(newBoard);
    setBoard(newBoard);
  };
  return (
    <div className="app">
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <Game board={board} getPieceName={getPieceName}/>
      </DndContext>
    </div>
  );
}

export default App;
