//** GLOBALS **//
// var socket = io();
var players = [];
var bullets;
var land;
var obstacles;
var inputs = [];
var emitter = null;


function Game() {
  this.playerCount;
  this.gamepads = [];
}

Game.prototype = {
  init: function(playerCount) {
    this.playerCount = playerCount;
    console.log(playerCount);
    for (var i = 0; i <= playerCount; i++) {
      inputs.push({left: 1, right: 1, fire: false});
    }
    for (var k = 0; k < game.input.gamepad.padsConnected; k++) {
      this.gamepads.push({pad: game.input.gamepad['pad'+(k+1)], player: k});
    }
  },

  preload: function() {
    game.load.image('land', 'assets/floortile3.png');
    game.load.image('bullet', 'assets/bullet.png');

    //tank debris
    game.load.image('tank0debris1', 'assets/tank0debris1.png');
    game.load.image('tank0debris2', 'assets/tank0debris2.png');
    game.load.image('tank0debris3', 'assets/tank0debris3.png');
    game.load.image('tank1debris1', 'assets/tank1debris1.png');
    game.load.image('tank1debris2', 'assets/tank1debris2.png');
    game.load.image('tank1debris3', 'assets/tank1debris3.png');
    game.load.image('tank2debris1', 'assets/tank2debris1.png');
    game.load.image('tank2debris2', 'assets/tank2debris2.png');
    game.load.image('tank2debris3', 'assets/tank2debris3.png');
    game.load.image('tank3debris1', 'assets/tank3debris1.png');
    game.load.image('tank3debris2', 'assets/tank3debris2.png');
    game.load.image('tank3debris3', 'assets/tank3debris3.png');

    game.load.image('tankBurst', 'assets/tank-burst.png');
    game.load.spritesheet('tank0', 'assets/tanksheet.png', 42, 40);
    game.load.spritesheet('tank1', 'assets/tanksheet2.png', 42, 40);
    game.load.spritesheet('tank2', 'assets/tanksheet3.png', 42, 40);
    game.load.spritesheet('tank3', 'assets/tanksheet4.png', 42, 40);

    // Obstacle assets
    game.load.image('obstacleSquare', 'assets/obstacle-square.png');
    game.load.image('obstacleL1', 'assets/obstacle-L1.png');
    game.load.image('obstacleL2', 'assets/obstacle-L2.png');

  },

  create: function() {
    land = game.add.sprite(0, 0, 'land');
    land.tint = 0x5396ac;
    land.filters = [ this.game.add.filter('Glow') ];
    land.height = window.innerHeight;
    land.width = window.innerHeight;

    socket.on('game-update', function(data) {
      inputs[data.player] = data;
    });
    for (var i = 0; i < this.playerCount; i++) {
      players.push(new Tank(game, i));
    }
    game.physics.startSystem(Phaser.Physics.ARCADE);

    emitter = game.add.group();
    obstacles = game.add.group();

    // for (var i = 1; i <= 4; i++) {
    //     for (var j = 0; j < 3; j++) {
            new ObstacleSquare(50,50, 0.5)
    //     }
    // }

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    // bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('body.collideWorldBounds', true);
    bullets.setAll('body.bounce.x', 1);
    bullets.setAll('body.bounce.y', 1);

    bullets.setAll('filters',[ this.game.add.filter('Glow') ]);
  },
  update: function() {
    this.getGamepadInput();
    for (var i = 0; i < players.length; i++) {
      if (players[i].sprite.alive) {
        players[i].update();
        game.physics.arcade.overlap(bullets, players[i].sprite, handleBulletCollision, null, this);
      }
    }
    game.physics.arcade.collide(bullets, obstacles);
    for (var k = 0; k < players.length; k++) {
        game.physics.arcade.collide(players[k].sprite, obstacles);
      for (var l = 0; l < players.length; l++) {
        game.physics.arcade.collide(players[k].sprite, players[l].sprite);
      }
    }

  },
  getGamepadInput: function() {
    //   console.log(this.gamepads);
    for (var i = 0; i < this.gamepads.length; i++) {
      var pad = this.gamepads[i].pad;
      var player = this.gamepads[i].player;
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
      if (pad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)) {
        inputs[player].fire = true;
      } else {
        inputs[player].fire = false;
      }

    }

  }
};


// Tank object constructor.
function Tank(game, controller) {
  var x, y, startAngle;
  this.game = game;
  this.rotation;
  switch (true) {
      case controller == 0:
          x = this.game.world.width * 0.25;
          y = this.game.world.height * 0.25;
          startAngle = 0;
          this.rotation = 90;
          break;
      case controller == 1:
          x = this.game.world.width * 0.75;
          y = this.game.world.height * 0.25;
          startAngle = 180;
          this.rotation = 270;
          break;
      case controller == 2:
          x = this.game.world.height * 0.25;
          y = this.game.world.width * 0.75;
          startAngle = 0;
          this.rotation = 90;
          break;
      case controller == 3:
          x = this.game.world.height * 0.75;
          y = this.game.world.width * 0.75;
          startAngle = 180;
          this.rotation = 270;
          break;
  }

  this.velocity = 125;
  this.fireRate = 1000;
  this.nextFire = 0;
  this.colors = [0x00cc00, 0x1a75ff, 0xe5e600, 0xe67300];
  // Controller is the index of input array where this tanks inputs are stored.
  this.controller = controller;
  this.sprite = game.add.sprite(x, y, 'tank' + (this.controller));
  this.sprite.health = 100;
  this.sprite.frame = 1;
  this.sprite.animations.add('move', [0,1,2], 10, true);
  // this.sprite.animations.add('move', [0,1,2], 10, true);
  //set initial angle
  this.sprite.angle = startAngle;
  this.sprite.anchor.set(0.5, 0.5);

  // Enable arcade style physics on the tank.
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.immovable = false;
  // Keep the tank on the screen
  this.sprite.body.collideWorldBounds = true;
  this.sprite.body.bounce.setTo(1, 1);
  this.sprite.body.drag.set(0.2);
  this.sprite.body.maxVelocity.set(100);
  this.sprite.tint = this.colors[this.controller];
  this.sprite.filters = [ this.game.add.filter('Glow') ];

}

Tank.prototype = {
  update: function () {
    //** Check heatlh **//
    if (this.sprite.health <= 0 && this.sprite.alive) {
      this.sprite.kill();
      this.die();

      //** Particle Explosion **//
      var tint = this.sprite.tint;
      emitter.forEachAlive(function(p){
        p.alpha = p.lifespan / emitter.lifespan;
        p.tint = tint;
        p.scale.setTo(0.5, 0.5);
      });

    }


    if (this.rotation > 360){
      this.rotation = this.rotation - 360;
    } else if (this.rotation < 0) {
      this.rotation = 360 + this.rotation;
    }

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
      this.rotation += 1;
      game.physics.arcade.velocityFromAngle(this.sprite.angle, 0, this.sprite.body.velocity);
      this.sprite.play('move');
    } else if (inputs[this.controller].left === 1 && inputs[this.controller].right === 2) {
      // Left track neutral, right track forward, turn the tank left.
      this.sprite.angle -= 1;
      this.rotation -= 1;
      game.physics.arcade.velocityFromAngle(this.sprite.angle, 0, this.sprite.body.velocity);
      this.sprite.play('move');
    } else if (inputs[this.controller].left === 0 && inputs[this.controller].right === 1) {
      // Left track reverse, right track neutral, turn the tank left.
      this.sprite.angle -= 1;
      this.rotation -= 1;
      game.physics.arcade.velocityFromAngle(this.sprite.angle, 0, this.sprite.body.velocity);
      this.sprite.play('move');
    } else if (inputs[this.controller].left === 1 && inputs[this.controller].right === 0) {
      // Left track neutral, right track reverse, turn the tank right.
      this.sprite.angle += 1;
      this.rotation += 1;
      game.physics.arcade.velocityFromAngle(this.sprite.angle, 0, this.sprite.body.velocity);
      this.sprite.play('move');
    } else if (inputs[this.controller].left === 2 && inputs[this.controller].right === 0) {
      // Left track forward, right track reverse, turn the tank fast right.
      this.sprite.angle += 3;
      this.rotation += 3;
      game.physics.arcade.velocityFromAngle(this.sprite.angle, 0, this.sprite.body.velocity);
      this.sprite.play('move');
    } else if (inputs[this.controller].left === 0 && inputs[this.controller].right === 2) {
      // Left track reverse, right track forward, turn the tank fast left.
      this.sprite.angle -= 3;
      this.rotation -= 3;
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
      if (bullet && this.game.time.now > this.nextFire) {
        //  And fire it
        var radians = this.rotation * (Math.PI/180);
        vector = {};
        vector.x = 33 * Math.sin(radians);
        vector.y = 33 * Math.cos(radians);
        if (this.rotation >= 0 && this.rotation <= 90) {
          bullet.reset(this.sprite.x + vector.x, this.sprite.y - vector.y);
        } else if (this.rotation > 90 && this.rotation <= 180) {
          bullet.reset(this.sprite.x + vector.x, this.sprite.y - vector.y);
        } else if (this.rotation > 180 && this.rotation <= 270) {
          bullet.reset(this.sprite.x + vector.x, this.sprite.y - vector.y);
        } else if (this.rotation > 270 && this.rotation <= 360) {
          bullet.reset(this.sprite.x + vector.x, this.sprite.y - vector.y);
        }
        bullet.lifespan = 2000;

        bullet.angle = this.sprite.angle;
        game.physics.arcade.velocityFromAngle(this.sprite.angle, 400, bullet.body.velocity);
        // console.log(bullet);

        this.nextFire = this.game.time.now + this.fireRate;
      }
    }
  },
  die: function() {
    //create sprites for each debris piece
    var piece1 = game.add.sprite(this.sprite.x, this.sprite.y, 'tank'+ (this.controller) + 'debris1');
    var piece2 = game.add.sprite(this.sprite.x, this.sprite.y, 'tank' + (this.controller) + 'debris2');
    var piece3 = game.add.sprite(this.sprite.x, this.sprite.y, 'tank' + (this.controller) + 'debris3');

    //enable physics on each debris piece and set tint
    game.physics.enable(piece1, Phaser.Physics.ARCADE);
    game.physics.enable(piece2, Phaser.Physics.ARCADE);
    game.physics.enable(piece3, Phaser.Physics.ARCADE);
    piece1.anchor.set(0.5, 0.5);
    piece2.anchor.set(0.5, 0.5);
    piece3.anchor.set(0.5, 0.5);
    piece1.tint = this.sprite.tint;
    piece2.tint = this.sprite.tint;
    piece3.tint = this.sprite.tint;
    piece1.outOfBoundsKill = true;
    piece2.outOfBoundsKill = true;
    piece3.outOfBoundsKill = true;


    //shoot out pieces and specified angle and velocities
    var angle1 = (Math.random() * 90);
    var angle2 = (Math.random() * 90) + 90;
    var angle3 = -(Math.random() * 90) - 45;
    game.physics.arcade.velocityFromAngle(angle1, 200, piece1.body.velocity);
    game.physics.arcade.velocityFromAngle(angle2, 200, piece2.body.velocity);
    game.physics.arcade.velocityFromAngle(angle3, 200, piece3.body.velocity);

    //adds spin to each piece of debris
    piece1.body.angularVelocity = 400;
    piece2.body.angularVelocity = 400;
    piece3.body.angularVelocity = 400;

    //** PARTICLE STROM ON DEATH **//
    emitter = game.add.emitter(this.sprite.x, this.sprite.y, 200);
    emitter.makeParticles('tankBurst');
    emitter.lifespan = 750;
    emitter.gravity = 0;
    emitter.start(true, 750, null, 150);


  }
};


function quadrantSeperator() {
    this.sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'seperator');
}

function Obstacle(x, y, scale) {
    var scale = scale || 1;
    this.sprite = game.add.sprite(x, y, 'obstacleSquare')
    this.sprite.filters = [game.add.filter('Glow')]
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = true;
    this.sprite.scale.setTo(scale);
    // this.sprite.body.bounce.setTo(1, 1);
    this.sprite.body.drag.set(200);
    console.log('creating obstacle: '+ x + ' ' + y);
}


function handleBulletCollision(tank, bullet) {
  bullet.kill();
  tank.health -= 50;
}

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
