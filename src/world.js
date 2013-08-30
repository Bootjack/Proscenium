define([], function () {
    'use strict';

    function World () {}
    World.prototype = [];
    World.prototype.constructor = World;
    
    return World;
});
