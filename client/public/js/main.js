// custom scripts

var socket = io();


$('#createGame').on('click', function() {
  // Set gameRoom
  var gameRoom = sessionStorage.getItem('game-room') || Math.floor((Math.random() * 10000) + 10000);
  sessionStorage.setItem('game-room', gameRoom);

  // Set viewerId
  var viewerId = sessionStorage.getItem('viewer-id') || Math.floor((Math.random() * 10000) + 10000);
  sessionStorage.setItem('viewer-id', viewerId);


});
