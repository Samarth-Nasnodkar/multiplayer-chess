import pieceData from "./pieceData";
import tileData from "./tileData";

const checkMoveValidity = (board: string[][], active: pieceData, over: tileData) => {
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

export default checkMoveValidity;