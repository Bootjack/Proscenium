define([], function () {

    var Emitter = function () {
        this._events = {};
        return this;
    };

    Emitter.prototype.trigger = function (event, data) {
        var i;
        if (this._events[event] && this._events[event].length) {
            for (i = 0; i < this._events[event].length; i += 1) {
                if ('function' === typeof this._events[event][i]) {
                    this._events[event][i](data);
                }
            }
        }
    };

    Emitter.prototype.on = function (event, func, scope) {
        scope = scope || this;
        func = func.bind(scope);
        this._events[event] = this._events[event] || [];
        this._events[event].push(func);
    };

    Emitter.prototype.off = function (event, func) {
        var index = this._events[event].indexOf(func);
        if (func) {
            this._events[event].splice(index, 1);
        } else {
            this._events[event] = [];
        }
    };

    return Emitter;
});
