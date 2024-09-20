import React, { useEffect, useState } from 'react';
import '../styles/BoardTile.css';
import { useDroppable } from '@dnd-kit/core';
import BoardPiece from './BoardPiece';
import tileData from '../helpers/tileData';
import checkMoveValidity from '../helpers/moveValidity';
import pieceSide from '../helpers/pieceSide';

interface BoardTileProps {
  id: number,
  bg: boolean,
  board: string[][],
  utils: {
    getColName: (index: number) => string,
    getRowName: (index: number) => string,
    getPieceSide: (piece: string) => pieceSide,
    getPieceName: (id: number) => string,
    rotatePlayingSide: () => void,
    getPlayingSide: () => pieceSide,
  }
};

const BoardTile = (props: BoardTileProps) => {
  let [tilePiece, setTilePiece] = useState('');
  const overData = {
    pieceType: props.utils.getPieceName(props.id),
    position: {
      row: 8 - Math.floor(props.id / 8),
      col: 1 + (props.id % 8),
    }
  } as tileData;
  const {active, isOver, setNodeRef} = useDroppable({
    id: props.id.toString(),
    data: {
      value: overData,
    }
  });
  const getPieceType = (pieceName: string) => {
    if (pieceName[0] === 'P') {
      return 'pawn';
    } else if (pieceName[0] === 'R') {
      return 'rook';
    } else if (pieceName[0] === 'N') {
      return 'knight';
    } else if (pieceName[0] === 'B') {
      return 'bishop';
    } else if (pieceName[0] === 'K') {
      return 'king';
    } else if (pieceName[0] === 'Q') {
      return 'queen';
    }
    return '';
  };
  useEffect(() => {
    const pieceName = props.utils.getPieceName(props.id);
    if (pieceName === '.') return;
    let pname = getPieceType(pieceName);
    pname += '-' + pieceName[1];
    const importedIcon = import(`../assets/images/pieces/${pname}.svg`);
    importedIcon.then((icon) => {
      setTilePiece(icon.default);
    });
  }, [props]);
  const bgColor = props.bg ? '#697565': '#ECDFCC';
  const getTileHighlightColor = () => {
    const p1 = active?.data.current?.value.position;
    const p2 = overData.position;
    if (p1.row === p2.row && p1.col === p2.col) return undefined;
    const isValidMove = (
      props.utils.getPlayingSide() === active?.data.current?.value.side 
      && 
      checkMoveValidity(props.board, active?.data.current?.value, overData) 
      && 
      active?.data.current?.value.side !== props.utils.getPieceSide(props.utils.getPieceName(props.id))
    );
    return '4px solid ' + (isValidMove ? 'green' : 'red');
  };
  const style = {
    border: isOver ? getTileHighlightColor() : undefined,
    backgroundColor: bgColor,
  };
  return (
    <div ref={setNodeRef} className='board-tile' style={style}>
      {props.utils.getPieceName(props.id) !== '.' && <BoardPiece id={props.id.toString()} pieceType={getPieceType(props.utils.getPieceName(props.id))} utils={props.utils} pieceSrc={tilePiece}/>}
    </div>
  );
}

export default BoardTile;