/**
 * Created by : Christian Crisologo (http://cyndrix.com/port/)
 */

/**
 *  SlotMachine version 1.0 by Christian.Crisologo
 *  Designed and developed for Geco for job application   
 *  
 *  //Classes
 *  Player - for handling the player properties for storing scores and player info
 *  SlotConfig - configuration class with all the default properties
 *  Reel - a Pixi sprite class that handles the reel animations and other functions 
 *  ReelDictionary - configurable class as  reference for the slot tiles 
 *  CyButton - Pixi Sprite that will have all the default behavior of all buttons
 *  CyText - Pixi text with default style text
 *  Utils - static class for utility purposes 
 * 
 */

/**
 *  Inheritance Helper
 */

"user strict";

// function to inherit class 
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


var Player = (function () {
    function Player() {
        this.balance = 0;
        this.tempBalance = 0;
        this.currentBet = 0;
        this.playerName = "";
    }

    return Player;
} ());

/**
 *  Config Class
 */

var SlotConfig = (function () {
    function SlotConfig() {

        this.container = document.body;
        this.assetsJsonSrc = "images/sprite-mapping.json";
        this.audiosSrc = [
            ['audios/roll.mp3', 'audios/roll.ogg'],  //spin
            ['audios/slot.mp3', 'audios/slot.ogg'],  //btn
            ['audios/win.mp3', 'audios/win.ogg'],  //win
            ['audios/nowin.mp3', 'audios/nowin.ogg'] //no win
        ];
        this.speed = 25;
        this.visible_rows = 3;
        this.currentBalance = 100;
        this.maxBalance = 100;
        this.betStepper = 10;
        this.loopCounter = 800;
        this.reels = [];


        // TEST DATA

        this.reels.push([1, 5, 2, 1, 6, 5, 8, 5, 1, 2, 3, 7, 4, 5, 8, 1, 4, 3, 2, 5, 6]);
        this.reels.push([5, 1, 6, 3, 7, 8, 1, 3, 2, 4, 6, 8, 5, 4, 5, 3, 8, 7, 5, 4, 1, 7, 4, 8, 4]);
        this.reels.push([8, 4, 1, 3, 2, 6, 7, 2, 3, 4, 1, 5, 6, 7, 8, 2, 5, 4, 3, 1, 2, 7, 6, 7, 1, 4, 3, 2, 4]);
        this.reels.push([1, 7, 4, 2, 3, 8, 4, 3, 2, 5, 6, 7, 2, 3, 4, 5, 8, 1, 2, 6, 2, 4, 2, 6, 3, 7, 8, 4, 6, 2, 3, 1, 2, 5, 6, 3, 4]);
        this.reels.push([8, 5, 1, 8, 5, 1, 8, 5, 1, 8, 5, 1]);

    }
    return SlotConfig;

} ());



/**
 * static Dictionary , to configure points, id, name of reel
 * , extends/inherits the dictionary to add more properties
 */

var ReelDictionary = (function () {
    return {
        snowflake: {
            id: 1,
            win3: 250,
            win4: 500,
            win5: 1000,
            name: "snowflake"
        },
        sun: {
            id: 2,
            win3: 200,
            win4: 450,
            win5: 800,
            name: "sun"
        },
        sandglass: {
            id: 3,
            win3: 150,
            win4: 4000,
            win5: 700,
            name: "sandglass"
        },
        victory: {
            id: 4,
            win3: 100,
            win4: 350,
            win5: 600,
            name: "victory"
        },
        ace: {
            id: 5,
            win3: 90,
            win4: 300,
            win5: 700,
            name: "ace"
        },
        king: {
            id: 6,
            win3: 80,
            win4: 250,
            win5: 600,
            name: "king"
        },
        queen: {
            id: 7,
            win3: 70,
            win4: 200,
            win5: 500,
            name: "queen"
        },
        jack: {
            id: 8,
            win3: 60,
            win4: 100,
            win5: 400,
            name: "jack"
        },
        getPropByID: function (id) {
            for (var prop in this) {
                if (this[prop].id === id) {
                    return this[prop];
                }
            }
        },
        getNameByID: function (id) {
            for (var prop in this) {
                if (this[prop].id === id) {
                    return this[prop].name;
                }
            }
        },
        getScoresByID: function (id, num) {
            for (var prop in this) {
                if (this[prop].id === id) {
                    if (num === 3) {
                        return this[prop].win3;
                    } else if (num === 4) {
                        return this[prop].win4;
                    } else if (num === 5) {
                        return this[prop].win5;
                    } else {
                        return 0;
                    }
                }
            }
        },
        toString: function () {
            return '';//to follow
        }

    }
} ())



/**
 *  Reel Class inherits Sprite
 *  extends PIXI Sprite to inherits properties
 */

var Reel = (function (_super) {
    __extends(Reel, _super);

    function Reel(ids) {

        _super.call(this);
        this.ids = Utils.shuffleArray(ids); //create duplicate        
        this.initVars();
        this.spriteCount = this.ids.length;
        this.renderSprites();
    }
    Reel.prototype.initVars = function () {
        this.visibleRows = 3;
        this.speed = 20;
        this.spriteHeight = 0;
        this.loopCounter = 0;
        this.animationStatus = '';
        this.lastPos = 0;
        this.deltaSpeed = 0;
        this.targetPos = 0;
        this.results = [];
        this.lastResultPos = 0;

    }
    //populate sprite per ids
    Reel.prototype.renderSprites = function () {

        var PixiSprite = PIXI.Sprite,
            TextureCache = PIXI.utils.TextureCache;
        for (var i = 0; i < this.ids.length; i++) {
            var spriteName = ReelDictionary.getNameByID(this.ids[i]),
                s = new PixiSprite(TextureCache[spriteName]); // use ID instead of name
            s.data = ReelDictionary[spriteName];
            s.x = 0;
            s.y = i * (s.height);
            this.spriteHeight += s.height;
            this.addChild(s);
        };

    }

    Reel.prototype.shuffle = function () {
        this.ids = Utils.shuffleArray((this.ids));
        for (var i = 0; i < this.children.length; i++) {
            var s = this.getChildAt(i);
            this.ids.forEach(function (element, index, array) {
                if (element === s.data.id) {
                    s.y = s.height * index;
                }
            });
        }
    }



    Reel.prototype.reorder = function (pos) {
        for (var i = 0; i < this.children.length; i++) {
            var s = this.getChildAt(i);
            this.ids.forEach(function (element, index, array) {
                if (element === s.data.id) {
                    s.y = pos + (s.height * index);
                }
            });
        }
    }

    Reel.prototype.getResults = function () {
        var results = [],
            ctr = 0;

        while (results.length < this.visibleRows) {
            if (this.getChildAt(ctr).y >= 0) {
                results.push(this.getChildAt(ctr).data);
            }
            ctr = ctr > this.children.length - 1 ? 0 : ctr + 1;
        }
        return results;
    }

    Reel.prototype.animatePosY = function (spd, rows) {

        this.speed = spd || this.speed;
        this.visibleRows = rows || this.visibleRows;

        if (this.animationStatus === Constants.REEL_COMPLETING) {
            this.speed = 2; //slowdown before the animations end
        } else if (this.animationStatus === Constants.REEL_STOP) {

            return;
        }

        for (var i = 0; i < this.children.length; i++) {

            var s = this.getChildAt(i), ht = s.height;

            if (this.animationStatus === Constants.REEL_COMPLETING
                && s.y === 0) {
                this.animationStatus = Constants.REEL_STOP;

                return;
            }

            // when the reel touch the end , move the last sprite to top to keep the loop 
            if (s.y > ht * this.visibleRows &&
                this.animationStatus != Constants.REEL_COMPLETING) {
                s.y = this.getChildAt(this.lastPos).y - ht;
                this.lastPos = i;
            } else {
                s.y += this.speed;
            }


        }

    }



    return Reel;
} (PIXI.Sprite));



/**
 * Stylish Text inhirets the Pixi.Text class 
 */

var CyText = (function (_super) {
    __extends(CyText, _super);

    function CyText() {
        _super.call(this, '');
        this.defaultStyle = {

            font: 'bold italic 27px Arial',
            textAlign: 'center',
            color: '#fff',
            fill: '#F7EDCA',
            stroke: '#d62d05',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            // wordWrap: true,
            // wordWrapWidth: 440
        }
        this.style = this.defaultStyle;

    }
    CyText.prototype.updateStyle = function (newStyle) {
        for (var prop in this.defaultStyle) {
            for (var prop2 in newStyle) {
                if (prop === prop2) {
                    this.defaultStyle[prop] = newStyle[prop2];
                    break;
                }
            }
        }
        this.style = this.defaultStyle;
    }


    return CyText;
} (PIXI.Text))

/**
 *  Button Class supports hovers, mouserver....
 */

var CyButton = (function (_super) {
    __extends(CyButton, _super);

    function CyButton(normal, hover, down) {
        _super.call(this);
        this.textureButtonDown = down || normal;
        this.textureButtonOver = hover || normal;
        this.texture = this.textureButton = normal;
        this.interactive = true;
        this.buttonMode = true;
        this.isDown = false;
        this.isOver = false;
        this.enable = true;
        this.createHoverEffects();
    }

    CyButton.prototype.setEnable = function (flag) {
        this.alpha = flag ? 1 : .7;
        this.enable = flag;
    }

    CyButton.prototype.createHoverEffects = function () {
        var _t = this,
            onButtonDown = function () {
                if (!this.enable) return;
                this.isdown = true;
                this.texture = this.textureButtonDown;
                this.alpha = 1;
            },
            onButtonUp = function () {
                if (!this.enable) return;
                this.isdown = false;
                if (this.isOver) {
                    this.texture = this.textureButtonOver;
                } else {
                    this.texture = this.textureButton;
                }
            },
            onButtonOver = function () {
                if (!this.enable) return;
                this.isOver = true;
                if (this.isdown) {
                    return;
                }
                this.texture = this.textureButtonOver;
            },
            onButtonOut = function () {
                if (!this.enable) return;
                this.isOver = false;
                if (this.isdown) {
                    return;
                }
                this.texture = this.textureButton;
            }


        this.on('mousedown', onButtonDown)
            .on('touchstart', onButtonDown)
            // set the mouseup and touchend callback...
            .on('mouseup', onButtonUp)
            .on('touchend', onButtonUp)
            .on('mouseupoutside', onButtonUp)
            .on('touchendoutside', onButtonUp)
            // set the mouseover callback...
            .on('mouseover', onButtonOver)
            // set the mouseout callback...
            .on('mouseout', onButtonOut)

    }
    return CyButton;
} (PIXI.Sprite));


/**
 * CONSTANTS
 */
var Constants = (function () {
    return {
        STATE_RENDERING: 0,
        STATE_GAME_READY: 1,
        STATE_ANIMATING: 2,
        STATE_TEST_RESULT: 3,
        REEL_STOP: 0,
        REEL_COMPLETING: 1,
        REEL_PLAY: 2
    }
} ());


/**
 * UTILS
 */

var Utils = (function () {

    return {
        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },


        copyArray: function (array) {
            var copy = [];
            for (var i = 0; i < array.length; i++) {
                copy.push(array[i]);
            }
            return copy;
        },

        shuffleArray: function (array) {
            var i;

            for (i = array.length - 1; i > 0; i--) {
                var j = parseInt(Math.random() * i);
                var tmp = array[i];
                array[i] = array[j];
                array[j] = tmp;
            }
            return array;
        },

        findById: function (array, id) {
            return array.filter(function (item) {
                return item.id === id;
            });
        },

        getArrayCommonValue: function (array, index) {
            var val = 0,
                count = '',
                n = array.map(function (e) {
                    return index || Number(index) == 0 ? (e[index]) : e;
                });

            n.forEach(function (e) {
                var newMax = n.toString().split(e).length - 1;
                if (newMax > count) {
                    count = newMax;
                    val = e;
                }
            })

            return {
                list: n.filter(function (elem, pos) {
                    return elem === val;
                }),
                value: val,
                count: count

            }

        }

    }
} ());



/**
 * GameAudio using Howl 
 */
var GameAudio = (function () {

    function GameAudio(audiosSrc) {
        this.audios = audiosSrc.map(function (e) {
            return new Howl({ urls: e });
        });
    }

    GameAudio.prototype.play = function (id) {
        this.audios[id].play();
    }

    return GameAudio;
} ())





/**
 * MAIN CLASS
 */

var SlotMachine = (function () {

    function SlotMachine(config) {
        this.config = config || new SlotConfig();
        this.initVars();
        this.setupPixiJS();
        this.loadAssets();
    }

    SlotMachine.prototype.initVars = function () {
        this.stage = this.renderer = null;

        this.gameStatus = Constants.STATE_RENDERING;
        this.reels = [];
        this.enableButtons = false;
        this.player = new Player();
        this.player.balance = this.player.tempBalance = this.config.maxBalance;
        this.player.currentBet = 0;

        // game score board
        this.totalWinScores = this.currentBet = 0;
        // sprite objects

        this.container = this.config.container;
        this.gameBoard = this.reelContainer = null;

        //texts
        this.scoreText = this.balanceText = this.betText = null;

        //buttons
        this.spinBtn = this.upBetBtn = this.downBetBtn = null;

        //patterns icons
        this.patternIcons = [];



        //sounds
        this.audios = null;
    }

    SlotMachine.prototype.setupPixiJS = function () {
        this.stage = new PIXI.Container();
        this.renderer = PIXI.autoDetectRenderer(
            this.container.innerWidth,
            this.container.innerHeight,
            {
                antialiasing: false,
                transparent: false,
                background: 0x000000,
                resolution: 1
            }
        );
        this.container.appendChild(this.renderer.view);
        this.stage.interactive = true;

    }

    SlotMachine.prototype.loadAssets = function () {
        var _t = this,
            loader = PIXI.loader;

        // load audios
        this.audios = new GameAudio(this.config.audiosSrc);

        // load and render UIs
        loader
            .add(_t.config.assetsJsonSrc)
            .load(function () {
                _t.renderAssets();
                //_t.reelTest();
            });



    }

    SlotMachine.prototype.setEnableButtons = function (flag) {
        this.spinBtn.setEnable(flag);
        this.upBetBtn.setEnable(flag);
        this.downBetBtn.setEnable(flag);
        this.enableButtons = flag;
    }



    SlotMachine.prototype.renderAssets = function () {
        var _t = this,
            TextureCache = PIXI.utils.TextureCache,
            PixiSprite = PIXI.Sprite;

        //set gameboard background    

        this.gameBoard = new PixiSprite(TextureCache['gameboard']);
        this.gameBoard.x = 0; this.gameBoard.y = 0;
        this.stage.addChild(this.gameBoard);

        // create reels and store it to reels array
        this.reelContainer = new PIXI.Container();
        for (var i = 0; i < this.config.reels.length; i++) {
            var r = new Reel(this.config.reels[i]);
            r.x = 150 * i; //width
            r.y = 0;
            this.reels.push(r);
            this.reelContainer.addChild(r);
        }
        this.reelContainer.x = 23;
        this.reelContainer.y = 73;
        this.stage.addChild(this.reelContainer);





        //spin button
        this.spinBtn = new CyButton(TextureCache['spinbutton'],
            TextureCache['spinbutton-hover']);
        this.spinBtn.x = 620; this.spinBtn.y = 435;

        this.spinBtn.on('click', function () {
            if (_t.enableButtons) {
                _t.spinReels();
                _t.audios.play(0);
            }
        });
        this.spinBtn.on('tap', function () {
            if (_t.enableButtons) {
                _t.spinReels();
                _t.audios.play(0);
            }

        });
        this.stage.addChild(this.spinBtn);


        // up bet button
        this.upBetBtn = new CyButton(TextureCache['upbet'],
            TextureCache['upbet-hover']);
        this.upBetBtn.x = 200; this.upBetBtn.y = 450;
        this.upBetBtn.on('click', function () {
            if (_t.enableButtons) {
                _t.updateBet('up');
                _t.audios.play(1);
            }
        });
        this.upBetBtn.on('tap', function () {
            if (_t.enableButtons) {
                _t.updateBet('up');
                _t.audios.play(1);
            }
        });


        this.stage.addChild(this.upBetBtn);

        // down bet button
        this.downBetBtn = new CyButton(TextureCache['downbet'],
            TextureCache['downbet-hover']);
        this.downBetBtn.x = 280; this.downBetBtn.y = 450;
        this.downBetBtn.on('click', function () {
            if (_t.enableButtons) {
                _t.updateBet('down');
                _t.audios.play(1);
            }
        });
        this.downBetBtn.on('tap', function () {
            if (_t.enableButtons) {
                _t.updateBet('down');
                _t.audios.play(1);
            }
        });
        this.stage.addChild(this.downBetBtn);

        // render texts
        this.scoreText = new CyText();
        this.scoreText.x = 320;
        this.scoreText.y = 24;
        this.stage.addChild(this.scoreText);

        this.betText = new CyText();
        this.betText.updateStyle({ stroke: '#a00172' });
        this.betText.x = 70;
        this.betText.y = 470;
        this.stage.addChild(this.betText);

        this.balanceText = new CyText();
        this.balanceText.updateStyle({ stroke: '#024b54' });
        this.balanceText.x = 400;
        this.balanceText.y = 470;
        this.stage.addChild(this.balanceText);

        // update texts 
        this.updateBalance(this.player.balance);
        this.updateWinScore(this.totalWinScores);
        this.updateBetText(this.currentBet);

        //set mask 
        var masker = new PIXI.Graphics();
        masker.beginFill(0xFF3300);
        masker.lineStyle(10, 0xffd900, 1);
        masker.drawRect(0, 0, 755, 355);
        masker.x = 23;
        masker.y = 73;
        this.stage.addChild(masker);
        this.reelContainer.mask = masker;

        this.startGame();
    }


    SlotMachine.prototype.startGame = function () {
        var _t = this;
        this.setEnableButtons(true);
        var animate = function () {
            //reelAnim();
            _t.draw();
            _t.renderer.render(_t.stage);
            requestAnimationFrame(animate);
        }

        animate();
    }

    SlotMachine.prototype.testResult = function () {
        var ids, nReels = [];

        for (var i = 0; i < this.reels.length; i++) {
            var r = this.reels[i];
            nReels.push(r.getResults());
        }

        ids = nReels.map(function (e) {
            return e.map(function (e1) {
                return e1.id;
            });
        })

        //test straight line
        var testHorizontal = function (row) {
            var n = 0,
                obj = Utils.getArrayCommonValue([].concat(ids), row);
            obj.list.forEach(function (e) {
                if (obj.count >= 3)
                    n += ReelDictionary.getScoresByID(obj.value, obj.count);
            })
            return n;
        }
        //test straight diagonals
        var testDiagonalDown = function () {
            var n = 0,
                tmp = [ids[0][0], ids[1][1], ids[2][2], ids[1][3], ids[0][4]],
                obj = Utils.getArrayCommonValue(tmp);
            if (obj.count >= 3)
                n += ReelDictionary.getScoresByID(obj.value, obj.count);
            return n;
        }

        var testDiagonalUp = function () {
            var n = 0,
                tmp = [ids[2][0], ids[1][1], ids[0][2], ids[1][3], ids[2][4]],
                obj = Utils.getArrayCommonValue(tmp);
            if (obj.count >= 3)
                n += ReelDictionary.getScoresByID(obj.value, obj.count);
            return n;
        }

        var scores = testHorizontal(0);
        scores += testHorizontal(1);
        scores += testHorizontal(2);
        scores += testDiagonalDown();
        scores += testDiagonalUp();

        this.updateScores(scores);
    }

    SlotMachine.prototype.updateBet = function (flag) {
        if (flag === "up") {
            if (this.player.tempBalance >= this.config.betStepper) {
                this.player.currentBet += this.config.betStepper;
                this.player.tempBalance -= this.config.betStepper;
            }
        } else {
            if (this.player.currentBet >= this.config.betStepper &&
                this.player.tempBalance < this.player.balance) {
                this.player.currentBet -= this.config.betStepper;
                this.player.tempBalance += this.config.betStepper;
            }
        }
        this.updateBetText(this.player.currentBet);
        this.updateBalance(this.player.tempBalance);
    }

    SlotMachine.prototype.updateScores = function (scores) {
        this.updateWinScore(scores);
        if (scores <= 0) {
            if (this.player.tempBalance <= 0) {
                this.player.balance = 0;
                this.player.currentBet = 0;
                this.setEnableButtons(false);
            }
            this.player.balance = this.player.tempBalance;
            this.audios.play(3);
        } else {
            if (this.player.currentBet > 0) {
                this.player.balance += scores;
            }
            this.audios.play(2);
        }
        if (this.player.currentBet > this.player.balance) {
            if (this.player.balance > this.betStepper) {
                this.player.currentBet = this.player.balance - this.betStepper;
            } else {
                this.player.currentBet = 0
            }
        }
        this.player.tempBalance = this.player.balance;
        this.updateBalance(this.player.balance);
        this.updateBetText(this.player.currentBet);

    }

    SlotMachine.prototype.updateBalance = function (text) {
        this.balanceText.text = "$ " + text;
    }

    SlotMachine.prototype.updateWinScore = function (text) {
        this.scoreText.text = "$ " + text;
    }

    SlotMachine.prototype.updateBetText = function (text) {
        this.betText.text = "$ " + text;
    }


    SlotMachine.prototype.draw = function () {
        var _t = this;
        switch (_t.gameStatus) {
            case Constants.STATE_RENDERING:
                this.gameStatus = Constants.STATE_GAME_READY;
                break;
            case Constants.STATE_GAME_READY:

                break;
            case Constants.STATE_ANIMATING:

                var resultReady = false;

                for (var i = 0; i < _t.reels.length; i++) {
                    var r = _t.reels[i];
                    r.animatePosY(_t.config.speed, _t.config.visible_rows);
                    r.loopCounter -= _t.config.speed;
                    if (r.loopCounter <= 0 && r.animationStatus != Constants.REEL_STOP) {
                        r.animationStatus = Constants.REEL_COMPLETING;
                    }

                    resultReady = (r.animationStatus === Constants.REEL_STOP);
                }

                if (resultReady) {
                    _t.gameStatus = Constants.STATE_TEST_RESULT;
                }
                break;
            case Constants.STATE_TEST_RESULT:

                _t.testResult();
                _t.setEnableButtons(true);
                this.gameStatus = Constants.STATE_GAME_READY;
                return;


            default:
                break;
        }
    }

    SlotMachine.prototype.spinReels = function () {
        var _t = this;

        if (this.gameStatus === Constants.STATE_GAME_READY) {
            _t.setEnableButtons(false);
            for (var i = _t.reels.length - 1; i > -1; i--) {
                var rr = _t.reels[i];
                rr.loopCounter = _t.config.loopCounter * (i + 1);
                rr.shuffle();
                //rr.targetPos = 0;
                rr.animationStatus = Constants.REEL_PLAY;
            }

            this.gameStatus = Constants.STATE_ANIMATING;
            this.draw();
        }

    }


    return SlotMachine;
} ())

