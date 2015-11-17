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

app.post('/user/add', function(req, res) {
  if (req.body.username && req.body.password) {
    new User({name:req.body.username, password:req.body.password}).save(function(err, user) {
      if (!err) {
        res.statusCode = 200;
        res.json({
          message: "User successfully created.",
          code: 200,
        });
      } else {
        if (err.code === 11000) {
          res.statusCode = 400;
          res.json({
            message: "That username already exists",
            code: 400
          });
        } else { throw err; }
      }
    });
  } else {
    res.statusCode = 400;
    res.json({
      message: "Must provide all fields",
      code: 400
    });
  }
});

io.on('connection', function(socket){
  //Do something here
});


module.exports = app;
