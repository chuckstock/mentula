
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
