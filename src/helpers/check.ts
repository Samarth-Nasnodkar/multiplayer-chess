import pieceSide from "./pieceSide";

function checkRookAndQueen(row: number, col: number, board: string[][], suffix: string) {
  let i = row + 1;
  while (i < 8) {
    if (board[i][col] !== '.') {
      if (board[i][col] === 'R' + suffix || board[i][col] === 'Q' + suffix) return true;
      break;
    }
    ++i;
  }
  i = row - 1;
  while (i >= 0) {
    if (board[i][col] !== '.') {
      if (board[i][col] === 'R' + suffix || board[i][col] === 'Q' + suffix) return true;
      break;
    }
    --i;
  }
  i = col + 1;
  while (i < 8) {
    if (board[row][i] !== '.') {
      if (board[row][i] === 'R' + suffix || board[row][i] === 'Q' + suffix) return true;
      break;
    }
    ++i;
  }
  i = col - 1;
  while (i >= 0) {
    if (board[row][i] !== '.') {
      if (board[row][i] === 'R' + suffix || board[row][i] === 'Q' + suffix) return true;
      break;
    }
    --i;
  }
  return false;
}

function checkBishopAndQueen(row: number, col: number, board: string[][], suffix: string) {
  let i = row + 1;
  let j = col + 1;
  while (i < 8 && j < 8) {
    if (board[i][j] !== '.') {
      if (board[i][j] === 'B' + suffix || board[i][j] === 'Q' + suffix) return true;
      break;
    }
    ++i;
    ++j;
  }
  i = row + 1;
  j = col - 1;
  while (i < 8 && j >= 0) {
    if (board[i][j] !== '.') {
      if (board[i][j] === 'B' + suffix || board[i][j] === 'Q' + suffix) return true;
      break;
    }
    ++i;
    --j;
  }
  i = row - 1;
  j = col + 1;
  while (i >= 0 && j < 8) {
    if (board[i][j] !== '.') {
      if (board[i][j] === 'B' + suffix || board[i][j] === 'Q' + suffix) return true;
      break;
    }
    --i;
    ++j;
  }
  i = row - 1;
  j = col - 1;
  while (i >= 0 && j >= 0) {
    if (board[i][j] !== '.') {
      if (board[i][j] === 'B' + suffix || board[i][j] === 'Q' + suffix) return true;
      break;
    }
    --i;
    --j;
  }

  return false;
}

function checkKnight(row: number, col: number, board: string[][], suffix: string) {
  const moves = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2]
  ];

  for (let move of moves) {
    const i = row + move[0];
    const j = col + move[1];
    if (i >= 0 && i < 8 && j >= 0 && j < 8) {
      if (board[i][j] === 'N' + suffix) return true;
    }
  }

  return false;
}

function checkPawn(row: number, col: number, board: string[][], suffix: string) {
  if (suffix === 'w') {
    if (row + 1 < 8 && col - 1 >= 0 && board[row + 1][col - 1] === 'P' + suffix) return true;
    if (row + 1 < 8 && col + 1 < 8 && board[row + 1][col + 1] === 'P' + suffix) return true;
  } else {
    if (row - 1 >= 0 && col - 1 >= 0 && board[row - 1][col - 1] === 'P' + suffix) return true;
    if (row - 1 >= 0 && col + 1 < 8 && board[row - 1][col + 1] === 'P' + suffix) return true;
  }
  return false;
}

function isChecked(row: number, col: number, board: string[][], side: pieceSide) {
  const suffix = side === pieceSide.white ? 'b' : 'w';
  // Check for Rooks & Queen
  if (checkRookAndQueen(row, col, board, suffix)) return true;
  // Check for Bishops & Queen
  if (checkBishopAndQueen(row, col, board, suffix)) return true;
  // Check for Knights
  if (checkKnight(row, col, board, suffix)) return true;
  // Check for Pawns
  if (checkPawn(row, col, board, suffix)) return true;
  return false;
}

export default isChecked;