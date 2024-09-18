import React, { useEffect, useState } from 'react';
import '../styles/BoardTile.css';

interface BoardTileProps {
  pieceName: string,
  bg: boolean,
};

const BoardTile = (props: BoardTileProps) => {
  let [tilePiece, setTilePiece] = useState('');
  useEffect(() => {
    if (props.pieceName === '.') return;
    let pname = '';
    if (props.pieceName[0] == 'P') {
      pname = 'pawn';
    } else if (props.pieceName[0] == 'R') {
      pname = 'rook';
    } else if (props.pieceName[0] == 'N') {
      pname = 'knight';
    } else if (props.pieceName[0] == 'B') {
      pname = 'bishop';
    } else if (props.pieceName[0] == 'K') {
      pname = 'king';
    } else if (props.pieceName[0] == 'Q') {
      pname = 'queen';
    }
    pname += '-' + props.pieceName[1];
    const importedIcon = import(`../assets/images/pieces/${pname}.svg`);
    importedIcon.then((icon) => {
      setTilePiece(icon.default);
    });
  }, []);
  const bgColor = props.bg ? '#779556': '#ebecd0';
  return (
    <div className='board-tile' style={{backgroundColor: bgColor}}>
      {props.pieceName !== '.' && <img alt='piece' src={tilePiece}></img>}
    </div>
  );
}

export default BoardTile;