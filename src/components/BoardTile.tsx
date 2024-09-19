import React, { useEffect, useState } from 'react';
import '../styles/BoardTile.css';
import { useDroppable } from '@dnd-kit/core';
import BoardPiece from './BoardPiece';

interface BoardTileProps {
  id: number,
  getPieceName: (id: number) => string,
  bg: boolean,
};

const BoardTile = (props: BoardTileProps) => {
  let [tilePiece, setTilePiece] = useState('');
  const {isOver, setNodeRef} = useDroppable({
    id: props.id.toString(),
  });
  useEffect(() => {
    const pieceName = props.getPieceName(props.id);
    if (pieceName === '.') return;
    let pname = '';
    if (pieceName[0] === 'P') {
      pname = 'pawn';
    } else if (pieceName[0] === 'R') {
      pname = 'rook';
    } else if (pieceName[0] === 'N') {
      pname = 'knight';
    } else if (pieceName[0] === 'B') {
      pname = 'bishop';
    } else if (pieceName[0] === 'K') {
      pname = 'king';
    } else if (pieceName[0] === 'Q') {
      pname = 'queen';
    }
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
      {props.getPieceName(props.id) !== '.' && <BoardPiece id={props.id.toString()} pieceSrc={tilePiece}/>}
    </div>
  );
}

export default BoardTile;