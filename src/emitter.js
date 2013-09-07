define([], function () {
    function Emitter() {
        this._events = {};
        return this;
    }
    Emitter.prototype.trigger = function (event, data) {
        var i;
        this._events = this._events || {};
        if (this._events[event] && this._events[event].length) {
            for (i = 0; i < this._events[event].length; i += 1) {
                if ('function' === typeof this._events[event][i]) {
                    this._events[event][i](data);
                }
            }
        }
    };
    Emitter.prototype.on = function (event, func, scope) {
        this._events = this._events || {};
        if (scope) {
            func = function () {
                scope.apply(func, arguments);
            };
        }
        this._events[event] = this._events[event] || [];
        this._events[event].push(func);
    };
    Emitter.prototype.off = function (event, func) {
        this._events = this._events || {};
        if (func) {
            this._events.splice(this._events.indexOf(func), 1);
        } else {
            this._events[event] = [];
        }
    };
    return Emitter;
});
