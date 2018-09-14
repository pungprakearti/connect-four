let board = [];

function makeBoard() {
  let temp = Array.from({ length: 7 });
  for (let i = 0; i < 6; i++) {
    board.push(temp);
  }
  console.log(board);
  return board;
}

makeBoard();
