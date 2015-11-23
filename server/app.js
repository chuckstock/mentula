var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

// *** Models *** //
require('./models/user');
var User = mongoose.model('users');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

var io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, '../client/public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'public', 'index.html'));
});

app.get('/controller', function(req, res) {
  //Serve up phone page here.
  res.sendFile(path.join(__dirname, '../client', 'public', 'controller.html'));
})

app.get('/game', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'public', 'game.html'));
})

var rooms = {};

io.on('connection', function(socket){

  socket.on('new-player', function(data) {
    socket.join(data.gameRoom);
    socket.room = data.gameRoom;
    // console.log(rooms[socket.room].room);
    io.sockets.in(rooms[socket.room].id).emit('player-joined', 'test');
    if (rooms[data.gameRoom].players) {
      rooms[data.gameRoom].players++;
    } else {
      rooms[data.gameRoom].players = 1;
    }
    socket.emit('success-join', rooms[data.gameRoom].players - 1)
    if (rooms[data.gameRoom].players > 1) {
      io.sockets.in(rooms[socket.room].id).emit('start-game')
      console.log('emitting start game: ' + rooms)
    }
  });
  socket.on('game-update', function(data) {
    io.sockets.in(rooms[socket.room].id).emit('game-update', data);
  });
  socket.on('create-game', function(data) {
    // data.gameRoom & data.viewerId
    rooms[data.gameRoom] = {id:data.viewerId}
    console.log(rooms);
    socket.join(data.viewerId);
  });

});


module.exports = app;
