function Keyboard() {
    this._keyActive = {};
    this._keys = {};
    this._watchers = {};

    this._setKeyNames();
    this._set0();
    this._handleEvents();
}
var _p = Keyboard.prototype;

_p.getKeys = function () {
    return this._keyActive;
}

_p.watch = function (keyName, onKeyDown, onKeyUp) {
    this._watchers[keyName].push({
        keyUp: onKeyUp,
        keyDown: onKeyDown
    });
}

_p.trigger = function (keyName, type) {
    for (var i = 0; i < this._watchers[keyName].length; i++) {
        if (typeof this._watchers[keyName][i][type] == 'function') {
            this._watchers[keyName][i][type]();
        }
    }
}

_p._setKeyNames = function () {
    var keys = {
        8: 'Backspace',
        9: 'tab',
        13: 'enter',
        16: 'shift',
        17: 'ctrl',
        18: 'alt',
        19: 'Pause/Break',
        20: 'Caps lock',
        27: 'Escape',
        32: 'space',
        33: 'Page up',
        34: 'Page down',
        35: 'End',
        36: 'Home',
        37: 'leftArrow',
        38: 'upArrow',
        39: 'rightArrow',
        40: 'downArrow',
        45: 'Insert',
        46: 'Delete',
        91: 'Left window key',
        92: 'Right window key',
        93: 'Select key',
        144: 'Num lock',
        145: 'Scroll lock',
        186: 'Semicolon',
        187: 'Equal sign',
        188: 'Comma',
        189: 'Dash',
        190: 'Period',
        191: 'Forward slash',
        192: 'Grave accent',
        219: 'Open bracket',
        220: 'Back slash',
        221: 'Close bracket',
        222: "Quote",
        255: 'Fn'
    };
    var i;

    for (i = 48; i <= 57; i++) { // Numbers
        keys[i] = String.fromCharCode(i);
    }

    for (i = 65; i <= 90; i++) { // Characters
        keys[i] = String.fromCharCode(i);
    }

    for (i = 96; i <= 105; i++) { // Numbers on numpad
        keys[i] = 'Numpad ' + (i - 96);
    }

    for (i = 112; i <= 123; i++) { // Special functions
        keys[i] = 'F' + (i - 111);
    }

    this._keys = keys;
};

_p._set0 = function () {
    for (var name in this._keys) {
        this._keyActive[this._keys[name]] = 0;
        this._watchers[this._keys[name]] = [];
    }
}

_p._handleEvents = function () {
    var self = this;
    window.addEventListener('keydown', function (e) {
        var keyName = self._keys[e.which];
        self._keyActive[keyName] = 1;
        self.trigger(keyName, 'keyDown');
        if (self._watchers[keyName].length > 0) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
    window.addEventListener('keyup', function (e) {
        var keyName = self._keys[e.which];
        self._keyActive[keyName] = 0;
        self.trigger(keyName, 'keyUp');
        if (self._watchers[keyName].length > 0) {
            e.preventDefault();
            e.stopPropagation();
        }
       
        return false;
    });
}
