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
  acceleration: 100,
  drag: 100,
  friction: 50,
  maxVelocity: 100,
  angularVelocity: 200,
};


// var gameState = function(game){
//   var self = this
//   this.tankSprite;
//   this.data = {right: 1, left: 1, fire: false};
// };

function gameState(game){
  var self = this;
  this.tankSprite;
  this.data = {right: 1, left: 1, fire: false};
};

gameState.prototype = {
  preload: function () {
    game.load.image(graphicAssets.tank.name, graphicAssets.tank.URL);
  },

  create: function () {
    game.stage.backgroundColor = 0xffffff;
    self.data = {right: 1, left: 1, fire: false};
    this.initGraphics();
    socket.on('gameUpdate', function(data) {
      self.data = data;
      // console.log(self.data);
    });
    this.initPhysics();
  },
  update: function () {
    console.log(this.data, self.data);
    if (self.data.left === 2 && self.data.right === 2) {
      // Both tracks moving forward, move the tank forward
      game.physics.arcade.accelerationFromRotation(this.tankSprite.rotation, tankProperties.acceleration, this.tankSprite.body.acceleration);
    } else if (self.data.left === 0 && self.data.right === 0) {
      game.physics.arcade.accelerationFromRotation(-this.tankSprite.rotation, tankProperties.acceleration, this.tankSprite.body.acceleration);
    } else if (self.data.left === 2 && self.data.right === 1) {
      this.tankSprite.rotation += 0.01;
    } else if (self.data.left === 1 && self.data.right === 2) {
      this.tankSprite.rotation -= 0.01;
    }
    this.checkBoundaries(this.tankSprite);
  },
  initGraphics: function () {
    this.tankSprite = game.add.sprite(tankProperties.startX, tankProperties.startY, graphicAssets.tank.name);
    this.tankSprite.angle = -90;
    this.tankSprite.anchor.set(0.5, 0.5);
  },

  initPhysics: function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.enable(this.tankSprite, Phaser.Physics.ARCADE);
    this.tankSprite.body.drag.set(tankProperties.drag);
    this.tankSprite.body.maxVelocity.set(tankProperties.maxVelocity);
  },
  checkBoundaries: function (sprite) {
    if (sprite.x < 0) {
      sprite.x = 0;
    } else if (sprite.x > game.width) {
      sprite.x = game.width;
    }

    if (sprite.y < 0) {
      sprite.y = 0;
    } else if (sprite.y > game.height) {
      sprite.y = game.height;
    }
  },
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
