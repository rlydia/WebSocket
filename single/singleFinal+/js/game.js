var Game = function() {
  // dom元素
  var gameDiv;
  var nextDiv;
  var timeDiv;
  var scoreDiv;
  var resultDiv;
  // 分数
  var score = 0

  // 游戏矩阵
  var gameData = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  // 当前方块
  var cur;
  // 下一个方块
  var next;

  // divs
  var nextDivs = [];
  var gameDivs = [];
  // 初始化div
  var initDiv = function(container, data, divs) {
    for (var i=0; i < data.length;i++) {
      var div = [];
      for (var j=0; j < data[0].length; j++) {
        var newNode = document.createElement('div');
        newNode.className = "none";
        newNode.style.top = (i*20) + 'px';
        newNode.style.left = (j*20) + 'px';
        // document.getElementById('game').appendChild(newNode);
        container.appendChild(newNode);
        div.push(newNode);
      }
      divs.push(div);
    }
  }

  // 刷新div
  var refreshDiv = function(data, divs) {
    for (var i=0; i<data.length; i++) {
      for (var j=0; j<data[0].length; j++) {
        if (data[i][j] == 0) {
          divs[i][j].className = "none";
        } else if (data[i][j] == 1) {
          divs[i][j].className = "done";
        } else if (data[i][j] == 2) {
          divs[i][j].className = "current";
        }
      }
    }
  }

  // 检查点是否合法 (x，y为二维数组的位置)
  var check = function(pos, x, y) {
    if (pos.x + x < 0) {  // 超出上边界
      return false;
    } else if (pos.x + x >= gameData.length) { // 超出下边界
      return false;
    } else if (pos.y + y < 0) {  // 超出左边界
      return false;
    } else if (pos.y + y >= gameData[0].length) { // 超出右边界 
      return false;
    } else if (gameData[pos.x + x][pos.y + y] == 1) { // 若已经有一个落下来的方块了 => 不可发
      return false;
    } else {
      return true;
    }
  }

  // 检测数据是否合法
  // pos对应的是square.js中的原点，而data为方块数据
  var isValid = function(pos, data) {
    for(var i=0; i<data.length; i++) {
      for(var j=0; j<data[0].length; j++) {
        if (data[i][j] != 0) {
          if (!check(pos, i, j)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  // 清除数据
  var clearData = function() {
    // 需将cur中的数据放到gameDate中去
    for (var i=0; i<cur.data.length; i++) {
      for (var j=0; j<cur.data[0].length; j++) {
        if (check(cur.origin, i, j)) {
          gameData[cur.origin.x + i][cur.origin.y + j] = 0;
        }
      }
    }
  }
  
  // 设置数据
  var setData = function() {
    // 需将cur中的数据放到gameDate中去
    for (var i=0; i<cur.data.length; i++) {
      for (var j=0; j<cur.data[0].length; j++) {
        if (check(cur.origin, i, j)) {
          gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j];
        }
      }
    }
  }

  // 下移
  // 键盘控制方块下移-
  var down = function() {
    if(cur.canDown(isValid)) {  //若可以下降才做这个操作
      clearData();
      // cur.origin.x = cur.origin.x + 1;
      cur.down();
      setData();
      refreshDiv(gameData, gameDivs);
      return true;  // 若还能向下 就return true;
    } else {
      return false;
    }
  }

  // 左移
  var left = function() {
    if(cur.canLeft(isValid)) {  //若可以下降才做这个操作
      clearData();
      cur.left();
      setData();
      refreshDiv(gameData, gameDivs);
    }
  }

  // 右移
  var right = function() {
    if(cur.canRight(isValid)) {  //若可以下降才做这个操作
      clearData();
      cur.right();
      setData();
      refreshDiv(gameData, gameDivs);
    }
  }

  // 旋转
  var rotate = function() {
    if(cur.canRotate(isValid)) {  //若可以下降才做这个操作
      clearData();
      cur.rotate();
      setData();
      refreshDiv(gameData, gameDivs);
    }
  }

  // 方块移动到底部，并将其固定
  var fixed = function() {
    for (var i = 0; i < cur.data.length; i++) {
      for (var j=0; j < cur.data[0].length; j++) {
        if (check(cur.origin, i, j)) {
          if (gameData[cur.origin.x + i][cur.origin.y + j] == 2) {
            gameData[cur.origin.x + i][cur.origin.y + j] = 1;
          }
        }
      }
    }
    refreshDiv(gameData, gameDivs);
  }

  // 消行
  var checkClear = function() {
    var line = 0;
    for (var i = gameData.length-1; i>=0; i--) {
      var clear = true;
      for (var j=0; j < gameData[0].length; j++) {
        if (gameData[i][j] != 1) {
          clear = false;
          break;
        }
      }
      if (clear) {  // 若这一行可以被消除
        line = line + 1;  // 消行的同时 要计分；
        for (var m=i; m > 0; m--) {
          for (var n=0; n<gameData[0].length; n++) {
            gameData[m][n] = gameData[m-1][n]
          }
        }
        for(var n=0; n<gameData[0].length; n++) {
          gameData[0][n] = 0;
        }
        i++;  // 所有的行往下移
      }
    }
    return line;
  }

  // 检查游戏结束
  var checkGameOver = function() {
    var gameOver = false;
    for (var i=0; i<gameData[0].length; i++) {
      if (gameData[1][i] == 1) {
        gameOver = true;
      }
    }
    return gameOver;
  }
  
  // 使用下一个方块
  var performNext = function(type, dir) {
    cur = next;
    setData();  // 让当前方块的数据，反映到gameData数组中去；
    next = SquareFactory.prototype.make(type, dir);
    refreshDiv(gameData, gameDivs); // 反映到界面上
    refreshDiv(next.data, nextDivs);
  } 
  
  // 设置时间
  var setTime = function(time) {
    timeDiv.innerHTML = time;
  }

  // 加分
  var addScore = function(line) {
    var s = 0; 
    switch(line) {
      case 1:  // 若消了一行
        s = 10;
        break;
      case 2:  // 若消了两行
        s = 30;
        break;
      case 3:
        s = 60;
        break;
      case 4: 
        s = 100;
        break;
      default:
        break;
    }
    score = score + s;
    scoreDiv.innerHTML = score;
  }

  // 游戏结束
  var gameover = function(win) {
    if (win) {
      resultDiv.innerHTML = "游戏结束啦！你赢了哦!!"
    } else {
      resultDiv.innerHTML = "游戏结束啦~你输了耶~"
    }
  }
  
  // 底部增加行；
  var addTaiLines = function(lines) {
    for (var i=0; i<gameData.length - lines.length; i++) { // 让所有的行都往上移
      gameData[i] = gameData[i + lines.length];
    }
    for (var i=0; i<lines.length; i++) {
      gameData[gameData.length - lines.length + i] = lines[i];
    }
    cur.origin.x = cur.origin.x - lines.length;
    if (cur.origin.x < 0) {
      cur.origin.x = 0;
    }
    refreshDiv(gameData, gameDivs);
  }

  // 初始化
  var init = function(doms, type, dir) {
    gameDiv = doms.gameDiv;
    nextDiv = doms.nextDiv;
    timeDiv = doms.timeDiv;
    scoreDiv = doms.scoreDiv;
    resultDiv = doms.resultDiv;

    // 实现每次刷新出来的俄罗斯方块不同；
    next = SquareFactory.prototype.make(type, dir);
    // cur = SquareFactory.prototype.make(2, 2);
    // next = SquareFactory.prototype.make(3, 3); 
    // cur = new Square(); 
    // next = new Square();
    initDiv(gameDiv, gameData, gameDivs);
    initDiv(nextDiv, next.data, nextDivs);
    // cur.origin.x = 10;
    // cur.origin.y = 5;

    // setData();  // 需将cur中的数据放到gameDate中去
    // refreshDiv(gameData, gameDivs);
    refreshDiv(next.data, nextDivs);
  }

  // 导出API
  this.init = init;  // 这样在外面init，就可调用到这个里面的函数了；
  this.down = down;
  this.left = left;
  this.right = right;
  this.rotate = rotate;
  // while(down())--若返回true，表还能下降；若返回false 则不能再向下；
  this.fall = function() {while(down());}
  this.fixed = fixed;
  this.performNext = performNext;
  this.checkClear = checkClear;
  this.checkGameOver = checkGameOver;
  this.setTime = setTime;
  this.addScore = addScore;
  this.gameover = gameover;
  this.addTaiLines = addTaiLines;
}