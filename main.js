function block (x, y){
  return document.querySelector(`.chessBlock[data-x="${+x}"][data-y = "${+y}"]`);
}

function rotateBoard () {
  rot+=180;
  if (rot == 360) {
    rot = 0;
  }
  document.querySelector('#field').style.transform = `rotate(${rot}deg)`;
  document.querySelectorAll('.chessBlock').forEach(el => {
    el.style.transform = `rotate(${rot}deg)`;
  });
  if (rot == 180) {
    document.querySelector('#letters').innerHTML = 'hgfedcba';
    document.querySelector('#numbers').innerHTML = '12345678';
  }
  else {
    document.querySelector('#letters').innerHTML = 'abcdefgh';
    document.querySelector('#numbers').innerHTML = '87654321';
  }
}

function switchSide () {
  if (counter) {
    side = 'white';
    enemy = 'black';
  }
  else {
    side = 'black';
    enemy = 'white';
  }
}

function selectPiece (el){
    switch (el.dataset.piece) {
    case 'horse':
      console.log('horse selected');
      clear();
      horse(el);
    break;

    case 'rook':
      console.log('rook selected');
      clear();
      rook (el);
    break;

    case 'bishop':
      console.log('bishop selected');
      clear();
      bishop (el);
    break;

    case 'queen':
      console.log('queen selected');
      clear();
      rook(el);
      bishop(el);
    break;

    case 'pawn':
      console.log('pawn selected');
      clear();
      pawn(el);
    break;

    case 'king':
      console.log('king selected');
      clear();
      king(el);
    break;

    default:
      console.log('just block');
    }
}

function move () {
  if (this.classList.contains("white") && counter) {
    //console.log('white accepted');
    selectPiece(this);
  }
  else if (this.classList.contains('black') && !counter) {
    //console.log('black accepted');
    selectPiece(this);
  }
}

function checkCheck () {
  k = 0;
  document.querySelectorAll('.king').forEach(el => {
    if (el.classList.contains(side)) {
      paintHorse('checkHorse', el.dataset.x, el.dataset.y);
      paintRook('checkRook', el.dataset.x, el.dataset.y);
      paintBishop('checkBishop', el.dataset.x, el.dataset.y);

      document.querySelectorAll('.checkHorse').forEach(elem => {
        if (elem.classList.contains('horse')) {
          checker = elem;
          el.classList.add('checked');
          k++;
        }
        elem.classList.remove('checkHorse');
      });
      document.querySelectorAll('.checkRook').forEach(elem => {
        if (elem.classList.contains('rook') || elem.classList.contains('queen')) {
          checker = elem;
          el.classList.add('checked');
          k++;
        }
        elem.classList.remove('checkRook');
      });
      document.querySelectorAll('.checkBishop').forEach(elem => {
        if (elem.classList.contains('bishop') || elem.classList.contains('queen')) {
          checker = elem;
          el.classList.add('checked');
          k++;
        }
        elem.classList.remove('checkBishop');
      });

      x = el.dataset.x;
      y = el.dataset.y;

      let yHelp = +y-1;
      let bordHelp = 0;
      if (!counter) {
        yHelp = +y+1;
        bordHelp = 7;
      }

      if (y != bordHelp) {
        if (+x+1 < 8) {
          if (block(+x+1, yHelp).classList.contains('pawn') && block(+x+1, yHelp).classList.contains(enemy)) {
            checker = block(+x+1, yHelp);
            el.classList.add('checked');
            k++;
          }
        }
        if (+x-1 >= 0) {
          if (block(+x-1, yHelp).classList.contains('pawn') && block(+x-1, yHelp).classList.contains(enemy)) {
            checker = block(+x-1, yHelp);
            el.classList.add('checked');
            k++;
          }
        }
      }

      if (k > 0) {
        kingChecked = true;
      }

      if (k == 1) {
        //если король на одной вертикали с чекером
        if (+el.dataset.x == +checker.dataset.x) {
          let diff = Math.max(+el.dataset.y, +checker.dataset.y) - Math.min(+el.dataset.y, +checker.dataset.y);
          for (var i = 1; i < diff; i++) {
            blockSquares[i-1] = block(+el.dataset.x, Math.min(+el.dataset.y, +checker.dataset.y) + i);
          }
        }
        //если король на одной горизонтали с чекером
        else if (+el.dataset.y == +checker.dataset.y) {
          let diff = Math.max(+el.dataset.x, +checker.dataset.x) - Math.min(+el.dataset.x, +checker.dataset.x);
          for (var i = 1; i < diff; i++) {
            blockSquares[i-1] = block(Math.min(+el.dataset.x, +checker.dataset.x) + i, +el.dataset.y);
          }
        }
        //если король на диагонали с чекером
        else {
          if (!checker.classList.contains('horse')) {
            let diffX = Math.max(+el.dataset.x, +checker.dataset.x) - Math.min(+el.dataset.x, +checker.dataset.x);
            if (+el.dataset.x > +checker.dataset.x) {
              if (+el.dataset.y > +checker.dataset.y) {
                for (var i = 1; i < diffX; i++) {
                  blockSquares[i-1] = block(+checker.dataset.x + i, +checker.dataset.y + i);
                }
              }
              else {
                for (var i = 1; i < diffX; i++) {
                  blockSquares[i-1] = block(+checker.dataset.x + i, +checker.dataset.y - i);
                }
              }
            }
            else {
              if (+el.dataset.y > +checker.dataset.y) {
                for (var i = 1; i < diffX; i++) {
                  blockSquares[i-1] = block(+checker.dataset.x - i, +checker.dataset.y + i);
                }
              }
              else {
                for (var i = 1; i < diffX; i++) {
                  blockSquares[i-1] = block(+checker.dataset.x - i, +checker.dataset.y - i);
                }
              }
            }
          }
        }
        console.log(blockSquares);
      }
    }
  });


  //console.log('number of checks is ', k, ` to ${side} king`);
}

function checkMate () {
  counterOfPosMoves = 0;
    document.querySelectorAll(`.${side}`).forEach (el => {
      switch (el.dataset.piece) {
        case 'horse':
          paintHorse('potentialMove', el.dataset.x, el.dataset.y);
        break;

        case 'rook':
          paintRook('potentialMove', el.dataset.x, el.dataset.y);
        break;

        case 'bishop':
          paintBishop('potentialMove', el.dataset.x, el.dataset.y);
        break;

        case 'queen':
          paintRook('potentialMove', el.dataset.x, el.dataset.y);
          paintBishop('potentialMove', el.dataset.x, el.dataset.y);
        break;

        case 'pawn':
          paintPawn(el, 'potentialMove');
        break;

        case 'king':
          paintKing('potentialMoveKing', el.dataset.x, el.dataset.y);
        break;

        default:
          console.log('it cant happen anyway lul');
      }
    });
    squaresToBlock('potentialMove');
    document.querySelectorAll('.potentialMove').forEach(pot => {
      counterOfPosMoves++;
    });
    document.querySelectorAll('.potentialMoveKing').forEach(pot => {
      counterOfPosMoves++;
    });
    //console.log('counter of potential moves ', counterOfPosMoves);
    if (counterOfPosMoves == 0) {
      if (kingChecked) {
        document.querySelector('#winnerText').innerHTML = `${enemy} wins by checkmate`;
        document.querySelectorAll('.element').forEach(el => {
          el.onclick = '';
        });
        document.querySelector('#winner').style.visibility = 'visible';
        document.querySelector('#winner').style.opacity = '100%';
      }
      else {
        document.querySelector('#winnerText').innerHTML = 'draw by stalemate';
        document.querySelector('#winner').style.visibility = 'visible';
        document.querySelector('#winner').style.opacity = '100%';
      }
    }

    document.querySelectorAll('.potentialMove').forEach (el => {
      el.classList.remove('potentialMove');
    });
    document.querySelectorAll('.potentialMoveKing').forEach (el => {
      el.classList.remove('potentialMoveKing');
    });
}

function checkForPins () {
  document.querySelectorAll('.pinned').forEach(pin => {
    pin.classList.remove('pinned');
  });
  document.querySelectorAll('.king').forEach(king => {
    if (king.classList.contains('white')) {
      x = king.dataset.x;
      y = king.dataset.y;
      allTogether(createObjWhite, whitePins, 'black');
      //whitePins.pop();
    }
    if (king.classList.contains('black')) {
      x = king.dataset.x;
      y = king.dataset.y;
      allTogether(createObjBlack, blackPins, 'white');
      //blackPins.pop();
    }
  });
}

function allTogether (createObj, pins, enemyEnemy) {
  counterOfPins = 0;

  //проверка по горизонтали и вертикали
  createObj();
  for (var i = +x + 1; i < 8; i++) {
    pinFinder(block(+i, +y), pins, enemyEnemy, 'rook');
    if (stopThis) {
      stopThis = false;
      break;
    }
  }

  createObj();
  for (var i = +x - 1; i >= 0; i--) {
    pinFinder(block(+i, +y), pins, enemyEnemy, 'rook');
    if (stopThis) {
      stopThis = false;
      break;
    }
  }

  createObj();
  for (var i = +y + 1; i < 8; i++) {
    pinFinder(block(+x, +i), pins, enemyEnemy, 'rook');
    if (stopThis) {
      stopThis = false;
      break;
    }
  }

  createObj();
  for (var i = +y - 1; i >= 0; i--) {
    pinFinder(block(+x, +i), pins, enemyEnemy, 'rook');
    if (stopThis) {
      stopThis = false;
      break;
    }
  }

  //проверка по диагонали
  createObj();
  for (var i = 1; i < 8-x; i++) {
    if (+y - i >= 0) {
      pinFinder(block(+x + i, +y - i), pins, enemyEnemy, 'bishop');
      if (stopThis) {
        stopThis = false;
        break;
      }
    }
  }

  createObj();
  for (var i = 1; i < 8-x; i++) {
    if (+y + i < 8) {
      pinFinder(block(+x + i, +y + i), pins, enemyEnemy, 'bishop');
      if (stopThis) {
        stopThis = false;
        break;
      }
    }
  }

  createObj();
  for (var i = 1; i < +x+1; i++) {
    if (+y - i >= 0) {
      pinFinder(block(+x - i, +y - i), pins, enemyEnemy, 'bishop');
      if (stopThis) {
        stopThis = false;
        break;
      }
    }
  }

  createObj();
  for (var i = 1; i < +x+1; i++) {
    if (+y + i < 8) {
      pinFinder(block(+x - i, +y + i), pins, enemyEnemy, 'bishop');
      if (stopThis) {
        stopThis = false;
        break;
      }
    }
  }

  if (counterOfPins > 0) {
    console.log(pins);
  }
}

function createObjWhite () {
  meet = false;
  whitePins[counterOfPins] = new Object ({
    pinner: '',
    pinned: '',
    blocks: []
  });
}

function createObjBlack () {
  meet = false;
  blackPins[counterOfPins] = new Object ({
    pinner: '',
    pinned: '',
    blocks: []
  });
}

function pinFinder (bl, pins, enemy, piece) {
  if (bl.classList.contains('element')) {
    if (bl.classList.contains(enemy)) {
      if (!meet) {
        stopThis = true;
      }
      else {
        if (bl.classList.contains(piece) || bl.classList.contains('queen')) {
          pins[counterOfPins].pinner = bl;
          pins[counterOfPins].pinned = potentialPinned;
          potentialPinned.classList.add('pinned');
          counterOfPins++;
          meet = false;
        }
        stopThis = true;
      }
    }
    else {
      if (!meet) {
        potentialPinned = bl;
        meet = true;
      }
      else {
        stopThis = true;
      }
    }
  }
  else {
    pins[counterOfPins].blocks.push(bl);
  }
}

function kingCantGo () {
  document.querySelectorAll('.kingCantGo').forEach (el => {
    el.classList.remove('kingCantGo');
  });
  document.querySelectorAll(`.${enemy}`).forEach(el => {
    switch (el.dataset.piece) {
      case 'horse':
        paintHorse('kingCantGo', el.dataset.x, el.dataset.y);
      break;

      case 'rook':
        paintRook('kingCantGo', el.dataset.x, el.dataset.y);
      break;

      case 'bishop':
        paintBishop('kingCantGo', el.dataset.x, el.dataset.y);
      break;

      case 'queen':
        paintRook('kingCantGo', el.dataset.x, el.dataset.y);
        paintBishop('kingCantGo', el.dataset.x, el.dataset.y);
      break;

      case 'pawn':

      let yHelp = +el.dataset.y-1;
      if (el.classList.contains('black')) {
        yHelp = +el.dataset.y+1;
      }

      if (+el.dataset.x == 0) {
          block(+el.dataset.x+1, yHelp).classList.add('kingCantGo');
      }
      else if (+el.dataset.x == 7) {
          block(+el.dataset.x-1, yHelp).classList.add('kingCantGo');
      }
      else {
          block(+el.dataset.x+1, yHelp).classList.add('kingCantGo');
          block(+el.dataset.x-1, yHelp).classList.add('kingCantGo');
      }

      break;

      case 'king':
        paintKing('kingCantGo', el.dataset.x, el.dataset.y);
      break;

      default:
        console.log('just block');
      }
  });
  /*document.querySelectorAll('.kingCantGo').forEach(el => {
    if (el.classList.contains('element')) {
      el.classList.remove('kingCantGo');
    }
  });*/
}

function clear () {
  document.querySelectorAll('.blue').forEach(el => {
    if (el.classList.contains('element')) {
      el.onclick = move;
    }
    else {
      el.onclick = '';
    }
  });
  document.querySelectorAll('.pink').forEach(el => {
    el.onclick = '';
  });

  classes.forEach(clas => {
    document.querySelectorAll('.chessBlock').forEach(el => {
      el.classList.remove(clas);
    });
  });
  console.log('cleared');
}

function squaresToBlock (tag) {
  if (kingChecked) {
  document.querySelectorAll(`.${tag}`).forEach(el => {
    let buff = false;

    blockSquares.forEach(bl => {
      if (el == bl) {
        buff = true;
      }
    });
    if (el == checker) {
      buff = true;
    }
    if (!buff) {
      el.classList.remove(tag);
    }
  });
  }
}

function horse (el) {
  el.classList.add('selected');

  paintHorse('blue', el.dataset.x, el.dataset.y);

  squaresToBlock('blue');

  if (k > 1 || el.classList.contains('pinned')) {
    document.querySelectorAll('.blue').forEach(el => {
      el.classList.remove('blue');
    });
  }

  document.querySelectorAll('.blue').forEach(el => {
    el.onclick = movePiece;
  });
}

function paintHorse(tag, x, y) {
  if ((+x+2 < 8) && (+y+1 < 8) && !document.querySelector(`.chessBlock[data-x="${+x+2}"][data-y = "${+y+1}"]`).classList.contains(side)) {
    document.querySelector(`.chessBlock[data-x="${+x+2}"][data-y = "${+y+1}"]`).classList.add(tag);
  }
  if ((+x+2 < 8) && (+y-1 >= 0) && !document.querySelector(`.chessBlock[data-x="${+x+2}"][data-y = "${+y-1}"]`).classList.contains(side)) {
    document.querySelector(`.chessBlock[data-x="${+x+2}"][data-y = "${+y-1}"]`).classList.add(tag);
  }
  if ((+x-2 >= 0) && (+y+1 < 8) && !document.querySelector(`.chessBlock[data-x="${+x-2}"][data-y = "${+y+1}"]`).classList.contains(side)) {
    document.querySelector(`.chessBlock[data-x="${+x-2}"][data-y = "${+y+1}"]`).classList.add(tag);
  }
  if ((+x-2 >= 0) && (+y-1 >= 0) && !document.querySelector(`.chessBlock[data-x="${+x-2}"][data-y = "${+y-1}"]`).classList.contains(side)) {
    document.querySelector(`.chessBlock[data-x="${+x-2}"][data-y = "${+y-1}"]`).classList.add(tag);
  }

  if ((+x-1 >= 0) && (+y-2 >= 0) && !document.querySelector(`.chessBlock[data-x="${+x-1}"][data-y = "${+y-2}"]`).classList.contains(side)) {
    document.querySelector(`.chessBlock[data-x="${+x-1}"][data-y = "${+y-2}"]`).classList.add(tag);
  }
  if ((+x-1 >= 0) && (+y+2 < 8) && !document.querySelector(`.chessBlock[data-x="${+x-1}"][data-y = "${+y+2}"]`).classList.contains(side)) {
    document.querySelector(`.chessBlock[data-x="${+x-1}"][data-y = "${+y+2}"]`).classList.add(tag);
  }
  if ((+x+1 < 8) && (+y-2 >= 0) && !document.querySelector(`.chessBlock[data-x="${+x+1}"][data-y = "${+y-2}"]`).classList.contains(side)) {
    document.querySelector(`.chessBlock[data-x="${+x+1}"][data-y = "${+y-2}"]`).classList.add(tag);
  }
  if ((+x+1 < 8) && (+y+2 < 8) && !document.querySelector(`.chessBlock[data-x="${+x+1}"][data-y = "${+y+2}"]`).classList.contains(side)) {
    document.querySelector(`.chessBlock[data-x="${+x+1}"][data-y = "${+y+2}"]`).classList.add(tag);
  }
}

function rook (el) {
  el.classList.add('selected');

  paintRook('blue', el.dataset.x, el.dataset.y);

  pinRemoveSq(el);

  squaresToBlock('blue');

  if (k > 1) {
    document.querySelectorAll('.blue').forEach(el => {
      el.classList.remove('blue');
    });
  }

  document.querySelectorAll('.blue').forEach(el => {
    el.onclick = movePiece;
  });
}

function paintRook (tag, x, y) {
  for (var i = +x + 1; i < 8; i++) {
    if (document.querySelector(`.chessBlock[data-x="${+i}"][data-y = "${+y}"]`).classList.contains('element')) {
      if (document.querySelector(`.chessBlock[data-x="${+i}"][data-y = "${+y}"]`).classList.contains(enemy) &&
          !block(+i, +y).classList.contains('king')) {
        document.querySelector(`.chessBlock[data-x="${+i}"][data-y = "${+y}"]`).classList.add(tag);
        break;
      }
      else {
        break;
      }
    }
    document.querySelector(`.chessBlock[data-x="${+i}"][data-y = "${+y}"]`).classList.add(tag);
  }

  for (var i = +x - 1; i >= 0; i--) {
    if (document.querySelector(`.chessBlock[data-x="${+i}"][data-y = "${+y}"]`).classList.contains('element')) {
      if (document.querySelector(`.chessBlock[data-x="${+i}"][data-y = "${+y}"]`).classList.contains(enemy)  &&
          !block(+i, +y).classList.contains('king')) {
        document.querySelector(`.chessBlock[data-x="${+i}"][data-y = "${+y}"]`).classList.add(tag);
        break;
      }
      else {
        break;
      }
    }
    document.querySelector(`.chessBlock[data-x="${+i}"][data-y = "${+y}"]`).classList.add(tag);
  }

  for (var i = +y + 1; i < 8; i++) {
    if (document.querySelector(`.chessBlock[data-x="${+x}"][data-y = "${+i}"]`).classList.contains('element')) {
      if (document.querySelector(`.chessBlock[data-x="${+x}"][data-y = "${+i}"]`).classList.contains(enemy)  &&
          !block(+x, +i).classList.contains('king')) {
        document.querySelector(`.chessBlock[data-x="${+x}"][data-y = "${+i}"]`).classList.add(tag);
        break;
      }
      else {
        break;
      }
    }
    document.querySelector(`.chessBlock[data-x="${+x}"][data-y = "${+i}"]`).classList.add(tag);
  }

  for (var i = +y -1; i >= 0; i--) {
    if (document.querySelector(`.chessBlock[data-x="${+x}"][data-y = "${+i}"]`).classList.contains('element')) {
      if (document.querySelector(`.chessBlock[data-x="${+x}"][data-y = "${+i}"]`).classList.contains(enemy) &&
          !block(+x, +i).classList.contains('king')) {
        document.querySelector(`.chessBlock[data-x="${+x}"][data-y = "${+i}"]`).classList.add(tag);
        break;
      }
      else {
        break;
      }
    }
    document.querySelector(`.chessBlock[data-x="${+x}"][data-y = "${+i}"]`).classList.add(tag);
  }
}

function bishop (el) {
  el.classList.add('selected');

  paintBishop('blue', el.dataset.x, el.dataset.y);

  pinRemoveSq(el);

  squaresToBlock('blue');

  if (k > 1) {
    document.querySelectorAll('.blue').forEach(el => {
      el.classList.remove('blue');
    });
  }

  document.querySelectorAll('.blue').forEach(el => {
    el.onclick = movePiece;
  });
}

function pinRemoveSq (el) {
  if (el.classList.contains('pinned')) {
    if (el.classList.contains('white')) {
      whitePins.forEach(pin => {
        if (pin.pinned == el) {
          document.querySelectorAll('.blue').forEach(blue => {
            let buff = true;
            pin.blocks.forEach(bl => {
              if (blue == bl) {
                buff = false;
              }
            });
            if (blue == pin.pinner) {
              buff = false;
            }
            if (buff) {
              blue.classList.remove('blue');
            }
          });
        }
      });
    }
    else {
      blackPins.forEach(pin => {
        if (pin.pinned == el) {
          document.querySelectorAll('.blue').forEach(blue => {
            let buff = true;
            pin.blocks.forEach(bl => {
              if (blue == bl) {
                buff = false;
              }
            });
            if (blue == pin.pinner) {
              buff = false;
            }
            if (buff) {
              blue.classList.remove('blue');
            }
          });
        }
      });
    }
  }
}

function paintBishop (tag, x, y) {
  let stop1 = false;
  let stop2 = false;
  for (var i = 1; i < 8-x; i++) {
    if (+y - i >= 0 && !stop1) {
      if (document.querySelector(`.chessBlock[data-x="${+x + i}"][data-y = "${+y - i}"]`).classList.contains('element')) {
        if (document.querySelector(`.chessBlock[data-x="${+x + i}"][data-y = "${+y - i}"]`).classList.contains(enemy)  &&
            !block(+x + i, +y - i).classList.contains('king')) {
          document.querySelector(`.chessBlock[data-x="${+x + i}"][data-y = "${+y - i}"]`).classList.add(tag);
          stop1 = true;
        }
        else {
          stop1 = true;
        }
      }
      else
        document.querySelector(`.chessBlock[data-x="${+x + i}"][data-y = "${+y - i}"]`).classList.add(tag);
    }

    if (+y + i < 8 && !stop2) {
      if (document.querySelector(`.chessBlock[data-x="${+x + i}"][data-y = "${+y + i}"]`).classList.contains('element')) {
        if (document.querySelector(`.chessBlock[data-x="${+x + i}"][data-y = "${+y + i}"]`).classList.contains(enemy)  &&
            !block(+x + i, +y + i).classList.contains('king')) {
          document.querySelector(`.chessBlock[data-x="${+x + i}"][data-y = "${+y + i}"]`).classList.add(tag);
          stop2 = true;
        }
        else
          stop2 = true;
      }
      else
        document.querySelector(`.chessBlock[data-x="${+x + i}"][data-y = "${+y + i}"]`).classList.add(tag);
      }
  }

  stop1 = false;
  stop2 = false;
  for (var i = 1; i < +x+1; i++) {
    if (+y - i >= 0 && !stop1) {
      if (document.querySelector(`.chessBlock[data-x="${+x - i}"][data-y = "${+y - i}"]`).classList.contains('element')) {
        if (document.querySelector(`.chessBlock[data-x="${+x - i}"][data-y = "${+y - i}"]`).classList.contains(enemy)  &&
            !block(+x - i, +y - i).classList.contains('king')) {
          document.querySelector(`.chessBlock[data-x="${+x - i}"][data-y = "${+y - i}"]`).classList.add(tag);
          stop1 = true;
        }
        else
          stop1 = true;
      }
      else
        document.querySelector(`.chessBlock[data-x="${+x - i}"][data-y = "${+y - i}"]`).classList.add(tag);
    }

    if (+y + i < 8 && !stop2) {
      if (document.querySelector(`.chessBlock[data-x="${+x - i}"][data-y = "${+y + i}"]`).classList.contains('element')) {
        if (document.querySelector(`.chessBlock[data-x="${+x - i}"][data-y = "${+y + i}"]`).classList.contains(enemy)  &&
            !block(+x - i, +y + i).classList.contains('king')) {
          document.querySelector(`.chessBlock[data-x="${+x - i}"][data-y = "${+y + i}"]`).classList.add(tag);
          stop2 = true;
        }
        else
          stop2 = true;
      }
      else
        document.querySelector(`.chessBlock[data-x="${+x - i}"][data-y = "${+y + i}"]`).classList.add(tag);
    }
  }
}

function pawn (el) {
  x = el.dataset.x;
  y = el.dataset.y;

  el.classList.add('selected');

  paintPawn(el, 'blue');

  pinRemoveSq(el);

  squaresToBlock('blue');

  if (k > 1) {
    document.querySelectorAll('.blue').forEach(el => {
      el.classList.remove('blue');
    });
  }

  document.querySelectorAll('.blue').forEach(el => {
      el.onclick = movePiece;
  });
  document.querySelectorAll('.enPassantTaking').forEach(el => {
      el.onclick = enPassantTaking;
  });
}

function enPassantTaking () {
  movesCounter++;
  outStr += `${Math.round(movesCounter/2)}.${goLetter(document.querySelector('.selected'))}x${goLetter(this)}${8 - this.dataset.y} `;
  if (movesCounter % 2 == 0) {
    outStr += '<br>';
  }
  document.querySelector('#movesBlock').innerHTML = outStr;

  let i = 1;
  if (side == 'black') {
    i = -1;
  }
  let sel = document.querySelector('.selected');
  sel.classList.remove(sel.dataset.piece, side, 'element');
  sel.onclick = '';
  sel.dataset.piece = '';
  this.classList.add('pawn', side, 'element');
  this.dataset.piece = 'pawn';
  block(+this.dataset.x, +this.dataset.y + i).classList.remove('pawn', enemy, 'element', 'enPassant');
  block(+this.dataset.x, +this.dataset.y + i).onclick = '';
  block(+this.dataset.x, +this.dataset.y + i).dataset.piece = '';
  clear();
  this.onclick = move;
  counter = !counter;
  switchSide();
  setTimeout(rotateBoard, 200);
  kingCantGo();
  checkCheck();
  checkMate();
  checkForPins();
}

function paintPawn (el, tag) {
  x = el.dataset.x;
  y = el.dataset.y;

  numberOfSq = 1;
  border = 0;
  let yHelp = +y-1;
  if (el.classList.contains('black')) {
    yHelp = +y+1;
    border = 7;
  }

  if (+x == 0) {
    if (block(+x+1, yHelp).classList.contains(enemy)) {
      block(+x+1, yHelp).classList.add(tag);
    }
    if (block(+x+1, +y).classList.contains('enPassant')) {
      block(+x+1, yHelp).classList.add(tag, 'enPassantTaking');
    }
  }
  else if (+x == 7) {
    if (block(+x-1, yHelp).classList.contains(enemy)) {
      block(+x-1, yHelp).classList.add(tag);
    }
    if (block(+x-1, +y).classList.contains('enPassant')) {
      block(+x-1, yHelp).classList.add(tag, 'enPassantTaking');
    }
  }
  else {
    if (block(+x+1, yHelp).classList.contains(enemy)) {
      block(+x+1, yHelp).classList.add(tag);
    }
    if (block(+x+1, +y).classList.contains('enPassant')) {
      block(+x+1, yHelp).classList.add(tag, 'enPassantTaking');
    }
    if (block(+x-1, yHelp).classList.contains(enemy)) {
      block(+x-1, yHelp).classList.add(tag);
    }
    if (block(+x+1, +y).classList.contains('enPassant')) {
      block(+x+1, yHelp).classList.add(tag, 'enPassantTaking');
    }
  }

  if (el.classList.contains('firstMove')) {
    numberOfSq++;
  }

  if (el.classList.contains('black')) {
    for (var i = 1; i < 1 + numberOfSq; i++) {
      if (!block(+x, +y+i).classList.contains('element')) {
        block(+x, +y+i).classList.add(tag);
      }
      else {
        break;
      }
    }
  }
  else {
    for (var i = 1; i < 1 + numberOfSq; i++) {
      if (!block(+x, +y-i).classList.contains('element')) {
        block(+x, +y-i).classList.add(tag);
      }
      else {
        break;
      }
    }
  }
}

function pawnReincornation () {
  document.querySelector('.selected').classList.remove('pawn');
  document.querySelector('.selected').classList.add('queen');
  document.querySelector('.selected').dataset.piece = 'queen';
}

function king (el) {
  x = el.dataset.x;
  y = el.dataset.y;
  el.classList.add('selected');

  paintKing('blue', el.dataset.x, el.dataset.y);

  if (el.classList.contains('notMoved')) {
    if (block(+x+3, +y).classList.contains('notMoved')
        && !block(+x+2, +y).classList.contains('element')
        && !block(+x+1, +y).classList.contains('element')
        && !block(+x+2, +y).classList.contains('kingCantGo')
        && !block(+x+1, +y).classList.contains('kingCantGo')) {
          block(+x+2, +y).classList.add('pink', 'short');
    }
    if (block(+x-4, +y).classList.contains('notMoved')
        && !block(+x-3, +y).classList.contains('element')
        && !block(+x-2, +y).classList.contains('element')
        && !block(+x-1, +y).classList.contains('element')
        && !block(+x-3, +y).classList.contains('kingCantGo')
        && !block(+x-2, +y).classList.contains('kingCantGo')
        && !block(+x-1, +y).classList.contains('kingCantGo')) {
          block(+x-2, +y).classList.add('pink', 'long');
    }
  }

  document.querySelectorAll('.blue').forEach(el => {
    el.onclick = movePiece;
  });
  document.querySelectorAll('.pink').forEach(el => {
    el.onclick = castle;
  });
}

function paintKing (tag, x, y) {
  let xOne, yOne;

  xOne = +x+1;
  yOne = +y+1;
  if (xOne < 8 && yOne < 8 && !block(xOne, yOne).classList.contains(side) && !block(xOne, yOne).classList.contains('kingCantGo')) {
    block(xOne, yOne).classList.add(tag);
  }
  xOne = +x-1;
  yOne = +y+1;
  if (xOne >= 0 && yOne < 8 && !block(xOne, yOne).classList.contains(side) && !block(xOne, yOne).classList.contains('kingCantGo')) {
    block(xOne, yOne).classList.add(tag);
  }
  xOne = +x-1;
  yOne = +y-1;
  if (xOne >= 0 && yOne >= 0 && !block(xOne, yOne).classList.contains(side) && !block(xOne, yOne).classList.contains('kingCantGo')) {
    block(xOne, yOne).classList.add(tag);
  }
  xOne = +x+1;
  yOne = +y-1;
  if (xOne < 8 && yOne >= 0 && !block(xOne, yOne).classList.contains(side) && !block(xOne, yOne).classList.contains('kingCantGo')) {
    block(xOne, yOne).classList.add(tag);
  }
  xOne = +x;
  yOne = +y+1;
  if (yOne < 8 && !block(xOne, yOne).classList.contains(side) && !block(xOne, yOne).classList.contains('kingCantGo')) {
    block(xOne, yOne).classList.add(tag);
  }
  xOne = +x;
  yOne = +y-1;
  if (yOne >= 0 && !block(xOne, yOne).classList.contains(side) && !block(xOne, yOne).classList.contains('kingCantGo')) {
    block(xOne, yOne).classList.add(tag);
  }
  xOne = +x+1;
  yOne = +y;
  if (xOne < 8 && !block(xOne, yOne).classList.contains(side) && !block(xOne, yOne).classList.contains('kingCantGo')) {
    block(xOne, yOne).classList.add(tag);
  }
  xOne = +x-1;
  yOne = +y;
  if (xOne >= 0 && !block(xOne, yOne).classList.contains(side) && !block(xOne, yOne).classList.contains('kingCantGo')) {
    block(xOne, yOne).classList.add(tag);
  }
}

function movePiece () {
  containtedPiece = false;
  movesCounter++;
  document.querySelectorAll('.enPassant').forEach(el => {
    el.classList.remove('enPassant');
  });
  if (document.querySelector('.selected').classList.contains('pawn')) {
    if (Math.abs(+this.dataset.y - document.querySelector('.selected').dataset.y) == 2) {
      this.classList.add('enPassant');
    }
    if (+this.dataset.y == border) {
      pawnReincornation();
    }
  }
  if (document.querySelector('.selected').classList.contains('notMoved')) {
    document.querySelector('.selected').classList.remove('notMoved');
  }
  if (document.querySelector('.selected').classList.contains('firstMove')) {
    document.querySelector('.selected').classList.remove('firstMove');
  }
  if (kingChecked) {
    blockSquares = [];
    document.querySelectorAll('.king').forEach(king => {
      if (king.classList.contains(side)) {
        king.classList.remove('checked');
      }
    });
    kingChecked = false;
  }

  document.querySelector(`.selected`).classList.remove('element', document.querySelector('.selected').dataset.piece, side);
  document.querySelector(`.selected`).onclick = '';
  if (this.classList.contains(enemy)) {
    this.classList.remove(enemy, this.dataset.piece);
    containtedPiece = true;
    if (this.classList.contains('firstMove')) {
      this.classList.remove('firstMove');
    }
  }
  else {
    this.classList.add('element');
  }
  logMoves(this);
  this.dataset.piece = document.querySelector('.selected').dataset.piece;
  document.querySelector(`.selected`).dataset.piece = '';
  this.classList.add(this.dataset.piece, side);
  clear();
  this.onclick = move;
  counter = !counter;
  switchSide();
  setTimeout(rotateBoard, 200);
  kingCantGo();
  checkCheck();
  checkMate();
  checkForPins();
}

function castle () {
  movesCounter++;
  let yHelp;
  if (counter) {
    yHelp = 7;
  }
  else{
    yHelp = 0;
  }
  if (this.classList.contains('short')) {
    this.dataset.piece = document.querySelector('.selected').dataset.piece;
    this.classList.add('king', 'element', side);

    block(4, yHelp).classList.remove('king', 'element', side, 'notMoved');
    block(4, yHelp).onclick = '';

    block(5, yHelp).dataset.piece = 'rook';
    block(5, yHelp).classList.add('rook', 'element', side);

    block(7, yHelp).classList.remove('rook', 'element', side, 'notMoved');
    block(7, yHelp).onclick = '';
    clear();
    this.onclick = move;
    block(5, yHelp).onclick = move;
    outStr += `${Math.round(movesCounter/2)}.CstShort `;
  }

  if (this.classList.contains('long')) {
    this.dataset.piece = document.querySelector('.selected').dataset.piece;
    this.classList.add('king', 'element', side);

    block(4, yHelp).classList.remove('king', 'element', side, 'notMoved');
    block(4, yHelp).onclick = '';

    block(3, yHelp).dataset.piece = 'rook';
    block(3, yHelp).classList.add('rook', 'element', side);

    block(0, yHelp).classList.remove('rook', 'element', side, 'notMoved');
    block(0, yHelp).onclick = '';
    clear();
    this.onclick = move;
    block(0, yHelp).onclick = move;
    outStr += `${Math.round(movesCounter/2)}.CstLong `;
  }
  if (movesCounter % 2 == 0) {
    outStr += '<br>';
  }
  document.querySelector('#movesBlock').innerHTML = outStr;
  counter = !counter;
  switchSide();
  setTimeout(rotateBoard, 200);
  kingCantGo();
  checkCheck();
  checkMate();
}

function draw () {
  let out = '';
  let m = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (m%2 == 0) {
        out += `<div class = "chessBlock" data-x = "${j}" data-y = ${i} data-piece = ''></div>`;
      }
      else {
        out += `<div class = "chessBlock backBlack" data-x = "${j}" data-y = ${i}></div>`;
      }
      m++;
    }
    m++;
  }

  document.querySelector('#field').innerHTML = out;
  document.querySelectorAll('.chessBlock').forEach(el => {
    let xx = el.dataset.x;
    let yy = el.dataset.y;

    if (+yy == 0 || +yy == 7) {
      if (+xx == 1 || +xx == 6) {
        el.classList.add('element', 'horse');
        el.dataset.piece = 'horse';
      }
      if (+xx == 0 || +xx == 7) {
        el.classList.add('element', 'rook', 'notMoved');
        el.dataset.piece = 'rook';
      }
      if (+xx == 2 || +xx == 5) {
        el.classList.add('element', 'bishop');
        el.dataset.piece = 'bishop';
      }
      if (+xx == 3) {
        el.classList.add('element', 'queen');
        el.dataset.piece = 'queen';
      }
      if (+xx == 4) {
        el.classList.add('element', 'king', 'notMoved');
        el.dataset.piece = 'king';
      }
    }

    if (+yy == 1 || +yy == 6) {
      el.classList.add('element', 'pawn', 'firstMove');
      el.dataset.piece = 'pawn';
    }

    if (+yy <= 1) {
      el.classList.add('black');
    }
    else if (+yy >= 6){
      el.classList.add('white');
    }
  });
  document.querySelectorAll('.element').forEach(el => {
    el.onclick = move;
  });
}

function setColor () {
  colors.forEach(col => {
    document.querySelector(col).style.border = '0px';
    if (this == document.querySelector(col)) {
      document.querySelector(col).style.border = '2px solid white';
    }
    document.querySelector(col).onclick = setColor;
  });

  switch (this.id) {
    case 'firstColor':
      document.querySelectorAll('.chessBlock').forEach(bl => {
        bl.style.backgroundColor = '#f2d26f';
      });
      document.querySelectorAll('.backBlack').forEach(bl => {
        bl.style.backgroundColor = '#63461a';
      });
      document.querySelector('#letters').style.color = '#f2d26f';
      document.querySelector('#numbers').style.color = '#f2d26f';
      break;

      case 'secondColor':
        document.querySelectorAll('.chessBlock').forEach(bl => {
          bl.style.backgroundColor = '#f3daf7';
        });
        document.querySelectorAll('.backBlack').forEach(bl => {
          bl.style.backgroundColor = '#f757d2';
        });
        document.querySelector('#letters').style.color = '#f3daf7';
        document.querySelector('#numbers').style.color = '#f3daf7';
        break;

        case 'thirdColor':
          document.querySelectorAll('.chessBlock').forEach(bl => {
            bl.style.backgroundColor = '#b3f5d9';
          });
          document.querySelectorAll('.backBlack').forEach(bl => {
            bl.style.backgroundColor = '#148035';
          });
          document.querySelector('#letters').style.color = '#6efa93';
          document.querySelector('#numbers').style.color = '#6efa93';
          break;
    default:
  }
}

function logMoves (movedTo) {
  outStr += `${Math.round(movesCounter/2)}.`;

  switch (document.querySelector('.selected').dataset.piece) {
  case 'horse':
    outStr += 'N';
  break;

  case 'rook':
    outStr += 'R';
  break;

  case 'bishop':
    outStr += 'B';
  break;

  case 'queen':
    outStr += 'Q';
  break;

  case 'king':
    outStr += 'K';
  break;

  default:
    console.log('just block');
  }

  if (containtedPiece) {
    if (document.querySelector('.selected').dataset.piece == 'pawn') {
      outStr += goLetter(document.querySelector('.selected'));
    }
    outStr += 'x';
  }

  outStr += goLetter(movedTo);
  outStr += `${7 - movedTo.dataset.y + 1} `;

  if (movesCounter % 2 == 0) {
    outStr += '<br>';
  }
  document.querySelector('#movesBlock').innerHTML = outStr;
}

function goLetter (el) {
  switch (+el.dataset.x) {
    case 0:
      return 'a';
    break;
    case 1:
      return 'b';
    break;
    case 2:
      return 'c';
    break;
    case 3:
      return 'd';
    break;
    case 4:
      return 'e';
    break;
    case 5:
      return 'f';
    break;
    case 6:
      return 'g';
    break;
    case 7:
      return 'h';
    break;
  }
}

let rot = 0;
let meet = false;
let stopThis = false;
let potentialPinned;
let counterOfPins = 0;
let blackPins = [];
let whitePins = [];
let numberOfSq;
let counterOfPosMoves = 0;
let border = 0;
let kingChecked = false;
let blockSquares = [];
let checker;
let side = 'white';
let enemy = 'black';
const classes = ['blue', 'selected', 'pink', 'short', 'long', 'enPassantTaking'];
const colors = ['#firstColor', '#secondColor', '#thirdColor'];
let counter = true;
let k = 0;
let x, y;

let containtedPiece;
let movesCounter = 0;
let outStr = '';
draw();

colors.forEach(col => {
  document.querySelector(col).onclick = setColor;
});
