import {IDictionary, ICallback} from './utils/common';

export type IEventHandler = ICallback<any>

export default class EventEmitter {
	private _handlers: IDictionary<IEventHandler[]> = {};

	public on(eventType: string, eventHandler: IEventHandler) {
		if (!this._handlers[eventType])
			this._handlers[eventType] = [];

		this._handlers[eventType].push(eventHandler);
	}

	public emit(eventType: string, ...args: any[]) {
		const handlers = this._handlers[eventType];
		if (!handlers)
			return;

		for (const handler of handlers)
			handler(args);
	}
}