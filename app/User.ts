import {drawText} from './utils/canvas-utils';
import Keyboard from './Keyboard';
import EventEmitter from './EventEmitter';
import Vector from './utils/Vector';

export default class User extends EventEmitter {
    private mouse = { x: 0, y: 0 };
    private keyboard: Keyboard;

    constructor() {
        super();
        this.keyboard = new Keyboard();
        this.addEventListeners();
    }

    public getMouse() {
        return this.mouse;
    }

    private addEventListeners() {
        this.handleMouseEvents();
        this.handleKeyboardEvents();
    }

    private handleMouseEvents() {
        window.addEventListener('mousemove', e => this.updateMousePosition(e));
        window.addEventListener('click', e => this.leftClick(e));
        window.addEventListener('contextmenu', e => this.rightClick(e));
    }

    private handleKeyboardEvents() {
        this.keyboard.on('tab', () => this.emit('toggleWeapon'));
    };

    private leftClick(e: MouseEvent) {
        this.updateMousePosition(e);
        this.emit('leftclick', this.mouse);
    }

    private rightClick(e: MouseEvent) {
        this.updateMousePosition(e);
        this.emit('right', this.mouse);
        e.preventDefault();
        e.stopPropagation();
    }

    private updateMousePosition(e: MouseEvent) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }
    
    public getVelocity() {
        const pressed = (key: string) => this.keyboard.isPressed(key);
        return new Vector(
            pressed('d') - pressed('a'),
            pressed('w') - pressed('s')
        );
    }
}