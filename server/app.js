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

//** SOCKET.IO STUFFS **//
var io = require('socket.io')(server);

// object to keep track of game rooms and viewerIDs
var rooms = {};

io.on('connection', function(socket){
  // new-player emit comes from controller after entering unique game code
  socket.on('new-player', function(data) {
    socket.join(data.gameRoom);
    socket.room = data.gameRoom;
    io.sockets.in(rooms[socket.room].id).emit('player-joined', 'test');

    //check to see how many players have joined the game room
    if (rooms[data.gameRoom].players) {
      rooms[data.gameRoom].players++;
    } else {
      rooms[data.gameRoom].players = 1;
    }

    //send unqiue player identifier to controller
    socket.emit('success-join', rooms[data.gameRoom].players - 1)

    // check to see if there is more than one player, to start the game then emits start-game event to viewer
    if (rooms[data.gameRoom].players >= 1) {
      io.sockets.in(rooms[socket.room].id).emit('start-game')
    }
  });

  // listens for game-update from controller and emits update to viewer
  socket.on('game-update', function(data) {
    io.sockets.in(rooms[socket.room].id).emit('game-update', data);
  });

  // listens for create-game from viewer and creates a unique game room on the server
  socket.on('create-game', function(data) {
    // data.gameRoom & data.viewerId
    rooms[data.gameRoom] = {id:data.viewerId}
    socket.join(data.viewerId);
  });

});


module.exports = app;
