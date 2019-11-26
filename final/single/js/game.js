var Game = function() {
  var gameDiv;
  var nextDiv;
  var timeDiv;
  var scoreDiv;
  var resultDiv;

  var score = 0;

  var gameData = [   // 10 * 20
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
  ]
}

var cur;
var next;

var nextDivs = [];
var gameDivs = [];
// 初始化div
var initDiv = function(container, data, divs) {
  for (var i=0; i < data.length; i++) {
    var  div = [];
    for (var j=0; j<data[0].length; j++) {
      var newNode = document.createElement('div');
      newNode.className = 'none';
      newNode.style.top = (i * 20) + 'px';
      newNode.style.left = (j * 20) + 'px';
      container.appendChild(newNode);
      div.push(newNode);
    }
    divs.push(div);
  }
}

var refreshDiv = function(data, divs) {
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data.length; j++) {
      if (data[i][j] == 0) {
        divs[i][j].className = "none";
      } else if (data[i][j] == 1) {
        divs[i][j].className = "done";
      } else if (data[i][j] == 2) {
        divs[i][j].className == "current";
      }
    }
  }
}