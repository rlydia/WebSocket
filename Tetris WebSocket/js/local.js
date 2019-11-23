var Local = function(socket){
  // 游戏对象
  var game;
  // 时间间隔
  var INTERVAL = 2000;  // 2秒
  // 定时器
  var timer = null;
  // 时间计数器
  var timeCount = 0;
  // 时间
  var time = 0;
  // 绑定键盘事件
  var bindKeyEvent = function(){
    document.onkeydown = function(e){
      if(e.keyCode == 38){// up
          game.rotate();
          socket.emit('rotate')  // rotate是需转发的消息
      } else if (e.keyCode == 39) { //right
          game.right();
          socket.emit('right') 
      } else if (e.keyCode == 40) { //down
          game.down();
          socket.emit('down') 
      } else if (e.keyCode == 37) { //left
          game.left();
          socket.emit('left') 
      } else if (e.keyCode == 32) { //space
          game.fall();
          socket.emit('fall') 
      }
    }
  }
  // 移动
  var move = function(){
    timeFunc();
    if(!game.down()){
      game.fixed();
      socket.emit('fixed');  // 检查有没有消完

      var line = game.checkClear();
      if(line){
        game.addScore(line);
        socket.emit('line', line)  // 将消完的消息传递
        // 若一次消行大于等于 两行 ---给对方增加底部干扰；
        if (line > 1) {
          var bottomLines = generateBottomLine(line);
          socket.emit('bottomLines', bottomLines)
        }
      }
      var gameOver = game.checkGameOver();  
      if(gameOver){
        game.gameover(false);
        document.getElementById('remote_gameover').innerHTML = '你赢了';
        // 处理有两方对战时的输赢问题；
        socket.emit('lose');
        stop();
      } else {
        // game.performNext(generateType(), generateDir());
        var t = generateType()   // 随机生成
        var d = generateDir()
        game.performNext(t, d);
        socket.emit('next', {type: t, dir: d});
      }
    } else {
      socket.emit('down');
    }
  }

  // 随机生成干扰行
  var generateBottomLine = function(lineNum){
      var lines = [];
      for(var i=0;i<lineNum;i++){
          var line = [];
          for(var j=0; j<10; j++){
              line.push(Math.ceil(Math.random()*2)-1);
          }
          lines.push(line);
      }
      return lines;
  }

  // 计时函数
  var timeFunc = function(){
    timeCount = timeCount + 1;
    if(timeCount == 5){
      timeCount = 0;
      time = time + 1; 
      game.setTime(time);
    // 在底部添加干扰行：
    //   if(time % 10 == 0){
    //     game.addTailLines(generateBottomLine(1));
    //   }
      socket.emit('time', time);
    }
  }

  // 随机生成一个方块种类
  var generateType = function(){
      return Math.ceil(Math.random() * 7) - 1; 
  }

  // 随机生成一个旋转次数
  var generateDir = function(){
      return Math.ceil(Math.random() * 4) - 1; 
  }


  // 开始
  var start = function(){
      var doms = {
          gameDiv : document.getElementById("local_game"),
          nextDiv : document.getElementById("local_next"),
          timeDiv : document.getElementById("local_time"),
          scoreDiv : document.getElementById("local_score"),
          resultDiv : document.getElementById("local_gameover")
      }
      game = new Game();
      // generateType(),generateDir() 随机生成的方块种类，与随机生成的方块方向；这两个参数需通过websocket传送给另外的客户端；
      var type = generateType()
      var dir = generateDir()
      // 在start方法中调用 game.init方法；
      game.init(doms, type, dir);
      socket.emit('init', {type: type, dir: dir})

      bindKeyEvent();
      var t = generateType()
      var d = generateDir()
      game.performNext(t, d);
      socket.emit('next', {type: t, dir: d});

      timer = setInterval(move, INTERVAL);
  }

  // 结束
  var stop = function() {
      if(timer){
          clearInterval(timer);
          timer = null;
      } 
      document.onkeydown = null;
  }

  // 导出API
  //   this.start = start;

  // 当游戏开始时，两边都会收到 start消息；-- 接收到start消息时 调用start方法；
  socket.on('start', function() {
    document.getElementById('waiting').innerHTML = '';
    start();
  })

  
  // 在local中同样要监听lose, 任意一方输了之后 游戏结束；
  socket.on('lose', function() {
    game.gameover(true);
    stop();
  });

  // leave消息一定是对方发过来的 -- 掉线的逻辑；
  socket.on('leave', function() {
    document.getElementById('local_gameover').innerHTML = "对方掉线";
    document.getElementById('remote_gameover').innerHTML = "已掉线";
    stop();
  })

  socket.on('bottomLines', function(data) {
    game.addTailLines(data);
    socket.emit('addTailLines', data)
  })
}