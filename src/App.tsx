import React, { useRef, useState } from 'react';
import './App.css';
import Game from './components/Game';
import { closestCorners, DndContext, DragEndEvent } from '@dnd-kit/core';
import checkMoveValidity from './helpers/moveValidity';
import pieceSide from './helpers/pieceSide';
import Timer from './components/Timer';

import whiteQueenImg from './assets/images/pieces/queen-w.svg';
import whiteBishopImg from './assets/images/pieces/bishop-w.svg';
import whiteRookImg from './assets/images/pieces/rook-w.svg';
import whiteKnightImg from './assets/images/pieces/knight-w.svg';

import blackQueenImg from './assets/images/pieces/queen-b.svg';
import blackBishopImg from './assets/images/pieces/bishop-b.svg';
import blackRookImg from './assets/images/pieces/rook-b.svg';
import blackKnightImg from './assets/images/pieces/knight-b.svg';


interface TimerHandle {
  toggleTimer: () => void;
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

  const [playingSide, setPlayingSide] = useState(pieceSide.white);
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const opponentTimerRef = useRef<TimerHandle>(null);
  const selfTimerRef = useRef<TimerHandle>(null);

  const rotatePlayingSide = () => {
    if (playingSide === pieceSide.white) {
      setPlayingSide(pieceSide.black);
    } else {
      setPlayingSide(pieceSide.white);
    }
    selfTimerRef.current?.toggleTimer();
    opponentTimerRef.current?.toggleTimer();
    console.log("rotated side.");
  };

  const getPlayingSide = () => {
    return playingSide;
  }

  const getColName = (index: number) => {
    return 'abcdefgh'[index];
  };

  const getRowName = (index: number) => {
    return (8 - index).toString();
  }

  const getPieceSide = (piece: string) => {
    if (piece === '.') return pieceSide.empty;
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
    rotatePlayingSide,
    getPlayingSide,
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if (active.id === over?.id) return;
    
    const isValidMove = (
      getPlayingSide() === active?.data.current?.value.side 
      &&
      checkMoveValidity(board, active.data.current?.value, over?.data.current?.value) 
      && 
      active?.data.current?.value.side !== getPieceSide(getPieceName(over?.id as number))
    );

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

    if (oi === 0 && piece[0] === 'P') {
      setShowPromoPopup(true);
    } else if (oi === 7 && piece[0] === 'P') {
      setShowPromoPopup(true);
    } else {
      rotatePlayingSide();
    }
  };

  const choosePromotion = (piece: string) => {
    setShowPromoPopup(false);
    rotatePlayingSide();
  };

  return (
    <div className="app">
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <Game board={board} utils={utils}/>
      </DndContext>
      <div className="timers">
        <div className="timer-opponent">
          <Timer ref={opponentTimerRef} minutes={10} seconds={0} running={false}/>
        </div>
        <div className="popup-wrapper" style={{display: showPromoPopup ? undefined : 'none'}}>
          <div className="promo-popup-header">
            <h1>Promote your pawn</h1>
          </div>
          <div className="promo-popup">
            <div className="promo-popup-content">
              <button className="promo-popup-button" onClick={() => choosePromotion('queen')}>
                <img src={whiteQueenImg} alt="queen"/>
              </button>
              <button className="promo-popup-button" onClick={() => choosePromotion('rook')}>
                <img src={whiteRookImg} alt="rook"/>
              </button>
              <button className="promo-popup-button" onClick={() => choosePromotion('bishop')}>
                <img src={whiteBishopImg} alt="bishop"/>
              </button>
              <button className="promo-popup-button" onClick={() => choosePromotion('knight')}>
                <img src={whiteKnightImg} alt="knight"/>
              </button>
            </div>
          </div>
        </div>
        <div className="timer-self">
          <Timer ref={selfTimerRef} minutes={10} seconds={0} running={true}/>
        </div>
      </div>
    </div>
  );
}

export default App;
