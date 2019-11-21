var Local = function() {
  // 游戏对象
  var game;
  // 时间间隔
  var INTERVAL = 200;
  // 定时器
  var timer = null;
  // 时间计数器 （对move进行计数）
  var timeCount = 0
  // 时间
  var time = 0;

  // 键盘控制方块下移--绑定键盘事件
  var bindKeyEvent = function() {
    document.onkeydown = function(e) {
      if (e.keyCode == 38) {  // up
        game.rotate();
      } else if (e.keyCode == 39) {  // right
        game.right();
      } else if (e.keyCode == 40) { // down
        game.down();
      } else if (e.keyCode == 37) { // left
        game.left();
      } else if (e.keyCode == 32) {  // space 空格键
        game.fall();
      }
    }
  }; 
  // 移动 (每隔200毫秒 调用一次move)
  var move = function() {
    // 在每次move时 调用方法；
    timeFunc();

    // 若不能下降了 才去调用game.fixed();
    if (!game.down()) {
      game.fixed();
      var line = game.checkClear();
      if(line) {  // 若line不为0 --- 表消了一行后 有了得分；
        game.addScore(line);
      }
      // 消行的逻辑 应在game.fixed()之后；
      // game.checkClear();
      var gameOver = game.checkGameOver();
      if (gameOver) {
        game.gameover(false);
        stop();
      } else {
        game.performNext(generateType(), generateDir());  // 下一个方块的种类与下一个方块的旋转次数
      }
    }
  }

  // 随机生成干扰行
  var generataBottomLine = function(lineNum) {
    var lines = []
    for(var i = 0; i < lineNum; i++) {
      var line = [];
      for (var j =0; j < 10; j++) {  // 每一行有10个方块
        line.push(Math.ceil(Math.random() * 2) - 1);  // 生成随机数
      }
      lines.push(line);
    }
    return lines;
  }


  // 计时函数
  var timeFunc = function() {
    timeCount = timeCount + 1
    if (timeCount == 5) {  // 若timeCount为5的话，表已经达到一秒了；
      timeCount = 0;
      time = time + 1
      game.setTime(time);
      if (time % 10 == 0) {   // 每十秒生成一行干扰；
        game.addTaiLines(generataBottomLine(1))
      }
    }
  }
  
  // 随机生成一个方块的种类
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
      gameDiv: document.getElementById('game'),
      nextDiv: document.getElementById('next'),
      timeDiv: document.getElementById('time'),
      scoreDiv: document.getElementById('score'),
      resultDiv: document.getElementById('gameover'),  // 当gameover时，有所显示；
    }
    game = new Game();
    game.init(doms, generateType(), generateDir());
    bindKeyEvent();
    game.performNext(generateType(), generateDir())
    timer = setInterval(move, INTERVAL) // 将时间间隔INTERVAL定义为常量
  }

  // 结束
  var stop = function() {
    // 关闭计时器
    if(timer) {
      clearInterval(timer);
      timer = null;
    }
    // 清除键盘事件
    document.onkeydown = null;
  }

  // 导出API
  this.start = start;
}