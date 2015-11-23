function startGame() {
    // Array to track inputs coming from the server. Server gets the inputs from the phone.
    var inputs = []

    //Bullet constructor
    // function Bullet(angle, x, y) {
    //     this.angle = angle;
    //     this.velocity = 200;
    //     this.sprite = game.add.sprite(x, y, 'bullet');
    // }
    // Bullet.prototype = {
    //     update: function() {
    //         game.physics.arcade.velocityFromAngle(this.angle, this.velocity, this.sprite.body.velocity);
    //     }
    // }



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


    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
    var socket = io();


    //** GLOBALS **//
    var players = [];
    var bullets;
    var land;
    var explosions;
    var inputs = [
      {left: 1, right: 1, fire: false},
    //   {left: 1, right: 1, fire: false}
    ];

    function preload() {
        game.load.image('land', 'assets/land.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.spritesheet('tank', 'assets/tanksheet.png', 42, 40);
    }

    function create() {
        land = game.add.tileSprite(0, 0, 800, 600, 'land');
        socket.on('game-update', function(data) {
            inputs[data.player] = data;
        });
        players.push(new Tank(game, 0));
        // players.push(new Tank(game, 1));
        initPhysics();

        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);


    }

    function update() {
        for (var i = 0; i < players.length; i++) {
            // console.log(inputs);
            players[i].update()
        }
        // game.physics.arcade.collide(players[0].sprite, players[1].sprite);
    }

    function render() {
        // game.debug.text('Inputs: ' + inputs);
    }

    function initPhysics() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

    }
}
