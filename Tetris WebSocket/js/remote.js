// remote.js控制的是对方游戏区域中的行为；
var Remote = function(socket){
  // 游戏对象
  var game;
  // 绑定按钮事件
  var bindEvents = function(){
    socket.on('init', function(data) {
      start(data.type, data.dir);
    });

    socket.on('next', function(data) {
      // 驱动对方游戏区域也调用performNext()
      game.performNext(data.type, data.dir)
    });

    socket.on('rotate', function(data) {
      game.rotate();
    });

    socket.on('right', function(data) {
      game.right();
    });

    socket.on('down', function(data) {
      game.down();
    });

    socket.on('fall', function(data) {
      game.fall();
    });

    socket.on('fixed', function(data) {
      game.fixed();
    });

    // 收到line时，说明产生了消行；
    socket.on('line', function(data) {
      game.checkClear();
      game.addScore(data);
    });

    // 同步时间
    socket.on('time', function(data) {
      game.setTime(data);
    });

    socket.on('lose', function(data) {
      game.gameover(false);
    });

    socket.on('addTailLines', function(data) {
      game.addTailLines(data);
    });
  }
  // 开始
  var start = function(type,dir){
      var doms = {
          gameDiv : document.getElementById("remote_game"),
          nextDiv : document.getElementById("remote_next"),
          timeDiv : document.getElementById("remote_time"),
          scoreDiv : document.getElementById("remote_score"),
          resultDiv : document.getElementById("remote_gameover")
      }
      game = new Game();
      game.init(doms,type,dir);
  }

  bindEvents();
  // 导出API
  // this.start = start;
  // this.bindEvents = bindEvents;
}