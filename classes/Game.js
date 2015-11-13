function Game() {
    this._frameIndex = 0;
    this._paused = 0;
    this.counter = new Counter(3, this.init.bind(this));
    this._loadAudio();
    this._loadImages();
}
var _p = Game.prototype;

_p._loadAudio = function () {
    var self = this;
    loadAudioFiles(audioUrls, function (list) {
        audio = list;
        self._createSoundTrack();
        self.counter.count();
    });
};

_p._createSoundTrack = function () {
    this._audioList = ['darkAtmosphere', 'ambientWind', "TheCaveOfAncientWarriors", "findNothing"];
    this._soundtrack = new SoundTrack(this._audioList);
}

_p._loadImages = function () {
    var self = this;
    loadImages(images, function (imgList) {
        images = imgList;
        self.counter.count();
    });
};


_p.getFrameNr = function () {
    return this._frameIndex;
}

_p.init = function () {
    this._getCanvas();
    this._setCanvasSize();
    this._setCanvasEventHandlers();
    this._createGlobalObjects();
    this._play();
    this._soundtrack.play();
    toggleFullScreen();
}

_p._createGlobalObjects = function () {
    player = new Player();
    opponents = new OpponentManager(randomMap);
    objects = new GameObjectManager(randomMap);
}

_p._getCanvas = function () {
    canvas = document.getElementsByTagName('CANVAS')[0];
    ctx = canvas.getContext('2d');
}

_p._setCanvasSize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

_p._setCanvasEventHandlers = function () {
    // TODO: move to User.js
    window.addEventListener('resize', this._setCanvasSize);
}


_p._play = function () {
    if (this._paused)
        return;
    this._moveObjects();
    this._render();
    this._frameIndex++;
    window.requestAnimationFrame(this._play.bind(this));
}

_p._moveObjects = function () {
    player.move();
    objects.move();
    opponents.move();
    bullets.move();
}

_p._render = function () {
    canvas.clear();

    this._drawLights();
    this._drawVisibleElements();
    this._drawForeground();

    user.drawTooltip();
}

_p._drawLights = function () {
    player.drawLights();
    objects.drawLights();
}

_p._drawVisibleElements = function () {
    ctx.globalCompositeOperation = 'source-atop';
    objects.draw(ctx);
    opponents.draw();
    player.draw();
    bullets.draw(ctx);
    ctx.globalCompositeOperation = 'source-over';
}

_p._drawForeground = function () {
    objects.drawAtTheEnd();
}

_p.over = function () {
    this._paused = 1;
}