interface IDictionary<T> {
    [id: number]: T;
}

export default class ActionNode<T> {
    private children: IDictionary<ActionNode<T>> = {};
    private onKeyDown: T[] = [];
    private onKeyUp: T[] = [];

    constructor(
        private parent: ActionNode<T>,
        private key: number
    ) { }

    public getChild(key: number) {
        return this.children[key];
    }

    public getChildOrSetChildIfEmpty(key: number): ActionNode<T> {
        return this.children[key] || (this.children[key] = new ActionNode(this, key));
    }

    public findClosest(key: number) {
        let node = <ActionNode<T>>this;
        while (node) {
            if (node.key == key)
                return this;
            node = node.parent;
        }
    }

    public addKeyDownAction(action: T) {
        this.onKeyDown.push(action);
    }

    public getKeyDownActions() {
        return this.onKeyDown;
    }

    public addKeyUpAction(action: T) {
        this.onKeyUp.push(action);
    }

    public getKeyUpActions() {
        return this.onKeyUp;
    }

    public getParent() {
        return this.parent;
    }
}