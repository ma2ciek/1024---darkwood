export function toggleFullScreen() {
    const _element = <any>document.documentElement;
    const _document = <any>document;
    try {
        if (isFullScreen()) {  // current working methods
            if (_element.requestFullscreen) {
                _element.requestFullscreen();
            } else if (_element.msRequestFullscreen) {
                _element.msRequestFullscreen();
            } else if (_element.mozRequestFullScreen) {
                _element.mozRequestFullScreen();
            } else if (_element.webkitRequestFullscreen) {
                _element.webkitRequestFullscreen((<any>Element).ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (_document.exitFullscreen) {
                _document.exitFullscreen();
            } else if (_document.msExitFullscreen) {
                _document.msExitFullscreen();
            } else if (_document.mozCancelFullScreen) {
                _document.mozCancelFullScreen();
            } else if (_document.webkitExitFullscreen) {
                _document.webkitExitFullscreen();
            }
        }
    } catch (err) { };
}

export function isFullScreen() {
    const _document = <any>document;
    
    return !_document.fullscreenElement &&
        !_document.mozFullScreenElement &&
        !_document.webkitFullscreenElement &&
        !_document.msFullscreenElement;
}