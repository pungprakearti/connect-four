/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let boardJS = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let i = 0; i < HEIGHT; i++) {
    boardJS.push(new Array(WIDTH).fill(null));
  }
  return boardJS;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "board" variable from the item in HTML w/ID of "board"
  let boardHTML = document.getElementById('board');
  // TODO: add comment for this code
  let top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }
  boardHTML.append(top);

  // TODO: add comment for this code
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    boardHTML.append(row);
  }

  let hoverTarget = document.getElementById('column-top'); // variable to find top column
  hoverTarget.style.borderColor = 'grey';
  hoverTarget.addEventListener(
    'mouseover',
    function(event) {
      // highlight the mouseover target
      event.target.style.background = 'orange';

      setTimeout(function() {
        event.target.style.background = '';
      }, 500);
    },
    false
  );

  hoverTarget.style.border = 'thick solid #0000FF';
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
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
  // TODO: make a div and insert into correct table cell
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
  currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (checkTie(boardJS)) endGame(`It's a tie!`);

  // if (
  //   boardJS.forEach(function(val) {
  //     return val.every(function(element) {
  //       return element !== null;
  //     });
  //   })
  // ) {
  //   endGame(`It's a tie!`);
  // }

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
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

  // TODO: read and understand this code. Add comments to help you.

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
