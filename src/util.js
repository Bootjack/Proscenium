define([], function() {
    'use strict';

    return {
        object: function(obj) {
            function F() {}
            F.prototype = obj;
            return new F();
        }
    };
});
