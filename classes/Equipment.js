var MAX_WEIGHT = 1000;

(function (global) {
    "use strict";

    function createSlots(size) {
        var arr = [];
        for (var i = 0; i < size; i++) {
            arr.push(new Slot());
        }
        return arr;
    }

    function Equipment() {
        this._weight = 0;
        this._createPlayerSlots();
    }

    Equipment.prototype._createPlayerSlots = function () {
        this._body = {
            head: createSlots(1),
            neck: createSlots(1),
            chest: createSlots(1),
            legs: createSlots(1),
            hands: createSlots(2),
            fingers: createSlots(2)
        };
        this._quickAccess = createSlots(5);
        this._bag = createSlots(20);
    };

    Equipment.prototype.add = function (o) {
        if (this._weight + o.weight > MAX_WEIGHT)
            return false;

        for(var slot of this._bag) {
            if (slot.isEmpty() || slot.getType() == o.name) {
                slot.addItem(o);
                this._weight += o.weight;
                return true;
            }
        }
        return false;
    }

    function Slot() {
        this._size = 0;
        this._type = null;
    }

    Slot.prototype.isEmpty = function () {
        return this._size == 0;
    }

    Slot.prototype.getType = function () {
        return this._type;
    }

    Slot.prototype.addItem = function (o) {
        this._size++;
        this._type = o.name;
    }

    global.Equipment = Equipment;
})(this);