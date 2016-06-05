import {ICallback, IDictionary} from './common';

export function loadImages(list: IDictionary<string>) {
    const imageList: IDictionary<HTMLImageElement> = {};
    const promises: Promise<HTMLImageElement>[] = [];

    for (const imgName in list) {
        const src = list[imgName];
        const promise = createImage(src);
        promise.then((img: HTMLImageElement) => imageList[imgName] = img);        
        promises.push(promise);
    }

    return Promise.all(promises).then(() => imageList);
}

export function createImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = e => reject(e);
        img.onabort = e => reject(e);
        img.src = src;
    })
}

export function loadAudioFiles(list: IDictionary<string>) {
    const audioList: IDictionary<HTMLAudioElement> = {};
    const promises: Promise<HTMLAudioElement>[] = [];

    for (const audioName in list) {
        const src = list[audioName];
        const promise = loadAudio(src);
        promise.then((audio: HTMLAudioElement) => audioList[audioName] = audio);
        promises.push(promise);
    }
    
    return Promise.all(promises).then(() => audioList);
}

export function loadAudio(src: string) {
    return new Promise<HTMLAudioElement>((resolve, reject) => {
        const audio = new Audio();
        audio.oncanplaythrough = () => resolve(audio);
        audio.onerror = e => reject(e);
        audio.src = src;
    });
}