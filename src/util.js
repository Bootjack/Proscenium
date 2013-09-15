define([], function() {
    'use strict';

    return {
        object: function (obj) {
            function F() {}
            F.prototype = obj;
            return new F();
        },
        mixin: function (Self, Ref) {
            var p, ref = new Ref();
            for (p in ref) {
                Self.prototype[p] = ref[p];
            }
        }
    };
});
