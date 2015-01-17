define([], function() {
    'use strict';

    var util = {
        object: function (obj) {
            function F() {}
            F.prototype = obj;
            return new F();
        },
        merge: function (Mixins, config) {
            var props, proto;

            props = {};
            proto = {};

            Mixins.forEach(function (Mixin) {
                var p, m = new Mixin(config);
                for (p in m) {
                    if (m.hasOwnProperty(p)) {
                        props[p] = m[p];
                    } else {
                        proto[p] = Mixin.prototype[p];
                    }
                }
                proto.constructor = m.constructor;
            });

            function Merged() {
                var p;
                for (p in props) {
                    this[p] = props[p];
                }
            }

            Merged.prototype = proto;

            return Merged;
        },
        inherit: function (Parent, Child, config) {
            var child, parent;

            child = new Child(config);

            function Clone() {
                var p;
                for (p in child) {
                    this[p] = child[p];
                }
            }
            Clone.prototype = Parent.prototype;

            parent = new Clone();

            Parent.prototype = parent;

            return Parent;
        },
        mixin: function (Self, Mixins, configs) {
            var config, mix, proto, Mixed = function () {};
            configs = configs || [];
            if (!(configs instanceof Array)) {
                configs = [configs];
            }
            configs.forEach(function(conf, i) {
                if (i > 0 && configs[i + 1]) {
                    configs[i] = util.merge(configs.slice(i));
                }
            });
            Mixins.forEach(function (Mixin, i) {
                Mixed = util.inherit(Mixed, Mixin, configs[i]);
            });

            proto = Self.prototype;

            function Clone() {
                var p;
                for (p in proto) {
                    this[p] = proto[p];
                }
            }
            Clone.prototype = Mixed.prototype;

            mix = new Clone();
            mix.constructor = Self;

            Self.prototype = mix;

            return Self;
        },
        mock: function (scope) {
            scope.A = function (config) {config = config || {}; this.test = config.test; return this;};
            scope.B = function (config) {config = config || {}; this.test = !config.test; return this;};
            scope.C = function (config) {this.config = config; return this;};
            scope.A.prototype.isA = true;
            scope.B.prototype.isB = true;
            scope.C.prototype.isC = true;
        }
    };

    return util;
});
