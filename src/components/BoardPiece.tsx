import React from 'react';
import '../styles/BoardPiece.css';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface BoardPieceProps {
  id: string,
  pieceSrc: string,
};

const BoardPiece = (props: BoardPieceProps) => {
  const {attributes, listeners, transform, setNodeRef} = useDraggable({
    id: props.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };
  console.log(props.pieceSrc);
  return (
    <div className='board-piece' style={style} ref={setNodeRef} {...attributes} {...listeners}>
      <img alt='piece' src={props.pieceSrc} />
    </div>
  );
}

export default BoardPiece;