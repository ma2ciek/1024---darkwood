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

function loadImages(list, callback) {
    var imageList = {};
    var counter = new Counter(Object.keys(list).length, callback.bind(null, imageList));

    for (var imgName in list) {
        loadImage(list, imgName, imageList ,counter);
    }
}

function loadImage(list, imgName, imageList, counter) {
    var url = list[imgName];
    var img = new Image();
    img.onload = counter.count.bind(counter);
    img.onerror = counter.error.bind(counter);
    img.src = list[imgName];
    imageList[imgName] = img;
}