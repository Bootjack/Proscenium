define([], function () {
    'use strict';
    function Stage(config) {
        config = config || {};
        this.id = config.id;
    }
    return Stage;
});
