function Splash() {}

Splash.prototype = {
    loadScripts: function () {
        game.load.script('WebFont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js');
        game.load.script('gamemenu','states/menu.js');
        game.load.script('game', 'states/game.js');
        game.load.script('gameover','states/gameover.js');
    },
    loadImages: function () {
        //menu backgrounds
        game.load.image('menu-bg', 'assets/misc/background.jpg');


        //** GAME ASSETS **//
        game.load.image('land', 'assets/misc/floortile.png');
        game.load.image('bullet', 'assets/tank/bullet.png');

        //tank debris
        game.load.image('tank0debris1', 'assets/tank/debris/tank0debris1.png');
        game.load.image('tank0debris2', 'assets/tank/debris/tank0debris2.png');
        game.load.image('tank0debris3', 'assets/tank/debris/tank0debris3.png');
        game.load.image('tank1debris1', 'assets/tank/debris/tank1debris1.png');
        game.load.image('tank1debris2', 'assets/tank/debris/tank1debris2.png');
        game.load.image('tank1debris3', 'assets/tank/debris/tank1debris3.png');
        game.load.image('tank2debris1', 'assets/tank/debris/tank2debris1.png');
        game.load.image('tank2debris2', 'assets/tank/debris/tank2debris2.png');
        game.load.image('tank2debris3', 'assets/tank/debris/tank2debris3.png');
        game.load.image('tank3debris1', 'assets/tank/debris/tank3debris1.png');
        game.load.image('tank3debris2', 'assets/tank/debris/tank3debris2.png');
        game.load.image('tank3debris3', 'assets/tank/debris/tank3debris3.png');
        game.load.image('tankBurst', 'assets/tank/debris/tank-burst.png');

        // Obstacle assets
        game.load.image('obstacleSquare', 'assets/obstacles/obstacle-square.png');

        // Powerup Assets
        game.load.spritesheet('powerup', 'assets/powerups/powerup2.png', 32, 30);

        // ** Tank Sprite Sheets **//
        game.load.spritesheet('tank0', 'assets/tank/spritesheets/tanksheet.png', 42, 40);
        game.load.spritesheet('tank1', 'assets/tank/spritesheets/tanksheet2.png', 42, 40);
        game.load.spritesheet('tank2', 'assets/tank/spritesheets/tanksheet3.png', 42, 40);
        game.load.spritesheet('tank3', 'assets/tank/spritesheets/tanksheet4.png', 42, 40);
    },
    loadFonts: function () {
        WebFontConfig = {
            custom: {
                families: ['MGS', 'OR'],
                urls: ['assets/styles/mgs.css', 'assets/styles/or.css']
            }
        };
    },
    init: function() {
        this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, "loading");
        this.logo = game.make.sprite(game.world.centerX, 200, 'logo');
        this.status = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
        // utils.centerGameObjects([this.logo, this.status]);
        this.logo.anchor.setTo(0.5);
        this.status.anchor.setTo(0.5);
    },

    // The preload function then will call all of the previously defined functions:
    preload: function () {
        game.add.sprite(0, 0, 'background');
        game.add.existing(this.logo).scale.setTo(2.0);
        game.add.existing(this.loadingBar);
        game.add.existing(this.status);
        this.load.setPreloadSprite(this.loadingBar);

        this.loadScripts();
        this.loadImages();
        this.loadFonts();
    },
    addGameStates: function() {
        game.state.add('Menu', Menu);
        game.state.add('Game', Game);
        game.state.add('GameOver', GameOver);
    },
    create: function() {
        this.status.setText('Ready!');
        this.addGameStates();

        setTimeout(function() {
            game.state.start('Menu');
        }, 1000);
    }
};
