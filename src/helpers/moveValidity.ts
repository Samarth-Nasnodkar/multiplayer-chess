import isChecked from "./check";
import pieceData from "./pieceData";
import pieceSide from "./pieceSide";
import tileData from "./tileData";

const checkDiagMoveValidity = (board: string[][], rowFrom: number, colFrom: number, rowTo: number, colTo: number) => {
  let rowDelta = (rowTo > rowFrom) ? 1 : -1;
  let colDelta = (colTo > colFrom) ? 1: -1;

  let currRow = rowFrom + rowDelta;
  let currCol = colFrom + colDelta;
  while (currRow !== rowTo && currCol !== colTo) {
    if (board[8 - currRow][currCol - 1] !== '.') return false;
    currRow += rowDelta;
    currCol += colDelta;
  }
  return true;
};

const checkHoriMoveValidity = (board: string[][], row: number, colFrom: number, colTo: number) => {
  let colDelta = (colTo > colFrom) ? 1: -1;

  let currCol = colFrom + colDelta;
  while (currCol !== colTo) {
    if (board[8 - row][currCol - 1] !== '.') return false;
    currCol += colDelta;
  }
  return true;
};

const checkVertiMoveValidity = (board: string[][], col: number, rowFrom: number, rowTo: number) => {
  let rowDelta = (rowTo > rowFrom) ? 1: -1;

  let currRow = rowFrom + rowDelta;
  while (currRow !== rowTo) {
    if (board[8 - currRow][col - 1] !== '.') return false;
    currRow += rowDelta;
  }
  return true;
};

const checkMoveValidity = (board: string[][], active: pieceData, over: tileData) => {
  if (active.pieceType === '') return false;
  if (over === undefined) return false;
  if (active.position.row === over.position.row && active.position.col === over.position.col) return false;

  // const activeData = board[8 - active.position.row][active.position.col - 1];
  const overData = board[8 - over.position.row][over.position.col - 1];

  if (active.pieceType === 'pawn') {
    if (active.side === pieceSide.white) {
      if (overData !== '.') {
        return over.position.row === active.position.row + 1 && Math.abs(active.position.col - over.position.col) === 1;
      }
      if (active.position.row === 2) {
        return (
          active.position.row + 2 === over.position.row 
          || 
          active.position.row + 1 === over.position.row
        ) && active.position.col === over.position.col;
      }
      return active.position.col === over.position.col 
              && active.position.row + 1 === over.position.row;
    }
    if (overData !== '.') {
      return over.position.row === active.position.row - 1 && Math.abs(active.position.col - over.position.col) === 1;
    }
    if (active.position.row === 7) {
      return (
        active.position.row - 2 === over.position.row 
        || 
        active.position.row - 1 === over.position.row
      ) && active.position.col === over.position.col;
    }
    return active.position.col === over.position.col 
            && active.position.row - 1 === over.position.row;
  } else if (active.pieceType === 'rook') {
    return (
      active.position.row === over.position.row 
      && 
      checkHoriMoveValidity(board, active.position.row, active.position.col, over.position.col)
    ) || (
      active.position.col === over.position.col 
      && 
      checkVertiMoveValidity(board, active.position.col, active.position.row, over.position.row)
    );
  } else if (active.pieceType === 'bishop') {
    return (
      Math.abs(active.position.row - over.position.row) === Math.abs(active.position.col - over.position.col)
      &&
      checkDiagMoveValidity(board, active.position.row, active.position.col, over.position.row, over.position.col)
    );
  } else if (active.pieceType === 'queen') {
    return (
      (
        active.position.row === over.position.row 
        && 
        checkHoriMoveValidity(board, active.position.row, active.position.col, over.position.col)
      )
      || 
      (
        active.position.col === over.position.col
        &&
        checkVertiMoveValidity(board, active.position.col, active.position.row, over.position.row)
      )
    ) || (
      Math.abs(active.position.row - over.position.row) === Math.abs(active.position.col - over.position.col)
      &&
      checkDiagMoveValidity(board, active.position.row, active.position.col, over.position.row, over.position.col)
    );
  } else if (active.pieceType === 'king') {
    return (
      Math.abs(active.position.row - over.position.row) <= 1 
      && 
      Math.abs(active.position.col - over.position.col) <= 1
      &&
      !isChecked(8 - over.position.row, over.position.col - 1, board, active.side)
    );
  } else if (active.pieceType === 'knight') {
    return (
      Math.abs(active.position.row - over.position.row) === 2 
      && 
      Math.abs(active.position.col - over.position.col) === 1
    ) 
    || 
    (
      Math.abs(active.position.row - over.position.row) === 1 
      && 
      Math.abs(active.position.col - over.position.col) === 2
    );
  }

  return false;
}

export default checkMoveValidity;