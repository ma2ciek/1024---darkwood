function loadImages(list, callback) {
    var imageList = {};
    var counter = new Counter(Object.keys(list).length, callback.bind(null, imageList));

    for (var imgName in list) {
        var src = list[imgName];
        loadImage(src, imageList, imgName, counter);
    }
}

function loadImage(src, imageList, imgName, counter) {
    var img = new Image();
    img.onload = counter.count.bind(counter);
    img.onerror = counter.error.bind(counter);
    img.src = src;
    imageList[imgName] = img;
}

function loadAudioFiles(list, callback) {
    var audioList = [];
    var counter = new Counter(Object.keys(list).length, callback.bind(null, audioList));

    for (var audioName in list) {
        var src = list[audioName];
        loadAudio(src, audioList, audioName, counter);
    }
}

function loadAudio(src, audioList, audioName, counter) {
    var audio = new Audio();
    audio.oncanplaythrough = counter.count.bind(counter);
    audio.onerror = counter.error.bind(counter);
    audio.src = src;
    audioList[audioName] = audio;
}