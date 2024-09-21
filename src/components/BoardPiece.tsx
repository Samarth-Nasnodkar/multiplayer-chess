import React from 'react';
import '../styles/BoardPiece.css';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import pieceData from '../helpers/pieceData';
import pieceSide from '../helpers/pieceSide';
import gameStatus from '../helpers/gameStatus';

interface BoardPieceProps {
  id: string,
  pieceSrc: string,
  pieceType: string,
  utils: {
    getColName: (index: number) => string,
    getRowName: (index: number) => string,
    getPieceSide: (piece: string) => pieceSide,
    getPieceName: (id: number) => string,
    rotatePlayingSide: () => void,
    getPlayingSide: () => pieceSide,
    getGameStaus: () => gameStatus,
  }
};

const BoardPiece = (props: BoardPieceProps) => {
  const {attributes, listeners, transform, setNodeRef} = useDraggable({
    id: props.id,
    data: {
      value: {
        position: {
          row: 8 - Math.floor(Number(props.id) / 8), 
          col: 1 + (Number(props.id) % 8),
        },
        pieceType: props.pieceType,
        side: props.utils.getPieceSide(props.utils.getPieceName(Number(props.id))),
      } as pieceData,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div className='board-piece' style={style} ref={setNodeRef} {...attributes} {...listeners}>
      <img alt='piece' src={props.pieceSrc} />
    </div>
  );
}

export default BoardPiece;