#!/usr/bin/env node

var app = require('./app');




app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

// add socket stuff here!

var io = require('socket.io')(server);

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message',socket.id+" "+msg);
  });
});
