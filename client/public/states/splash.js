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
        game.load.image('menu-bg', 'assets/goodbackground.jpg');
        game.load.image('gameover-bg', 'assets/background1.jpg');


        //** GAME ASSETS **//

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

        // Obstacle assets
        game.load.image('obstacleSquare', 'assets/obstacle-square.png');

        // Powerup Assets
        game.load.spritesheet('powerup', 'assets/powerup2.png', 32, 30);

        // ** Tank Sprite Sheets **//
        game.load.spritesheet('tank0', 'assets/tanksheet.png', 42, 40);
        game.load.spritesheet('tank1', 'assets/tanksheet2.png', 42, 40);
        game.load.spritesheet('tank2', 'assets/tanksheet3.png', 42, 40);
        game.load.spritesheet('tank3', 'assets/tanksheet4.png', 42, 40);
    },
    loadFonts: function () {
        WebFontConfig = {
            custom: {
                families: ['MGS', 'CS', 'EK', 'PD', 'NP'],
                urls: ['assets/styles/mgs.css', 'assets/styles/cyber-space.css', 'assets/styles/earth-kid.css', 'assets/styles/perfect-dark.css', 'assets/styles/neuropol.css']
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
