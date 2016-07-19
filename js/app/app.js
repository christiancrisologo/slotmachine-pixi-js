

"user strict";

(function () {

    //create the config to start the SlotMachine
    var c = new SlotConfig();

    c.container = document.body; // the DOM container  
    c.assetsJsonSrc = "images/sprite-mapping.json";
    this.audiosSrc = [
        ['audios/roll.mp3', 'audios/roll.ogg'],  //spin
        ['audios/slot.mp3', 'audios/slot.ogg'],  //btn
        ['audios/win.mp3', 'audios/win.ogg'],  //win
        ['audios/nowin.mp3', 'audios/nowin.ogg'], 
        ['audios/beep3.mp3', 'audios/beep3.ogg'],         
        ['audios/beep2.mp3', 'audios/beep2.ogg'], 
        ['audios/beep5.mp3', 'audios/beep5.ogg'],         
        ['audios/beep4.mp3', 'audios/beep4.ogg'], 
        ['audios/beep1.mp3', 'audios/beep1.ogg']
        
    ];
    this.bgSoundSrc = ['audios/bgsounds.mp3','audios/bgsounds.ogg'] //bg-sounds
    c.speed = 22;
    c.currentBalance = 100;
    c.loopCounter = 300;
    c.reels = [];
    // TEST DATA
    // c.reels.push([1, 5, 5, 5, 5, 1, 1, 1, 1, 2, 5, 5, 5, 5, 2]);
    // c.reels.push([1, 5, 5, 5, 5, 1, 1, 1, 1, 2, 5, 5, 5, 5, 2]);
    // c.reels.push([1, 5, 5, 5, 5, 1, 1, 1, 1, 2, 5, 5, 5, 5, 2]);
    // c.reels.push([1, 5, 5, 5, 5, 1, 1, 1, 1, 2, 5, 5, 5, 5, 2]);
    // c.reels.push([1, 5, 5, 5, 5, 1, 1, 1, 1, 2, 5, 5, 5, 5, 2]);

    c.reels.push([1, 5, 2, 1, 6, 5, 8, 5, 1, 2, 3, 7, 4, 5, 8, 1, 4, 3, 2, 5, 6]);
    c.reels.push([5, 1, 6, 3, 7, 8, 1, 3, 2, 4, 6, 8, 5, 4, 5, 3, 8, 7, 5, 4, 1, 7, 4, 8, 4]);
    c.reels.push([8, 4, 1, 3, 2, 6, 7, 2, 3, 4, 1, 5, 6, 7, 8, 2, 5, 4, 3, 1, 2, 7, 6, 7, 1, 4, 3, 2, 4]);
    c.reels.push([1, 7, 4, 2, 3, 8, 4, 3, 2, 5, 6, 7, 2, 3, 4, 5, 8, 1, 2, 6, 2, 4, 2, 6, 3, 7, 8, 4, 6, 2, 3, 1, 2, 5, 6, 3, 4]);
    c.reels.push([8, 5, 1, 8, 5, 1, 8, 5, 1, 8, 5, 1]);


    window.onload = function (e) {
        // the StotMachine 
        var slotmachine = new SlotMachine(c);

    };

} ());

