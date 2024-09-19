import React, { useEffect, useState } from 'react';
import '../styles/BoardTile.css';
import { useDroppable } from '@dnd-kit/core';
import BoardPiece from './BoardPiece';

interface BoardTileProps {
  id: number,
  bg: boolean,
  utils: {
    getColName: (index: number) => string,
    getRowName: (index: number) => string,
    getPieceSide: (piece: string) => string,
    getPieceName: (id: number) => string,
  }
};

const BoardTile = (props: BoardTileProps) => {
  let [tilePiece, setTilePiece] = useState('');
  const {isOver, setNodeRef} = useDroppable({
    id: props.id.toString(),
    data: {
      pieceType: props.utils.getPieceName(props.id),
      position: {
        row: 8 - Math.floor(props.id / 8),
        col: props.id % 8,
      }
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
  const bgColor = props.bg ? '#779556': '#ebecd0';
  const style = {
    border: isOver ? '3px solid green' : undefined,
    backgroundColor: bgColor,
  };
  return (
    <div ref={setNodeRef} className='board-tile' style={style}>
      {props.utils.getPieceName(props.id) !== '.' && <BoardPiece id={props.id.toString()} pieceType={getPieceType(props.utils.getPieceName(props.id))} utils={props.utils} pieceSrc={tilePiece}/>}
    </div>
  );
}

export default BoardTile;