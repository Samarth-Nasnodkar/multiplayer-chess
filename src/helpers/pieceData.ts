import pieceSide from "./pieceSide";

interface pieceData {
  position: {
    row: number,
    col: number,
  },
  side: pieceSide,
  pieceType: string,
};

export default pieceData;