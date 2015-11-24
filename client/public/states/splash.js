function Splash() {};

Splash.prototype = {
  loadScripts: function () {
    game.load.script('gamemenu','states/menu.js');
    game.load.script('game', 'states/game.js');
    game.load.script('gameover','states/gameover.js');
  },

  loadImages: function () {
    game.load.image('menu-bg', 'assets/goodbackground.jpg');
    game.load.image('gameover-bg', 'assets/background.jpg');
  },
  init: function() {
    this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, "loading");
    this.logo = game.make.sprite(game.world.centerX, 200, 'logo');
    this.status = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    // utils.centerGameObjects([this.logo, this.status]);
    this.logo.anchor.setTo(0.5);
    this.status.anchor.setTo(0.5);
  },

  // loadFonts: function () {
  // },
  //
  // The preload function then will call all of the previously defined functions:
  preload: function () {
    game.add.sprite(0, 0, 'background');
    game.add.existing(this.logo).scale.setTo(2.0);
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    this.loadScripts();
    this.loadImages();
    // this.loadFonts();
  },
  addGameStates: function() {
    game.state.add("Menu", Menu);
    game.state.add("Game", Game);
    game.state.add("GameOver", GameOver);
  },
  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();

    setTimeout(function() {

    }, 5000);
  }
}
