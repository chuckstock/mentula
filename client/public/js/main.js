var socket = io();

var game = new Phaser.Game(window.innerHeight, window.innerHeight, Phaser.AUTO, 'Cyber-Tanks');
function Main() {}

Main.prototype = {
    preload: function() {
        game.load.image('background', 'assets/misc/background.jpg');
        game.load.image('loading', 'assets/misc/loading.png');
        game.load.image('logo', 'assets/misc/tankwithturret.png');
        game.load.script('splash', 'states/splash.js');
    },
    create: function() {
        game.state.add('Splash', Splash);
        game.state.start('Splash');
    }
};

game.state.add('Main', Main);
game.state.start('Main');
