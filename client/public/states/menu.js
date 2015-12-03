function Menu() {
    var self = this;
    this.gameRoom;
    this.viewerId;
    this.playerCount;
}


Menu.prototype = {
    init: function() {
        this.createGame();
        this.titleText = game.make.text(game.world.centerX, 100, 'Cyber Tanks ', {
            font: 'bold 60pt MGS',
            fill: '#30DEF8',
            align: 'center'
        });
        this.titleText.anchor.setTo(0.5);
        this.instructions = game.make.text(game.world.centerX, 250, 'Hit the "create game" button below \nto get you game id. Then visit this page \n on your phone and use the id to \n connect your phone to the game.', {
            font: '15pt CS',
            fill: '#FFFFFF',
            align: 'center'
        });
        this.instructions.anchor.setTo(0.5);
        game.input.gamepad.start();
        game.input.gamepad.onConnectCallback = function() {
            socket.emit('gamepad-player', {gameRoom: this.gameRoom})
        }.bind(this)
        game.input.gamepad.onDisconnectCallback = function() {
            this.playerCount--;
            // Remove player box
            // Send message to server decreasing player count
        }.bind(this)
    },
    create: function() {
        game.add.sprite(0, 0, 'menu-bg');
        game.add.existing(this.titleText);
        game.add.existing(this.instructions);
        socket.on('player-joined', function(data) {
            this.playerCount ? this.playerCount++ : this.playerCount = 1;
            this.addPlayerBox();
            if (this.playerCount >= 1) {
                this.addMenuStart();
            }
        }.bind(this));
        socket.on('success-create', function(data) {
            this.gameRoom = data.gameRoom;
            this.viewerId = data.viewerId;
            for (var i = 1; i <= game.input.gamepad.padsConnected; i++) {
                socket.emit('gamepad-player', {gameRoom: this.gameRoom});
            }
            this.createMenu = this.addMenuCreate();
        }.bind(this));
    },
    addMenuCreate: function() {
        var optionStyle = { font: '30pt CS', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
        var txt = game.make.text(200, game.world.centerY + 50, 'create game ', optionStyle);
        var onOver = function (target) {
            target.fill = "#FEFFD5";
            target.stroke = "rgba(200,200,200,0.5)";
        };
        var onOut = function (target) {
            target.fill = "white";
            target.stroke = "rgba(0,0,0,0)";
        };
        var onClick = function (target) {
            game.add.text(175, game.world.centerY + 50, 'game id: ' + this.gameRoom, {
                font: '30pt CS',
                fill: 'white',
                align: 'center',
                stroke: 'rgba(0,0,0,0)',
                strokeThickness: 4
            });
            if (self.playerCount >= 1) {
                self.addMenuStart();
            }
            target.destroy();
        }.bind(this);

        txt.stroke = "rgba(0,0,0,0";
        txt.strokeThickness = 4;
        txt.inputEnabled = true;
        txt.events.onInputUp.add(onClick);
        txt.events.onInputOver.add(onOver);
        txt.events.onInputOut.add(onOut);
        game.add.existing(txt);
        return txt;
    },
    createGame: function() {
        // Set gameRoom
        var tempGameRoom = Math.floor((Math.random() * 10000) + 10000);

        // Set viewerId
        var tempViewerId = Math.floor((Math.random() * 10000) + 10000);

        socket.emit('create-game', {gameRoom: tempGameRoom, viewerId: tempViewerId});
    },
    addMenuStart: function() {
        var optionStyle = { font: '30pt CS', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
        var txt = game.add.text(200, game.world.centerY + 150, 'Start Game ', optionStyle);
        var onOver = function (target) {
            target.fill = "#FEFFD5";
            target.stroke = "rgba(200,200,200,0.5)";
        };
        var onOut = function (target) {
            target.fill = "white";
            target.stroke = "rgba(0,0,0,0)";
        };
        var onClick = function() {
            socket.emit('game-started', {gameRoom: this.gameRoom});
            game.state.start('Game', false, false, this.playerCount);
        }.bind(this);
        txt.stroke = "rgba(0,0,0,0";
        txt.strokeThickness = 4;
        txt.inputEnabled = true;
        txt.events.onInputUp.add(onClick);
        txt.events.onInputOver.add(onOver);
        txt.events.onInputOut.add(onOut);
    },
    addPlayerBox: function() {
        game.add.text(this.playerCount*80, 500, ' ' + this.playerCount + ' ', {
            font: 'bold 20pt CS',
            fill: '#30DEF8',
            align: 'center',
            backgroundColor: 'white'
        });
    },
    preload: function () {
        this.playerCount;
    },
    update: function() {

    }
};
