const bgWidth = 1600;
const bgHeight = 900;
const logText = document.getElementById("log");
const pana = document.getElementById("pana");
let panaX = 350;
let panaY = 50;
let redPauseCount = 0;
let redCount = 0;
let redMode = 0;
let redX = 1100;
let redY = 300;
const body = document.getElementById("body");
let screenWidth = 0;
let screenHeight = 0;
let dist = 10;
const green = document.getElementById("greenBalls");
const redBall = document.getElementById("redball");
const message = document.getElementById("message");
let greenBalls = [];

window.onresize = function (e) {
  calcPositionsAndSizes();
};

document.onkeydown = function (e) {
  switch (e.code) {
    case "KeyS":
    case "ArrowDown":
      move(2);
      break;
    case "KeyW":
    case "ArrowUp":
      move(8);
      break;
    case "KeyA":
    case "ArrowLeft":
      move(4);
      break;
    case "KeyD":
    case "ArrowRight":
      move(6);
      break;
    default:
      break;
  }
};

function addGreenBalls() {
  let s = "";

  greenBalls = [];
  greenBalls.push({ x: 300, y: 300, e: null, eaten: false });
  greenBalls.push({ x: 400, y: 600, e: null, eaten: false });
  greenBalls.push({ x: 600, y: 550, e: null, eaten: false });
  greenBalls.push({ x: 1300, y: 800, e: null, eaten: false });
  greenBalls.push({ x: 1170, y: 400, e: null, eaten: false });
  for (let i = 0; i < greenBalls.length; i++) {
    s += `<div class="greenBal" id="bal${i + 1}"></div>"`;
  }
  green.innerHTML = s;
  for (let i = 0; i < greenBalls.length; i++) {
    const bal = greenBalls[i];
    bal.e = document.getElementById(`bal${i + 1}`);
  }
}

function calcPoint(x, y) {
  let xp = 0;
  let yp = 0;
  xp = Math.round((screenWidth / bgWidth) * x);
  yp = Math.round((screenHeight / bgHeight) * y);
  return { x: xp, y: yp };
}

function calcPositionsAndSizes() {
  let ratio = bgHeight / bgWidth;

  if (body.clientWidth * ratio > body.clientHeight) {
    screenHeight = body.clientHeight;
    screenWidth = Math.trunc(screenHeight / ratio);
  } else {
    screenWidth = body.clientWidth;
    screenHeight = Math.trunc(screenWidth * ratio);
  }
  updatePana();
  updateGreenBalls();
  updateRedBall();
}

function checkEat() {
  let allEaten = true;

  for (let i = 0; i < greenBalls.length; i++) {
    const bal = greenBalls[i];
    if (
      bal.x > panaX &&
      bal.x + 40 < panaX + 80 &&
      bal.y > panaY &&
      bal.y + 40 < panaY + 145 &&
      !bal.eaten
    ) {
      bal.e.style.visibility = "hidden";
      bal.eaten = true;
      const audio = new Audio("./sounds/eat.wav");
      audio.play();
    }
    if (!bal.eaten) {
      allEaten = false;
    }
  }
  if (allEaten) {
    message.innerText = "Χρόνια Πολλά Παναγιώτη!!";
    redMode = -1;
    initGame();
  }
}

function checkForest() {
  if (panaY < 330 && panaX > 540 && panaX < 1020) {
    message.innerText = "There lives a witch here! Game over!!";
    const audio = new Audio("./sounds/witch.mp3");
    audio.play();
    redMode = -1;
    initGame();
  }
}

function checkRed() {
  //return false;
  if (redMode < 5) {
    if (!((redX > 1120 && panaY < 140) || (panaX > 1130 && panaY > 620))) {
      if (
        (panaY > 425 && redY > 410 && redMode !== -1) ||
        (panaX > 750 && redX > 750 && redY > 250)
      ) {
        redMode = 5;
      }
    }
  }
}

function initGame() {
  redCount = 0;
  redX = 1100;
  redY = 300;
  panaX = 350;
  panaY = 50;
  addGreenBalls();
  calcPositionsAndSizes();
}

function log(msg) {
  logText.innerText = msg;
}

function move(d) {
  if (redMode !== -1 && redMode !== 7) {
    switch (d) {
      case 6:
        // walk right
        if (panaX + dist + 80 <= bgWidth) {
          panaX += dist;
        }
        break;
      case 4:
        // walk left
        if (panaX - dist >= 0) {
          panaX -= dist;
        }
        break;
      case 2:
        // walk down
        if (panaY + dist + 145 <= bgHeight) {
          panaY += dist;
        }
        break;
      case 8:
        // walk up
        if (panaY - dist >= 0) {
          panaY -= dist;
        }
        break;
      default:
        break;
    }
    updatePana();
    checkEat();
    checkForest();
    //log(`X: ${panaX}, Y: ${panaY}`);
  }
}

function updateGreenBalls() {
  let width = Math.round(screenWidth / 40).toString() + "px";
  for (let i = 0; i < greenBalls.length; i++) {
    const pt = calcPoint(greenBalls[i].x, greenBalls[i].y);
    greenBalls[i].e.style.width = width;
    greenBalls[i].e.style.height = width;
    greenBalls[i].e.style.left = pt.x.toString() + "px";
    greenBalls[i].e.style.top = pt.y.toString() + "px";
  }
}

function updateRedBall() {
  let width = Math.round(screenWidth / 30).toString() + "px";
  const pt = calcPoint(redX, redY);
  redBall.style.width = width;
  redBall.style.height = width;
  redBall.style.left = pt.x.toString() + "px";
  redBall.style.top = pt.y.toString() + "px";
}

function updatePana() {
  const pt = calcPoint(panaX, panaY);
  pana.style.width = Math.round(screenWidth / 20).toString() + "px";
  pana.style.left = pt.x.toString() + "px";
  pana.style.top = pt.y.toString() + "px";
}

function updateGame() {
  let dx = 0;
  let dy = 0;
  let updateRed = false;

  if ([-1, 0, 2, 4, 7].includes(redMode)) {
    redCount++;
  }
  if (redCount > 1000) {
    redCount = 0;
  }

  if (
    redMode === 0 &&
    ((redPauseCount === 0 && redCount > 150) ||
      (redPauseCount === 1 && redCount > 10) ||
      (redPauseCount === 2 && redCount > 180))
  ) {
    redPauseCount++;
    if (redPauseCount > 2) {
      redPauseCount = 0;
    }
    redMode = 1;
  }
  if (redMode === 1 && redY < 500) {
    redY += 7;
    if (redX > 1100) {
      redX -= 5;
    }
    updateRed = true;
  }
  if (redMode === 1 && redY >= 500) {
    redCount = 0;
    redMode = 2;
  }
  if (redMode === 2 && redCount > 40) {
    redMode = 3;
  }
  if (
    redMode === 3 &&
    ((redPauseCount !== 2 && redY > 300) || (redPauseCount === 2 && redY > 120))
  ) {
    redY -= 7;
    if (redY < 200) {
      redX += 5;
    }
    updateRed = true;
  } else if (redMode === 3) {
    redCount = 0;
    redMode = 4;
  }

  if (redMode === 4 && redCount > 30) {
    redMode = 0;
  }

  if (redMode === 5) {
    // Attack
    redMode = 6;
    const audio = new Audio("./sounds/monster.mp3");
    audio.play();
  }
  if (redMode === 6) {
    if (Math.abs(redX - panaX) < 10 && Math.abs(redY - panaY) < 10) {
      message.innerText = "Game over!! Try again...";
      redMode = 7;
      initGame();
    } else {
      if (Math.abs(redX - panaX) > 30) {
        dx = 20;
      } else {
        dx = 1;
      }
      if (Math.abs(redY - panaY) > 30) {
        dy = 20;
      } else {
        dy = 1;
      }
      if (redX < panaX) {
        redX += dx;
      } else {
        redX -= dx;
      }
      if (redY < panaY) {
        redY += dy;
      } else {
        redY -= dy;
      }
      updateRed = true;
    }
  }

  if ((redMode === 7 || redMode === -1) && redCount > 70) {
    redCount = 0;
    redMode = 0;
    message.innerText = "";
  }

  if (updateRed) {
    updateRedBall();
  }
  checkRed();
}

addGreenBalls();
calcPositionsAndSizes();
setInterval(updateGame, 50);
