import ActionNode from './Node';
import {ICallback} from './utils/common'; 

export type IKeyboardCallback = ICallback<KeyboardEvent>

export class Keyboard {
    private keyCodes: { [key: string]: number };
    private keysPressed: boolean[];
    private root = new ActionNode<IKeyboardCallback>(null, null);
    private currentNode = this.root;

    constructor() {
        this.initializeKeysDictionary();
        this.initializeKeysPressedArray();
        this.addEventListeners();
    }

    private initializeKeysDictionary() {
        this.keyCodes = {
            alt: 18,
            arrowDown: 38,
            arrowLeft: 37,
            arrowRight: 39,
            arrowUp: 40,
            ctrl: 17,
            delete: 46,
            enter: 13,
            esc: 27,
            minus: 173,
            plus: 61,
            shift: 16,
        };
        // [A] - [Z]
        for (let i = 0; i < 26; i++) {
            const char = String.fromCharCode(i + 97);
            this.keyCodes[char] = i + 65;
        }
    }

    private initializeKeysPressedArray() {
        this.keysPressed = [];
        for (let i = 0; i < 256; i++)
            this.keysPressed[i] = false;
    }

    private addEventListeners() {
        window.addEventListener('keydown', (e) => this.goForwardIfKeyExists(e));
        window.addEventListener('keyup', (e) => this.goBackToKeyIfKeyExists(e));
    }

    public on(keySequence: string, onKeyDown: IKeyboardCallback, onKeyUp?: IKeyboardCallback) {
        const keyCodes = this.getKeyCodesFromSequence(keySequence);
        this.addKeySequence(keyCodes, onKeyDown, onKeyUp);
        return this;
    }

    private getKeyCodesFromSequence(keySequence: string) {
        const keys = keySequence.split(/[ \+]+/);
        return keys.map((key) => this.keyCodes[key]);
    }

    private addKeySequence(sequence: number[], onKeyDown: IKeyboardCallback, onKeyUp: IKeyboardCallback) {
        let node = this.root;
        for (let keyCode of sequence)
            node = node.getChildOrSetChildIfEmpty(keyCode);

        onKeyDown && node.addKeyDownAction(onKeyDown)
        onKeyUp && node.addKeyUpAction(onKeyUp);
    }

    private goForwardIfKeyExists(e: KeyboardEvent) {
        const keyCode = this.getKeyCode(e);
        const alreadyPressed = this.keysPressed[keyCode];
        this.keysPressed[keyCode] = true;
        alreadyPressed ?
            this.preventDefaultIfActionExist(e) :
            this.fireCallbacksAndChangeNode(keyCode, e);
    }

    private fireCallbacksAndChangeNode(keyCode: number, e: KeyboardEvent) {
        let node = this.currentNode.getChild(keyCode);
        if (!node) return;

        node.getKeyDownActions()
            .forEach(action => action(e));

        this.currentNode = node;
        this.preventDefaultIfActionExist(e);
    }

    private preventDefaultIfActionExist(e: KeyboardEvent) {
        if (this.currentNode.getKeyDownActions().length > 0) {
            // e.preventDefault();
            // e.stopPropagation();
        }
    }

    private goBackToKeyIfKeyExists(e: KeyboardEvent) {
        const keyCode = this.getKeyCode(e);
        this.keysPressed[keyCode] = false;

        const node = this.currentNode.findClosest(keyCode);
        if (!node) return;

        this.currentNode.getKeyUpActions()
            .forEach(action => action(e));

        this.currentNode = node.getParent();
    }

    public isPressed(keyName: string) {
        const keyCode = this.keyCodes[keyName];
        if (typeof keyCode == 'undefined')
            throw new Error(`Wrong keyName ${keyName}`);
        return +this.keysPressed[keyCode];
    }
    
    private getKeyCode(e: KeyboardEvent) {
        return e.keyCode || e.which || e.charCode;
    }
}

export default Keyboard;