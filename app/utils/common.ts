export interface ICallback<T> {
    (arg?: T): void;
}

export interface IPoint {
    x: number;
    y: number;
}

export interface IDictionary<T> {
    [name: string]: T;
}

export interface IDimensions {
    width: number;
    height: number;
}

export function rand(x: number, y: number) {
    return Math.random() * (y - x) + x;
}

export function chance(chance: number, fn: Function, args: any[]) {
    if (Math.random() < chance)
        fn.call(null, args);
}

export function removeElement<T>(array: T[], item: T) {
    var index = array.indexOf(item);
    if (index == -1)
        return [];
    return array.splice(index, 1);
}