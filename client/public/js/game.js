
var inputs = []

function Tank(game) {
    this.game = game;
    var x = game.world.randomX;
    var y = game.world.randomY;
    this.velocity = 50;
    // this.drag = 0.2;
    // this.friction = 50;
    // this.maxVelocity = 100;
    this.controller = 0;
    this.sprite = game.add.sprite(x, y, 'tank');
    this.sprite.angle = -90;
    this.sprite.anchor.set(0.5, 0.5);

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = false;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.bounce.setTo(1, 1);

    this.sprite.body.drag.set(0.2);
    this.sprite.body.maxVelocity.set(100);

}

// function getReverseFromAngle(angle) {
//     if (angle > 0) {
//         return angle - 180;
//     } else {
//         return angle + 180;
//     }
// }

Tank.prototype = {
    update: function () {
        if (inputs[this.controller].left === 2 && inputs[this.controller].right === 2) {
            // Both tracks moving forward, move the tank forward
            game.physics.arcade.velocityFromAngle(this.sprite.angle, this.velocity, this.sprite.body.velocity);
        } else if (inputs[this.controller].left === 0 && inputs[this.controller].right === 0) {
            var reverse = this.sprite.angle > 0 ? this.sprite.angle - 180 : this.sprite.angle + 180;
            game.physics.arcade.velocityFromAngle(reverse, this.velocity, this.sprite.body.velocity);
        } else if (inputs[this.controller].left === 2 && inputs[this.controller].right === 1) {
            this.sprite.angle += 1;
            game.physics.arcade.velocityFromAngle(this.sprite.angle, 0, this.sprite.body.velocity);
        } else if (inputs[this.controller].left === 1 && inputs[this.controller].right === 2) {
            this.sprite.angle -= 1;
            game.physics.arcade.velocityFromAngle(this.sprite.angle, 0, this.sprite.body.velocity);
        } else {
            this.sprite.body.angularVelocity = 0;
            game.physics.arcade.velocityFromAngle(this.sprite.angle, 0, this.sprite.body.velocity);
        }

    },
}


var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var socket = io();


//** GLOBALS **//
var players = [];
var bullets;
var land;
var explosions;
var inputs = [{left: 1, right: 1, fire: false}];

function preload() {
    game.load.image('land', 'assets/land.png');
    game.load.image('tank', 'assets/tankwithturret.png');
}

function create() {
    land = game.add.tileSprite(0, 0, 800, 600, 'land');
    socket.on('gameUpdate', function(data) {
        inputs[data.player] = data;
    });
    players.push(new Tank(game));
    initPhysics();
}

function update() {
    for (var i = 0; i < players.length; i++) {
        players[i].update()
    }
}

function render() {
    game.debug.text('Inputs: ' + inputs);
}

function initPhysics() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

}

//
//
// var gameProperties = {
//   screenWidth: 500,
//   screenHeight: 500,
// };
//
// var states = {
//   game: "game",
// };
//
// var graphicAssets = {
//   tank:{URL:'assets/tankwithturret.png', name:'tank'}
//   // bullet:{URL:'../assets/bullet.png', name:'bullet'},
//
//   // asteroidLarge:{URL:'../assets/asteroidLarge.png', name:'asteroidLarge'},
//   // asteroidMedium:{URL:'../assets/asteroidMedium.png', name:'asteroidMedium'},
//   // asteroidSmall:{URL:'../assets/asteroidSmall.png', name:'asteroidSmall'},
// };
//
// var tankProperties = {
//   startX: gameProperties.screenWidth * 0.5,
//   startY: gameProperties.screenHeight * 0.5,
//   acceleration: 100,
//   drag: 100,
//   friction: 50,
//   maxVelocity: 100,
//   angularVelocity: 200,
// };
//
//
// // var gameState = function(game){
// //   var self = this
// //   this.tankSprite;
// //   this.data = {right: 1, left: 1, fire: false};
// // };
//
// function gameState(game){
//   var self = this;
//   this.tankSprite;
//   this.data = {right: 1, left: 1, fire: false};
// };
//
// gameState.prototype = {
//   preload: function () {
//     game.load.image(graphicAssets.tank.name, graphicAssets.tank.URL);
//   },
//
//   create: function () {
//     game.stage.backgroundColor = 0xffffff;
//     self.data = {right: 1, left: 1, fire: false};
//     this.initGraphics();
//     socket.on('gameUpdate', function(data) {
//       self.data = data;
//       //game.inputs[data.player] = data;
//
//     });
//     this.initPhysics();
//   },
//
//   initGraphics: function () {
//     this.tankSprite = game.add.sprite(tankProperties.startX, tankProperties.startY, graphicAssets.tank.name);
//     this.tankSprite.angle = -90;
//     this.tankSprite.anchor.set(0.5, 0.5);
//   },
//
//   initPhysics: function () {
//     game.physics.startSystem(Phaser.Physics.ARCADE);
//
//     game.physics.enable(this.tankSprite, Phaser.Physics.ARCADE);
//     this.tankSprite.body.drag.set(tankProperties.drag);
//     this.tankSprite.body.maxVelocity.set(tankProperties.maxVelocity);
//   },
//   checkBoundaries: function (sprite) {
//     if (sprite.x < 0) {
//       sprite.x = 0;
//     } else if (sprite.x > game.width) {
//       sprite.x = game.width;
//     }
//
//     if (sprite.y < 0) {
//       sprite.y = 0;
//     } else if (sprite.y > game.height) {
//       sprite.y = game.height;
//     }
//   },
// };
//
// var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
// game.state.add(states.game, gameState);
// game.state.start(states.game);
