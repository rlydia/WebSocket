var Local = function() {
  var game;
  var INTERVAL = 200;
  var timer = null;
  var timeCount = 0;  // 计时
  var time = 0;
  // 绑定键盘事件
  var bindkeyEvent = function() {
    document.onkeydown = function(e) {
      if (e.keyCode == 38) {
        game.rotate();
      } else if (e.keyCode == 39) {
        game.right();
      } else if (e.keyCode == 40) {
        game.down();
      } else if (e.keyCode == 37) {
        game.left();
      } else if (e.keyCode == 32) {
        game.fall();
      }
    }
  }
  // 移动 (每隔200毫秒 调用一次move)
  var move = function() {
    timeFunc();  // 计时函数, 每200毫秒调用一次计时函数；当timeCount=5时，表 已经到一秒了；

    // 若不能下降了 才去调用game.fixed();
    if (!game.down()) {
      game.fixed();
      var line = game.checkClear();  // 消行
      if (line) { // 表消了一行后 才有了得分；
        game.addScore(line);
      }

      var gameOver = game.checkGameOver();
      if (gameOver) {
        game.gameover(false);
        stop();
      } else {
        // 下一个方块的种类与下一个方块的旋转次数
        game.performNext(generateType(), generateDir());
      }
    }
  }

  // 随机生成干扰行-- lineNum行；
  var generateBottomLine = function(lineNum) {
    var lines = [];
    for (var i = 0; i < lineNum; i++) {
      var line = [];
      for (var j = 0; j < 10; j++) {
        line.push(Math.ceil(Math.random() * 2) - 1);  // 生成随机数
      }
      lines.push(line);
    }
    return lines;
  }

  // 计时函数
  var timeFunc = function() {
    timeCount++;
    if (timeCount == 5) { // 若timeCount为5的话，表已经达到一秒了；
      timeCount = 0;
      time++; // 按秒计时
      game.setTime(time);
      if (time % 10 == 0) {  // 每十秒生成一行干扰；
        game.addTaiLines(generateBottomLine(1))
      }
    }
  }

  // 随机生成一个方块种类
  var generateType = function() {
    return Math.ceil(Math.random() * 7) - 1;
  }

  // 随机生成一个旋转次数
  var generateDir = function() {
    return Math.ceil(Math.random() * 4) - 1;
  }

  // 开始
  var start = function() {
    var doms = {
      gameDiv: document.getElementById('local_game'),
      nextDiv: document.getElementById('local_next'),
      timeDiv: document.getElementById('local_time'),
      scoreDiv: document.getElementById('local_score'),
      resultDiv: document.getElementById('local_gameover'),
    }
    game = new Game();
    game.init(doms, generateType(), generateDir());
    bindkeyEvent();
    game.performNext(generateType(), generateDir());
    timer = setInterval(move, INTERVAL);   // 用clearInterval()方法来暂停执行；
  }

  // 结束
  var stop = function() {
    if (timer) {  // 关闭计时器
      // clearInterval() 方法可取消由 setInterval() 函数设定的定时执行操作。
      clearInterval(timer);  
      timer = null;
    }
    document.onkeydown = null; // 清除键盘事件
  }

  this.start = start
}