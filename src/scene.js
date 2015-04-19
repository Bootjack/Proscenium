define([
    'src/collection',
    'src/util'
], function (
    Collection,
    util
) {
    'use strict';

    /**
     * A Scene controls the flow of game logic by defining a beginning state and one or more ending states. Once it's
     * initialized, the scene will iterate frame-by-frame invoking evaluation logic on each of its actors and stages.
     * The last step of each frame is to test each ending condition to see if the scene should end and how control
     * should be passed to the next segment of the game.
     * @param config {scenConfig} Configuration options for initializing this scene
     * @param scope {Proscenium} A reference to the Proscenium object used to define the Scene
     * @returns {Scene}
     * @constructor
     *
     * {Object} sceneConfig
     * {Function} sceneConfig.always will run at the beginning of every frame
     * {Function} sceneConfig.init will run immediately upon instantiation
     */
    var Scene = function(config, scope) {
        var that = this;

        config = config || {};
        this.id = config.id;

        this._frame = 0;
        this._framerate = 0;
        this._lastFrame = 0;
        this._pausedAt = 0;
        this._pausedFor = 0;

        this.actors = [];
        this.conditions = [];
        this.curtains = [];
        this.paused = false;
	this.running = false;
        this.stages = [];

        this.always = config.always;
        this.throttle = config.throttle || 60;

        if (config.curtains instanceof Array) {
            this.curtains = config.curtains.map(function (name) {
                return scope.curtains[name];
            });
        } else if ('string' === typeof config.curtains) {
            this.curtains.push(scope.curtains[name]);
        }

        if (config.stages instanceof Array) {
            this.stages = config.stages.map(function (name) {
                return scope.stages[name];
            });
        } else if ('string' === typeof config.curtains) {
            this.stages.push(scope.stages[name]);
        }

        if ('function' === typeof config.prep) {
            this.prep = config.prep.bind(this);
        }

        if ('function' === typeof config.init) {
            config.init.call(this);
        }

        return this;
    };

    Scene.prototype.warmup = function (config) {
        if ('function' === typeof this.prep) {
            this.prep(config);
        }
        this.curtains.forEach(function (curtain) {
            curtain.clear();
        });
        this.stages.forEach(function (stage) {
            if ('function' === typeof stage.prep) {
                stage.prep(config);
            }
        });
        this.actors.forEach(function (actor) {
            if ('function' === typeof actor.prep) {
                actor.prep(config);
            }
        });
        return this;
    };
    
    Scene.prototype.evaluate = function (interval) {
        var evaluations, frame;

        evaluations = [];
        this._frame += 1;
        frame = this._frame;

        if ('function' === typeof this.always) {
            this.always(interval);
        }

        this.actors.forEach(function (actor) {
            var result;
            if ('function' === typeof actor.evaluate) {
                result = actor.evaluate(interval);
                if ('function' === typeof result) {
                    evaluations.push(result);
                } else if (result instanceof Array) {
                    evaluations = evaluations.concat(result);
                }
            }
        });

        evaluations.forEach(function (execute) {
            execute();
        });

        this.stages.forEach(function (stage) {
            if ('function' === typeof stage.evaluate) {
                if ('function' !== typeof stage.phase || stage.phase(frame)) {
                    stage.evaluate(interval);
                }
            }
        });

        this.conditions.forEach(function (condition) {
            if (condition.test()) {
                condition.run();
            }
        });
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
            this._pausedFor += new Date().getTime() - this._pausedAt;
        }
        return this;
    };
    
    Scene.prototype.run = function () {
        var interval, now, timeout;

        now = new Date().getTime();
        timeout = 1000 / this.throttle;
        interval = now - this._lastFrame;
        this._lastFrame = now;

        if (!this.paused) {
            this.evaluate(interval);
            now = new Date().getTime();
            interval = now - this._lastFrame;
            if (interval < timeout) {
                timeout -= interval;
                this._framerate = this.throttle;
            } else {
                timeout = interval % timeout;
                this._framerate = Math.floor(1000 / Math.max(interval, 1));
            }
        }

        if (this.running) {
            this._timeout = setTimeout(
                this.run.bind(this),
                timeout
            );
        }

        return this;
    };

    Scene.prototype.cleanup = function () {
        this.curtains.forEach(function (curtain) {
            curtain.clear(this);
        });
        this.stages.forEach(function (stage) {
            if ('function' === typeof stage.clear) {
                stage.clear(this);
            }
        });
        return this;
    };

    Scene.prototype.begin = function (config) {
        this.running = true;
        this._lastFrame = new Date().getTime();
        this.warmup(config);
        this.run();
    };

    Scene.prototype.end = function () {
        this.running = false;
        clearTimeout(this._timeout);
	this.cleanup();
    };

    return Scene;
});


