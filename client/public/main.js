// custom scripts

var socket = io();

$('#socketform').submit(function() {
  socket.emit('chat message',$('#m').val());
  $('#m').val('');
  return false;
})
socket.on('chat message', function(msg) {
  $('#message').append($('<li>').text(msg));
});
