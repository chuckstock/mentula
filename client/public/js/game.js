// Array to track inputs coming from the server. Server gets the inputs from the phone.
var inputs = []

// Tank object constructor.
function Tank(game) {
    this.game = game;
    var x = game.world.randomX;
    var y = game.world.randomY;
    this.velocity = 50;
    // Controller is the index of input array where this tanks inputs are stored.
    this.controller = 0;
    this.sprite = game.add.sprite(x, y, 'tank');
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

}

Tank.prototype = {
    update: function () {
        if (inputs[this.controller].left === 2 && inputs[this.controller].right === 2) {
            // Both tracks moving forward, move the tank forward
            game.physics.arcade.velocityFromAngle(this.sprite.angle, this.velocity, this.sprite.body.velocity);
        } else if (inputs[this.controller].left === 0 && inputs[this.controller].right === 0) {
            // Both tracks moving backward, move the tank backward. Reverse is the opposite angle of the tank front
            var reverse = this.sprite.angle > 0 ? this.sprite.angle - 180 : this.sprite.angle + 180;
            game.physics.arcade.velocityFromAngle(reverse, this.velocity, this.sprite.body.velocity);
        } else if (inputs[this.controller].left === 2 && inputs[this.controller].right === 1) {
            // Left track forward, right neutral, turn the tank right.
            this.sprite.angle += 1;
            game.physics.arcade.velocityFromAngle(this.sprite.angle, 0, this.sprite.body.velocity);
        } else if (inputs[this.controller].left === 1 && inputs[this.controller].right === 2) {
            // Left track neutral, right track forward, turn the tank left.
            this.sprite.angle -= 1;
            game.physics.arcade.velocityFromAngle(this.sprite.angle, 0, this.sprite.body.velocity);
        } else {
            // No inputs? Stop the tank.
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
    socket.on('game-update', function(data) {
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
