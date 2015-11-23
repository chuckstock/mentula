// custom scripts

var socket = io();
$(document).on('ready', function() {
  $('#game-room').hide();
  $('#createGame').on('click', function() {
    $('#createGame').hide();

    // Set gameRoom
    var gameRoom = Math.floor((Math.random() * 10000) + 10000);

    // Set viewerId
    var viewerId = Math.floor((Math.random() * 10000) + 10000);

    socket.emit('create-game', {gameRoom: gameRoom, viewerId: viewerId});

    $('#game-room-code').text(gameRoom);
    $('#game-room').show();
  });
  socket.on('player-joined', function(data) {
    console.log(data);
  });
  socket.on('start-game', function() {
    console.log('starting game');
    $('.container').hide();
    startGame();
  })
});
