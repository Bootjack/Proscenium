define([], function () {
    'use strict';
    function Scene (config) {
        config = config || {};
        this.id = config.id;
        this.actors = [];
        this.conditions = [];
        this.paused = false;
        this.stages = {};
        this._pausedAt = 0;
        this._paused = 0;
        this._throttle = 60;
        this._framerate = 0;
        this._lastFrame = 0;
        return this;
    }
    
    Scene.prototype.load = function (actor) {
        if (actor) {
            this.actors.push(actor);
        }
        return this;
    };
    
    Scene.prototype.unload = function (id) {
        var index = this.actors.indexOf(id);
        if (-1 !== index) {
            this.actors.splice(index, 1);
        }
        return this;
    };
    
    Scene.prototype.init = function (config) {
        var i;
        config = config || {};
        this.stages = config.stages || this.stages;
        for (i = 0; i < this.actors.length; i += 1) {
            if ('function' === typeof this.actors[i].init) {
                this.actors[i].init(config);
            }
        }
        return this;
    };
    
    Scene.prototype.evaluate = function (interval) {
        var i, evaluations, evaluation;
        evaluations = [];
        if ('function' === typeof this.always) {
            this.always(interval);
        }
        for (i in this.stages) {
            stages[i].evaluate(interval);
        }
        for (i = 0; i < this.actors.length; i += 1) {
            if ('function' === typeof this.actors[i].evaluate) {
                evaluation = this.actors[i].evaluate(interval);
                if (evaluation) {
                    evaluations.push({
                        actor: this.actors[i],
                        evaluate: evaluation
                    });                    
                }
            }
        }
        //console.log(evaluations.length);
        for (i = 0; i < evaluations.length; i += 1) {
            if ('function' === typeof evaluations[i].evaluate) {
                evaluations[i].evaluate.call(evaluations[i].actor);
            }
        }
        for (i = 0; i < this.conditions.length; i += 1) {
            if (this.condition[i].test()) {
                this.condition[i].run();
            }
        }
    };
    
    Scene.prototype.pause = function () {
        if (!this.paused) {
            this.paused = true;
            this._pausedAt = new Date().getTime();
        }
        return this;
    };
    
    Scene.prototype.unpause = function () {
        if (this.paused) {
            this.paused = false;
            this._paused += new Date().getTime() - this._pausedAt;
        }
        return this;
    };
    
    Scene.prototype.run = function () {
        var interval, now, timeout;
        now = new Date().getTime();
        timeout = 1000 / this._throttle;
        interval = now - this._lastFrame;
        this._lastFrame = now;
        if (!this.paused) {
            this.evaluate(interval);
            now = new Date().getTime();
            interval = now - this._lastFrame;
            if (interval < timeout) {
                timeout -= interval;
                this._framerate = this._throttle;
            } else {
                timeout = interval % timeout;
                this._framerate = Math.floor(1000 / interval);
            }
        }
        this._timeout = setTimeout(
            (function (self) {
                return function () {
                    self.run();
                };
            }(this)),
            timeout
        );
        return this;
    };
    
    return Scene;
});
