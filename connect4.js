/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

let boardJS = [];

function makeBoard() {
  for (let i = 0; i < HEIGHT; i++) {
    boardJS.push(new Array(WIDTH).fill(null));
  }
  return boardJS;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  let boardHTML = document.getElementById('board');

  // create top of board for selecting when to drop pieces into play
  let top = document.createElement('tr');
  top.setAttribute('id', 'column-top');

  // click event
  top.addEventListener('click', handleClick);

  // hover target
  // top.addEventListener('mouseover', changeColor);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement('td');
    headCell.setAttribute('id', x);

    // on hover change color
    headCell.setAttribute('onmouseover', "this.bgColor='orange'");
    headCell.setAttribute('onmouseout', "this.bgColor='white'");

    top.append(headCell);
  }
  boardHTML.append(top);

  // create the rest of the board
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    boardHTML.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let i = boardJS.length - 1; i >= 0; i--) {
    if (boardJS[i][x] === null) {
      boardJS[i][x] = currPlayer;
      return i;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML board */

function placeInTable(y, x) {
  if (y !== null) {
    let pieceInCell = document.createElement('div');
    pieceInCell.setAttribute('class', `piece p${currPlayer}`);

    let cellToPlace = document.getElementById(`${y}-${x}`);
    cellToPlace.append(pieceInCell);
  }
}

/** endGame: announce game end */

function endGame(msg) {
  window.alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // switch player after click
  currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // check for tie
  if (checkTie(boardJS)) endGame(`It's a tie!`);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }
}

function checkTie(board) {
  board[0].every(function(val) {
    return val !== null;
  });
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        boardJS[y][x] === currPlayer
    );
  }

  // get all winning positions to check for winner

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
