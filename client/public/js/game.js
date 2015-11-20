var socket = io();

var gameProperties = {
  screenWidth: 500,
  screenHeight: 500,
};

var states = {
  game: "game",
};

var graphicAssets = {
  tank:{URL:'assets/tankwithturret.png', name:'tank'}
  // bullet:{URL:'../assets/bullet.png', name:'bullet'},

  // asteroidLarge:{URL:'../assets/asteroidLarge.png', name:'asteroidLarge'},
  // asteroidMedium:{URL:'../assets/asteroidMedium.png', name:'asteroidMedium'},
  // asteroidSmall:{URL:'../assets/asteroidSmall.png', name:'asteroidSmall'},
};

var tankProperties = {
  startX: gameProperties.screenWidth * 0.5,
  startY: gameProperties.screenHeight * 0.5,
};


var gameState = function(game){
  this.tankSprite;
  socket.on('test', function() {
    console.log('talkin to the server');
  });
};

gameState.prototype = {

  preload: function () {

    game.load.image(graphicAssets.tank.name, graphicAssets.tank.URL);
  },

  create: function () {
    game.stage.backgroundColor = 0xffffff;
    this.initGraphics();
    socket.on('gameUpdate', function(data) {
      console.log(data);
    });
  },

  update: function () {

  },
  initGraphics: function () {
    this.tankSprite = game.add.sprite(tankProperties.startX, tankProperties.startY, graphicAssets.tank.name);
    this.tankSprite.angle = -90;
    this.tankSprite.anchor.set(0.5, 0.5);
  },
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
