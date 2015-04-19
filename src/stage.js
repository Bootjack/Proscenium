define([], function () {
    'use strict';

    function phaseFactory(interval, offset) {
        return function (frame) {
            var phase = (frame + offset) % interval;
            return !phase;
        };
    }

    /**
     * A Stage is a place for Actors to be manipulated. While a Scene is running it will iterate over all of its
     * active Stages to call each one's evaluate() method. This happens immediately after the Actors have run their
     * own evaluations.
     *
     * @param config
     * @constructor
     */
    var Stage = function (config) {
        config = config || {};
        this.id = config.id;

        if (config.interval > 1) {
            this.phase = phaseFactory(config.interval, config.offset);
        }

        if ('function' === typeof config.prep) {
            this.prep = config.prep.bind(this);
        }

        if ('function' === typeof config.evaluate) {
            this.evaluate = config.evaluate.bind(this);
        }

        if ('function' === typeof config.clear) {
            this.clear = config.clear.bind(this);
        }

        if ('function' === typeof config.init) {
            config.init.call(this);
        }
    };

    Stage.prototype.clear = function () {};

    return Stage;
});
