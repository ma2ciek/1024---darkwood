function Counter(x, callback) {
    console.log('created counter', x, callback)
    this._count = x;
    this._callback = callback;
    if(typeof callback != 'function' || typeof x != 'number')
        throw TypeError('wrong format');
}

Counter.prototype.count = function () {
    this._count--;
    if (this._count == 0)
        this._callback();
};

Counter.prototype.error = function () {
    throw Error("Wrong url")
}