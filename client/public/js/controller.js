
$(document).ready(function () {
  $('#controls').hide();
  var socket = io();
  var viewportWidth = $(window).width();
  var viewportHeight = $(window).height();
  var player = {
      id: Math.floor((Math.random() * 10000) + 10000),
      gameRoom: parseInt(sessionStorage.getItem('game-room'), 10),
      centerX: 0,
      centerY: 0,
      speedX: 0,
      speedY: 0,
      rightTrack: 1, // 0 - reverse, 1 - neutral, 2 - forward
      leftTrack: 1,
      isFiring: false
  };
  var left = 1;
  var right = 1;
  var fire = false;
  var player;

  //** JOIN GAME ROOM **//
  $('#join').on('click', function() {
    var gameRoom = $('#user-input').val();
    socket.emit('new-player', {gameRoom: gameRoom});

    socket.on('success-join', function(playerNum) {
      player = playerNum;
    })
    $('#game-room-input').hide();
    $('#controls').show();
    if (player) {
      setInterval(updateGame, 20)
    }
  });

  //** CONTROLLER **//
  $('#fire').on('touchstart', function (event) {
    event.preventDefault();
    fire = true;
  });

  $('#fire').on('touchend', function (event) {
    event.preventDefault();
    fire = false;
  });

  $('#left-track').on('touchmove', function (event) {
    event.preventDefault();
    left = (event.originalEvent.targetTouches[0].clientY);
    var center = $('#left-track').height() / 2;
    if (left > center + 50) {
      left = 0;
    } else if (left < center - 50){
      left = 2;
    } else {
      left = 1;
    }
  });
  $('#left-track').on('touchend', function (event) {
    event.preventDefault();
    left = 1;
  });


  $('#right-track').on('touchmove', function (event) {
    event.preventDefault();
    right = (event.originalEvent.targetTouches[0].clientY);
    var center = $('#right-track').height() / 2;
    if (right > center + 50) {
      right = 0;
    } else if (right < center - 50){
      right = 2;
    } else {
      right = 1;
    }
  });

  $('#right-track').on('touchend', function (event) {
    event.preventDefault();
    right = 1;
  });



  function updateGame() {
    socket.emit('game-update', {right: right, left: left, fire: fire, player: player});
  }

  $('controller button').on('click', function() {
    //grab game id from input
    socket.emit('new-player', {
      gameRoom: gameRoom,
    });
  });
});
