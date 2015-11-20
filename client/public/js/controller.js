
$(document).ready(function () {
  var socket = io();
  var viewportWidth = $(window).width();
  var viewportHeight = $(window).height();
  var player = {
      id: Math.floor((Math.random() * 10000) + 10000),
      gameRoom: parseInt(sessionStorage.getItem('game-room'), 10),
      rotation: 0,
      centerX: 0,
      centerY: 0,
      speedX: 0,
      speedY: 0
  };

  $('#fire').on('touchstart', function (event) {
    event.preventDefault();
    // var x = (event.originalEvent.targetTouches[0].clientX);
    var y = (event.originalEvent.targetTouches[0].clientY);
    socket.emit('gameUpdate', true)
    // updatePlayerXY(x, y);
  });

  $('#left-track').on('touchmove', function (event) {
    event.preventDefault();
    // var x = (event.originalEvent.targetTouches[0].clientX);
    var y = (event.originalEvent.targetTouches[0].clientY);
    socket.emit('gameUpdate', y)
    // updatePlayerXY(x, y);
  });

  $('#right-track').on('touchmove', function (event) {
    event.preventDefault();
    // var x = (event.originalEvent.targetTouches[0].clientX);
    var y = (event.originalEvent.targetTouches[0].clientY);
    socket.emit('gameUpdate', y)
    // updatePlayerXY(x, y);
  });




  $('controller button').on('click', function() {
    //grab game id from input
    socket.emit('new-player', {
      gameRoom: gameRoom,
    });
  });
});
