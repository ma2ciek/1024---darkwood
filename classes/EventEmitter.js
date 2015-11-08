function EventEmitter() {
	this._events = {};
}

EventEmitter.prototype.addEventListener = function (eventType, eventHandler) {
	if (!this._events[eventType])
		this._events[eventType] = [];
	if (typeof eventHandler !== 'function')
		console.error('eventHandler must be a function');
	this._events[eventType].push(eventHandler.bind(this));
};

EventEmitter.prototype.emit = function (eventType) {
	var events = this._events[eventType];
	if (!events)
		return;
	var args = Array.prototype.slice.call(arguments, 1);
	for (var i = 0; i < events.length; i++) {
		events[i].apply(this, args);
	}
};

EventEmitter.prototype.removeEventListener = function (eventType, eventHandler) {
	if (typeof this._events[eventType] === 'undefined')
		return;

	var index = this._events[eventType].indexOf(eventHandler);
	console.log(eventHandler, this._events);
	if (index === -1)
		return;

	return this;
};

EventEmitter.prototype.dispatch = function (eventType) {
	if (eventType in this._events)
		this._events[eventType].length = 0;
	else
		this._events = {};
};

EventEmitter.prototype.getEventListeners = function (eventType) {
	return this._events[eventType];
}
