
$(document).ready(function () {
  $('#controls').hide();
  var socket = io();
  var viewportWidth = $(window).width();
  var viewportHeight = $(window).height();
  var left = 1;
  var right = 1;
  var fire = false;
  var player;

  //** JOIN GAME ROOM **//
  $('#join').on('click', function() {
    var gameRoom = $('#user-input').val();

    // sends new-player event to server to join controller to game room
    socket.emit('new-player', {gameRoom: gameRoom});

    // listens for success-join from server and assigns controller a player number
    socket.on('success-join', function(playerNum) {
      player = playerNum;
    });

    $('#game-room-input').hide();
    $('#controls').show();

    setInterval(updateGame, 20);

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
    // sends game-update to server with the players input and player number
    socket.emit('game-update', {right: right, left: left, fire: fire, player: player});
  }
});
