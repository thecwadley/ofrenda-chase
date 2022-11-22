/*
 * This file is part of htmlMaze	.
 *
 * htmlMaze is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * htmlMaze is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with htmlMaze.  If not, see <https://www.gnu.org/licenses/>.
 */

let ctx;
let canvas;
let maze;
let mazeHeight;
let mazeWidth;
let player;
let picture;
let bread;
let candle;
let skull;
let flower;

let pictureGot = false;
let breadGot = true;
let candleGot = true;
let skullGot = true;
let flowerGot = true;

class Player {
  constructor() {
    this.col = 19;
    this.row = 19;
  }
}

class MazeCell {
  constructor(col, row) {
    this.col = col;
    this.row = row;

    this.eastWall = true;
    this.northWall = true;
    this.southWall = true;
    this.westWall = true;

    this.visited = false;
  }
}

class Maze {
  constructor(cols, rows, cellSize) {
    this.backgroundColor = "#ffffff";
    this.cols = cols;
    this.endColor = "#88FF88";
    this.mazeColor = "#000000";
    this.playerColor = "#880088";
    this.rows = rows;
    this.cellSize = cellSize;

    this.cells = [];

    this.generate();
  }

  generate() {
    mazeHeight = this.rows * this.cellSize;
    mazeWidth = this.cols * this.cellSize;

    canvas.height = mazeHeight;
    canvas.width = mazeWidth;
    canvas.style.height = mazeHeight;
    canvas.style.width = mazeWidth;

    for (let col = 0; col < this.cols; col++) {
      this.cells[col] = [];
      for (let row = 0; row < this.rows; row++) {
        this.cells[col][row] = new MazeCell(col, row);
      }
    }

    let rndCol = Math.floor(Math.random() * this.cols);
    let rndRow = Math.floor(Math.random() * this.rows);

    let stack = [];
    stack.push(this.cells[rndCol][rndRow]);

    let currCell;
    let dir;
    let foundNeighbor;
    let nextCell;

    while (this.hasUnvisited(this.cells)) {
      currCell = stack[stack.length - 1];
      currCell.visited = true;
      if (currCell.col >= 17 && currCell.row >= 17) {
        currCell.eastWall = false;
        currCell.westWall = false;
        currCell.southWall = false;
        currCell.northWall = false;
      }
      if (this.hasUnvisitedNeighbor(currCell)) {
        nextCell = null;
        foundNeighbor = false;
        do {
          dir = Math.floor(Math.random() * 4);
          switch (dir) {
            case 0:
              if (currCell.col !== this.cols - 1 && !this.cells[currCell.col + 1][currCell.row].visited) {
                currCell.eastWall = false;
                nextCell = this.cells[currCell.col + 1][currCell.row];
                nextCell.westWall = false;
                foundNeighbor = true;
              }
              break;
            case 1:
              if (currCell.row !== 0 && !this.cells[currCell.col][currCell.row - 1].visited) {
                currCell.northWall = false;
                nextCell = this.cells[currCell.col][currCell.row - 1];
                nextCell.southWall = false;
                foundNeighbor = true;
              }
              break;
            case 2:
              if (currCell.row !== this.rows - 1 && !this.cells[currCell.col][currCell.row + 1].visited) {
                currCell.southWall = false;
                nextCell = this.cells[currCell.col][currCell.row + 1];
                nextCell.northWall = false;
                foundNeighbor = true;
              }
              break;
            case 3:
              if (currCell.col !== 0 && !this.cells[currCell.col - 1][currCell.row].visited) {
                currCell.westWall = false;
                nextCell = this.cells[currCell.col - 1][currCell.row];
                nextCell.eastWall = false;
                foundNeighbor = true;
              }
              break;
          }
          if (foundNeighbor) {
            stack.push(nextCell);
          }
        } while (!foundNeighbor);
      } else {
        currCell = stack.pop();
      }
    }

    this.redraw();
  }

  hasUnvisited() {
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        if (!this.cells[col][row].visited) {
          return true;
        }
      }
    }
    return false;
  }

  hasUnvisitedNeighbor(mazeCell) {
    return (mazeCell.col !== 0 && !this.cells[mazeCell.col - 1][mazeCell.row].visited) || (mazeCell.col !== this.cols - 1 && !this.cells[mazeCell.col + 1][mazeCell.row].visited) || (mazeCell.row !== 0 && !this.cells[mazeCell.col][mazeCell.row - 1].visited) || (mazeCell.row !== this.rows - 1 && !this.cells[mazeCell.col][mazeCell.row + 1].visited);
  }

  redraw() {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, mazeHeight, mazeWidth);

    ctx.fillStyle = this.endColor;
    let ofrendaImg = document.getElementById("ofrenda");
    ctx.drawImage(ofrendaImg, (this.cols - 2) * this.cellSize, (this.rows - 2) * this.cellSize, this.cellSize * 2, this.cellSize * 2);

    if (pictureGot == false) {
      let pictureImg = document.getElementById("picture");
      ctx.drawImage(pictureImg, picture.col * this.cellSize, picture.row * this.cellSize, this.cellSize, this.cellSize);
    }

    if (breadGot == false) {
      let breadImg = document.getElementById("bread");
      ctx.drawImage(breadImg, bread.col * this.cellSize, bread.row * this.cellSize, this.cellSize, this.cellSize);
    }
    if (candleGot == false) {
      let candleImg = document.getElementById("candle");
      ctx.drawImage(candleImg, candle.col * this.cellSize, candle.row * this.cellSize, this.cellSize, this.cellSize);
    }
    if (flowerGot == false) {
      let flowerImg = document.getElementById("flower");
      ctx.drawImage(flowerImg, flower.col * this.cellSize, flower.row * this.cellSize, this.cellSize, this.cellSize);
    }
    if (skullGot == false) {
      let skullImg = document.getElementById("skull");
      ctx.drawImage(skullImg, skull.col * this.cellSize, skull.row * this.cellSize, this.cellSize, this.cellSize);
      //ctx.fillRect((this.cols - 1) * this.cellSize, (this.rows - 1) * this.cellSize, this.cellSize, this.cellSize);
    }
    ctx.strokeStyle = this.mazeColor;
    ctx.strokeRect(0, 0, mazeHeight, mazeWidth);

    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        if (this.cells[col][row].eastWall) {
          ctx.beginPath();
          ctx.moveTo((col + 1) * this.cellSize, row * this.cellSize);
          ctx.lineTo((col + 1) * this.cellSize, (row + 1) * this.cellSize);
          ctx.stroke();
        }
        if (this.cells[col][row].northWall) {
          ctx.beginPath();
          ctx.moveTo(col * this.cellSize, row * this.cellSize);
          ctx.lineTo((col + 1) * this.cellSize, row * this.cellSize);
          ctx.stroke();
        }
        if (this.cells[col][row].southWall) {
          ctx.beginPath();
          ctx.moveTo(col * this.cellSize, (row + 1) * this.cellSize);
          ctx.lineTo((col + 1) * this.cellSize, (row + 1) * this.cellSize);
          ctx.stroke();
        }
        if (this.cells[col][row].westWall) {
          ctx.beginPath();
          ctx.moveTo(col * this.cellSize, row * this.cellSize);
          ctx.lineTo(col * this.cellSize, (row + 1) * this.cellSize);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = this.playerColor;
    ctx.fillRect(player.col * this.cellSize + 2, player.row * this.cellSize + 2, this.cellSize - 4, this.cellSize - 4);
  }
}

function onClick(event) {
  maze.cols = document.getElementById("cols").value;
  maze.rows = document.getElementById("rows").value;
  maze.generate();
}

function onKeyDown(event) {
  switch (event.keyCode) {
    case 37:
    case 65:
      if (!maze.cells[player.col][player.row].westWall) {
        player.col -= 1;
      }
      break;
    case 39:
    case 68:
      if (!maze.cells[player.col][player.row].eastWall) {
        player.col += 1;
      }
      break;
    case 40:
    case 83:
      if (!maze.cells[player.col][player.row].southWall) {
        player.row += 1;
      }
      break;
    case 38:
    case 87:
      if (!maze.cells[player.col][player.row].northWall) {
        player.row -= 1;
      }
      break;
    default:
      break;
  }

  if (player.col == picture.col && player.row == picture.row) {
    pictureGot = true;
  } else if (player.col == candle.col && player.row == candle.row) {
    candleGot = true;
  } else if (player.col == bread.col && player.row == bread.row) {
    breadGot = true;
  } else if (player.col == skull.col && player.row == skull.row) {
    skullGot = true;
  } else if (player.col == flower.col && player.row == flower.row) {
    flowerGot = true;
  }

  if (pictureGot && candleGot && breadGot && skullGot && flowerGot && player.row >= 18 && player.col >= 18) {
    document.getElementById("para").innerHTML = "Success!";
  }

  maze.redraw();
}

class DeadItem {
  constructor() {
    this.col = Math.floor(Math.random() * 20);
    this.row = Math.floor(Math.random() * 20);
  }
}

function onLoad() {
  canvas = document.getElementById("mainForm");
  ctx = canvas.getContext("2d");

  player = new Player();
  picture = new DeadItem();
  flower = new DeadItem();
  skull = new DeadItem();
  candle = new DeadItem();
  bread = new DeadItem();
  maze = new Maze(20, 20, 25);

  document.addEventListener("keydown", onKeyDown);
  document.getElementById("generate").addEventListener("click", onClick);
}

onLoad();
