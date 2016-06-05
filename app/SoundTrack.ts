import {IDictionary} from './utils/common';

export default class SoundTrack {
    private index = 0;

    constructor(
        private list: string[],
        private audio: IDictionary<HTMLAudioElement>) {
    }

    public play() {
        const audioName = this.list[this.index];
        this.audio[audioName].play()
        this.audio[audioName].onended = () => this.next()
    };

    private next() {
        this.index = (this.index + 1) % this.list.length;
        this.audio[this.index].currentTime = 0;
        this.play();
    }
}
