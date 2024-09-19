import React, { useState } from 'react';
import './App.css';
import Game from './components/Game';
import { closestCorners, DndContext, DragEndEvent } from '@dnd-kit/core';

const checkMoveValidity = (active: any, over: any) => {
  if (active.pieceType === '') return false;
  if (over === undefined) return false;
  if (active.position.row === over.position.row && active.position.col === over.position.col) return false;
  
  if (active.pieceType === 'pawn') {
    if (active.side === 'white') {
      if (active.position.row === 2) {
        return (active.position.row + 2 === over.position.row || active.position.row + 1 === over.position.row) && active.position.col === over.position.col;
      }
      return active.position.col === over.position.col && active.position.row + 1 === over.position.row;
    } else {
      if (active.position.row === 7) {
        return (active.position.row - 2 === over.position.row || active.position.row - 1 === over.position.row) && active.position.col === over.position.col;
      }
      return active.position.col === over.position.col && active.position.row - 1 === over.position.row;
    }
  } else if (active.pieceType === 'rook') {
    return active.position.row === over.position.row || active.position.col === over.position.col;
  } else if (active.pieceType === 'bishop') {
    return Math.abs(active.position.row - over.position.row) === Math.abs(active.position.col - over.position.col);
  } else if (active.pieceType === 'queen') {
    return (active.position.row === over.position.row || active.position.col === over.position.col) || (Math.abs(active.position.row - over.position.row) === Math.abs(active.position.col - over.position.col));
  } else if (active.pieceType === 'king') {
    return Math.abs(active.position.row - over.position.row) <= 1 && Math.abs(active.position.col - over.position.col) <= 1;
  } else if (active.pieceType === 'knight') {
    return (Math.abs(active.position.row - over.position.row) === 2 && Math.abs(active.position.col - over.position.col) === 1) 
    || (Math.abs(active.position.row - over.position.row) === 1 && Math.abs(active.position.col - over.position.col) === 2);
  }

  return false;
}

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
    return piece[1] === 'w' ? 'white' : 'black';
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
    
    const isValidMove = checkMoveValidity(active.data.current, over?.data.current);

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
