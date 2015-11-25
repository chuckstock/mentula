//** GLOBALS **//
var socket = io();
var players = [];
var bullets;
var land;
var explosions;
var inputs = [
  {left: 1, right: 1, fire: false},
  //   {left: 1, right: 1, fire: false}
];

function Game() {}

Game.prototype = {
  init: function() {

  },

  preload: function() {
    game.load.image('land', 'assets/land.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.spritesheet('tank', 'assets/tanksheet.png', 42, 40);
  },

  create: function() {
    land = game.add.tileSprite(0, 0, 800, 600, 'land');
    socket.on('game-update', function(data) {
      inputs[data.player] = data;
    });
    players.push(new Tank(game, 0));
    // players.push(new Tank(game, 1));
    game.physics.startSystem(Phaser.Physics.ARCADE);

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(1, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
  },
  update: function() {
    for (var i = 0; i < players.length; i++) {
      // console.log(inputs);
      players[i].update()
    }
    // game.physics.arcade.collide(players[0].sprite, players[1].sprite);
  },
};

// Tank object constructor.
function Tank(game, controller) {
  this.game = game;
  var x = game.world.randomX;
  var y = game.world.randomY;
  this.velocity = 75;
  // Controller is the index of input array where this tanks inputs are stored.
  this.controller = controller;
  this.sprite = game.add.sprite(x, y, 'tank');
  this.sprite.frame = 1;
  this.sprite.animations.add('move', [0,1,2], 10, true);
  // this.sprite.animations.add('move', [0,1,2], 10, true);
  //set initial angle
  this.sprite.angle = -90;
  this.sprite.anchor.set(0.5, 0.5);

  // Enable arcade style physics on the tank.
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.immovable = false;
  // Keep the tank on the screen
  this.sprite.body.collideWorldBounds = true;
  this.sprite.body.bounce.setTo(1, 1);
  this.sprite.body.drag.set(0.2);
  this.sprite.body.maxVelocity.set(100);
  this.sprite.tint = 0x66ff66;

}

Tank.prototype = {
  update: function () {
    //** Steering and movement controls **//
    if (inputs[this.controller].left === 2 && inputs[this.controller].right === 2) {
      // Both tracks moving forward, move the tank forward
      game.physics.arcade.velocityFromAngle(this.sprite.angle, this.velocity, this.sprite.body.velocity);
      this.sprite.play('move');
    } else if (inputs[this.controller].left === 0 && inputs[this.controller].right === 0) {
      // Both tracks moving backward, move the tank backward. Reverse is the opposite angle of the tank front
      var reverse = this.sprite.angle > 0 ? this.sprite.angle - 180 : this.sprite.angle + 180;
      game.physics.arcade.velocityFromAngle(reverse, this.velocity, this.sprite.body.velocity);
      this.sprite.play('move');
    } else if (inputs[this.controller].left === 2 && inputs[this.controller].right === 1) {
      // Left track forward, right neutral, turn the tank right.
      this.sprite.angle += 1;
      game.physics.arcade.velocityFromAngle(this.sprite.angle, 0, this.sprite.body.velocity);
      this.sprite.play('move');
    } else if (inputs[this.controller].left === 1 && inputs[this.controller].right === 2) {
      // Left track neutral, right track forward, turn the tank left.
      this.sprite.angle -= 1;
      game.physics.arcade.velocityFromAngle(this.sprite.angle, 0, this.sprite.body.velocity);
      this.sprite.play('move');
    } else {
      // No inputs? Stop the tank.
      game.physics.arcade.velocityFromAngle(this.sprite.angle, 0, this.sprite.body.velocity);
      this.sprite.animations.stop();
    }
    //** Firing Controls **//
    if (inputs[this.controller].fire) {
      // Some logic for firing
      bullet = bullets.getFirstExists(false);
      if (bullet) {
        //  And fire it
        bullet.reset(this.sprite.x, this.sprite.y);
        game.physics.arcade.velocityFromAngle(this.sprite.angle, 400, bullet.body.velocity);
        // bullet.body.velocity.y = -400;
        // bulletTime = game.time.now + 200;
      }
    }
  },
}
