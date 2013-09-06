define([], function() {
    'use strict';

    return {
        object: function (obj) {
            function F() {}
            F.prototype = obj;
            return new F();
        },
        mixin: function (Self, Ref) {
            var p;
            for (p in Ref.prototype) {
                Self.prototype[p] = Ref.prototype[p];
            }
        }
    };
});
