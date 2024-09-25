import castlingState from "./castlingState";
import isChecked from "./check";
import pieceData from "./pieceData";
import pieceSide from "./pieceSide";
import tileData from "./tileData";

const kingSideCastleAvailable = (pieceCastlingState: castlingState) => {
  return pieceCastlingState === castlingState.both || pieceCastlingState === castlingState.kingSide;
}

const queenSideCastleAvailable = (pieceCastlingState: castlingState) => {
  return pieceCastlingState === castlingState.both || pieceCastlingState === castlingState.queenSide;
}

const checkCastlingValidity = (
  board: string[][], 
  active: pieceData, 
  over: tileData, 
  whiteCastlingState: castlingState, 
  blackCastlingState: castlingState) => {
  if (active.pieceType !== 'king') return false;
  
  console.log('<------ Castling Validity ------>');
  console.log(active);
  console.log(over);
  const pieceCastlingState = active.side === pieceSide.white ? whiteCastlingState : blackCastlingState;
  if (pieceCastlingState === castlingState.none) return false;

  const castleRow = active.side === pieceSide.white ? 1 : 8;
  if (active.position.row !== castleRow || over.position.row !== castleRow) return false;
  
  console.log('in checkCastlingValidity');
  if (over.position.col === 7 && kingSideCastleAvailable(pieceCastlingState)) {
    console.log('in if');
    if (board[8 - castleRow][5] !== '.' || board[8 - castleRow][6] !== '.') return false;
    if (isChecked(8 - castleRow, active.position.col, board, active.side)) return false;
    if (isChecked(8 - castleRow, active.position.col + 1, board, active.side)) return false;
    return true;
  } else if (over.position.col === 3 && queenSideCastleAvailable(pieceCastlingState)) {
    if (board[8 - castleRow][1] !== '.' || board[8 - castleRow][2] !== '.' || board[8 - castleRow][3] !== '.') return false;
    if (isChecked(8 - castleRow, active.position.col - 2, board, active.side)) return false;
    if (isChecked(8 - castleRow, active.position.col - 3, board, active.side)) return false;
    return true;
  }
  console.log('out of if');
  return false;
}

export default checkCastlingValidity;