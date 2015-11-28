//** GLOBALS **//
// var socket = io();
var players = [];
var bullets;
var land;
var explosions;
var inputs = [];

function Game() {
    this.playerCount;
    this.gamepads = [];
}

Game.prototype = {
  init: function(playerCount) {
      this.playerCount = playerCount;
      console.log(playerCount);
      for (var i = 0; i <= playerCount; i++) {
          inputs.push({left: 1, right: 1, fire: false})
      }
      for (var i = 0; i < game.input.gamepad.padsConnected; i++) {
          this.gamepads.push({pad: game.input.gamepad['pad'+(i+1)], player: i})
      }
  },

  preload: function() {
    game.load.image('land', 'assets/floortile2.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.spritesheet('tank1', 'assets/tanksheet.png', 42, 40);
    game.load.spritesheet('tank2', 'assets/tanksheet2.png', 42, 40);
    game.load.spritesheet('tank3', 'assets/tanksheet3.png', 42, 40);
    game.load.spritesheet('tank4', 'assets/tanksheet4.png', 42, 40);
  },

  create: function() {
    land = game.add.tileSprite(0, 0, 800, 600, 'land');
    land.tint = 0x5396ac;
    land.filters = [ this.game.add.filter('Glow') ];

    socket.on('game-update', function(data) {
      inputs[data.player] = data;
    });
    for (var i = 0; i < this.playerCount; i++) {
        players.push(new Tank(game, i));
    }
    game.physics.startSystem(Phaser.Physics.ARCADE);

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(1, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('filters',[ this.game.add.filter('Glow') ]);
  },
    update: function() {
        this.getGamepadInput();
        for (var i = 0; i < players.length; i++) {
            // console.log(inputs);
            players[i].update()
        }
        // game.physics.arcade.collide(players[0].sprite, players[1].sprite);
    },
    getGamepadInput: function() {
        //   console.log(this.gamepads);
        for (var i = 0; i < this.gamepads.length; i++) {
            var pad = this.gamepads[i].pad;
            var player = this.gamepads[i].player;
            console.log(pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y));
            if (pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.5) {
                inputs[player].left = 2;
            } else if (pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.5) {
                inputs[player].left = 0;
            } else {
                inputs[player].left = 1;
            }
            if (pad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.5) {
                inputs[player].right = 2;
            } else if (pad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.5) {
                inputs[player].right = 0;
            } else {
                inputs[player].right = 1;
            }
            if (pad.isDown(Phaser.Gamepad.XBOX360_A)) {
                inputs[player].fire = true;
            } else {
                inputs[player].fire = false;
            }

        }

    }
};

// Tank object constructor.
function Tank(game, controller) {
  this.game = game;
  var x = game.world.randomX;
  var y = game.world.randomY;
  this.velocity = 75;
  // Controller is the index of input array where this tanks inputs are stored.
  this.controller = controller;
  this.sprite = game.add.sprite(x, y, 'tank1');
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
  this.sprite.filters = [ this.game.add.filter('Glow') ];

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
};

Phaser.Filter.Glow = function (game) {
    Phaser.Filter.call(this, game);

    this.fragmentSrc = [
        "precision lowp float;",
        "varying vec2 vTextureCoord;",
        "varying vec4 vColor;",
        'uniform sampler2D uSampler;',

        'void main() {',
            'vec4 sum = vec4(0);',
            'vec2 texcoord = vTextureCoord;',
            'for(int xx = -4; xx <= 4; xx++) {',
                'for(int yy = -3; yy <= 3; yy++) {',
                    'float dist = sqrt(float(xx*xx) + float(yy*yy));',
                    'float factor = 0.0;',
                    'if (dist == 0.0) {',
                        'factor = 2.0;',
                    '} else {',
                        'factor = 2.0/abs(float(dist));',
                    '}',
                    'sum += texture2D(uSampler, texcoord + vec2(xx, yy) * 0.002) * factor;',
                '}',
            '}',
            'gl_FragColor = sum * 0.025 + texture2D(uSampler, texcoord);',
        '}'
    ];
};

Phaser.Filter.Glow.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Glow.prototype.constructor = Phaser.Filter.Glow;
