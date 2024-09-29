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
import gameStatus from './helpers/gameStatus';
import castlingState from './helpers/castlingState';
import checkCastlingValidity from './helpers/castlingValidity';


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

  const [whiteCastlingState, setWhiteCastlingState] = useState(castlingState.both);
  const [blackCastlingState, setBlackCastlingState] = useState(castlingState.both);

  const [firstMovePlayed, setFirstMovePlayed] = useState(false);

  const [playingSide, setPlayingSide] = useState(pieceSide.white);
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [pawnPromotionLocation, setPawnPromotionLocation] = useState({row: -1, col: -1});
  const [status, setStatus] = useState(gameStatus.notStarted);
  const opponentTimerRef = useRef<TimerHandle>(null);
  const selfTimerRef = useRef<TimerHandle>(null);

  const rotatePlayingSide = (onlyOpponent = false) => {
    if (playingSide === pieceSide.white) {
      setPlayingSide(pieceSide.black);
    } else {
      setPlayingSide(pieceSide.white);
    }
    if (!onlyOpponent) selfTimerRef.current?.toggleTimer();
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

  const getGameStaus = () => {
    return status;
  }

  const getPieceName = (id: number) => {
    const i = Math.floor(id / 8);
    const j = id % 8;
    return board[i][j];
  };

  const getCastlingState = (side: pieceSide) => {
    return side === pieceSide.white ? whiteCastlingState : blackCastlingState;
  }

  const updateCastlingState = (side: pieceSide, state: castlingState) => {
    if (side === pieceSide.white) {
      setWhiteCastlingState(state);
    } else {
      setBlackCastlingState(state);
    }
  }

  const discardCastlingState = (side: pieceSide, state: castlingState) => {
    console.log('discarding castling state');
    if (state === castlingState.both) {
      updateCastlingState(side, castlingState.none);
    } else if (state === castlingState.kingSide) {
      if (whiteCastlingState === castlingState.both) {
        updateCastlingState(side, castlingState.queenSide);
      } else {
        updateCastlingState(side, castlingState.none);
      }
    } else if (state === castlingState.queenSide) {
      if (whiteCastlingState === castlingState.both) {
        updateCastlingState(side, castlingState.kingSide);
      } else {
        updateCastlingState(side, castlingState.none);
      }
    }
  }

  const utils = {
    getColName,
    getRowName,
    getPieceSide,
    getPieceName,
    rotatePlayingSide,
    getPlayingSide,
    getGameStaus,
    getCastlingState,
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if (active.id === over?.id) return;
    
    const legalMove = checkMoveValidity(board, active.data.current?.value, over?.data.current?.value);
    const castleMove = checkCastlingValidity(board, active.data.current?.value, over?.data.current?.value, whiteCastlingState, blackCastlingState);
    const isValidMove = (
      (
        getGameStaus() === gameStatus.running
        ||
        (
          getGameStaus() === gameStatus.notStarted 
          && 
          !firstMovePlayed
        )
      )
      &&
      getPlayingSide() === active?.data.current?.value.side 
      &&
      (
        legalMove || castleMove
      )
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

    if (castleMove) {
      if (oi === 7) {
        if (oj === 6) {
          discardCastlingState(pieceSide.white, castlingState.both);
          newBoard[7][5] = 'Rw';
          newBoard[7][7] = '.';
        } else if (oj === 2) {
          discardCastlingState(pieceSide.white, castlingState.both);
          newBoard[7][3] = 'Rw';
          newBoard[7][0] = '.';
        }
      } else if (oi === 0) {
        if (oj === 6) {
          discardCastlingState(pieceSide.black, castlingState.both);
          newBoard[0][5] = 'Rb';
          newBoard[0][7] = '.';
        } else if (oj === 2) {
          discardCastlingState(pieceSide.black, castlingState.both);
          newBoard[0][3] = 'Rb';
          newBoard[0][0] = '.';
        }
      } else {
        console.error('Invalid castle move');
      }
    }

    newBoard[ai][aj] = '.';
    newBoard[oi][oj] = piece;
    setBoard(newBoard);

    let onlyOpponent = false;
    if (!firstMovePlayed && getGameStaus() === gameStatus.notStarted) {
      setFirstMovePlayed(true);
      setStatus(gameStatus.running);
      onlyOpponent = true;
      // selfTimerRef.current?.toggleTimer();
    }

    if (ai === 0 && piece === 'Rb') {
      discardCastlingState(pieceSide.black, castlingState.queenSide);
    } else if (ai === 7 && piece === 'Rw') {
      discardCastlingState(pieceSide.white, castlingState.queenSide);
    } else if (ai === 0 && piece === 'Kb') {
      discardCastlingState(pieceSide.black, castlingState.both);
    } else if (ai === 7 && piece === 'Kw') {
      discardCastlingState(pieceSide.white, castlingState.both);
    } else if (ai === 0 && piece === 'Kb') {
      discardCastlingState(pieceSide.black, castlingState.both);
    } else if (ai === 7 && piece === 'Kw') {
      discardCastlingState(pieceSide.white, castlingState.both);
    }

    if (oi === 0 && piece[0] === 'P') {
      setPawnPromotionLocation({row: oi, col: oj});
      setShowPromoPopup(true);
      setStatus(gameStatus.paused);
    } else if (oi === 7 && piece[0] === 'P') {
      setPawnPromotionLocation({row: oi, col: oj});
      setShowPromoPopup(true);
      setStatus(gameStatus.paused);
    } else {
      rotatePlayingSide(onlyOpponent);
    }
  };

  const choosePromotion = (piece: string) => {
    if (pawnPromotionLocation.row === -1 || pawnPromotionLocation.col === -1) return;
    const newBoard = [...board];
    const row = pawnPromotionLocation.row;
    const col = pawnPromotionLocation.col;
    const side = playingSide === pieceSide.white ? 'w' : 'b';
    if (piece === 'knight') {
      newBoard[row][col] = 'N' + side;
    } else {
      newBoard[row][col] = piece[0].toUpperCase() + side;
    }
    setBoard(newBoard);
    setShowPromoPopup(false);
    setStatus(gameStatus.running);
    rotatePlayingSide();
  };

  const handleStart = () => {
    setStatus(gameStatus.running);
    selfTimerRef.current?.toggleTimer();
  };

  return (
    <div className="app">
      <div className="popup-wrapper" style={{display: showPromoPopup ? undefined : 'none', position: 'absolute', top: `${pawnPromotionLocation.row * 96 + 40}px`, left: `${pawnPromotionLocation.col * 96 + 60}px`, zIndex: 10, transform: 'translate(-50%, -50%)'}}>
        <div className="promo-popup">
          <div className="promo-popup-content">
            <button className="promo-popup-button" onClick={() => choosePromotion('queen')}>
              <img src={getPlayingSide() === pieceSide.white ? whiteQueenImg : blackQueenImg} alt="queen"/>
            </button>
            <button className="promo-popup-button" onClick={() => choosePromotion('rook')}>
              <img src={getPlayingSide() === pieceSide.white ? whiteRookImg : blackRookImg} alt="rook"/>
            </button>
            <button className="promo-popup-button" onClick={() => choosePromotion('bishop')}>
              <img src={getPlayingSide() === pieceSide.white ? whiteBishopImg : blackBishopImg} alt="bishop"/>
            </button>
            <button className="promo-popup-button" onClick={() => choosePromotion('knight')}>
              <img src={getPlayingSide() === pieceSide.white ? whiteKnightImg : blackKnightImg} alt="knight"/>
            </button>
          </div>
        </div>
      </div>
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <Game board={board} utils={utils}/>
      </DndContext>
      <div className="timers">
        <div className="timer-opponent">
          <Timer ref={opponentTimerRef} minutes={10} seconds={0} running={false}/>
        </div>
        <div className="control-wrapper">
          <div className="control-btns">
            {
            status === gameStatus.notStarted 
            &&
            <button className="control-btn" onClick={handleStart}>
              Start
            </button>
            }
            {
            status !== gameStatus.notStarted 
            &&
            <div className="stop-btns">
              <button className="control-btn">
                Draw
              </button>
              <button className="control-btn">
                Resign
              </button>
            </div>
            
            }  
          </div>
        </div>
        <div className="timer-self">
          <Timer ref={selfTimerRef} minutes={10} seconds={0} running={false}/>
        </div>
      </div>
    </div>
  );
}

export default App;
