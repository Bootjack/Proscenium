define(['src/emitter', 'src/util'], function (Emitter, util) {
    'use strict';
    
    var Actor = function(config) {
        config = config || {};
        // The state object stores all data about the actor so that it can be saved and restored.
        this.state = {};
        this.roles = [];
        this.id = config.id;
        this.preparations = [];

        if (config.prep) {
            this.preparations.push(config.prep);
        }

        if ('function' === typeof config.evaluate) {
            this.evaluate = config.evaluate.bind(this);
        }

        if ('function' === typeof config.init) {
            config.init.call(this);
        }

        return this;
    };

    // A shared set of role definitions. Proscenium.role() adds to this list.
    Actor.prototype._roles = {};

    /* Assign a role or array of roles to an actor. The actor will inherit (all the way up the prototype chain) all
     * properties of given role(s) in the given order. */
    Actor.prototype.role = function (roles) {
        var i, property, role;
        if ('string' === typeof roles) {
            roles = [roles];
        }
        // Loop through role names to be applied to actor
        for (i = 0; i < roles.length; i += 1) {
            // Make sure there is a role by that name already defined
            role = this._roles[roles[i]];
            if (role) {
                // Add role name to actor's roles array
                this.roles.push(roles[i]);
                // Add actor to role's members array
                role.members.push(this);
                // Copy properties from role definition to actor
                for (property in role.definition) {
                    if ('prep' === property) {
                        this.prepartions.push(role.definition[property]);
                    } else if ('init' !== property) {
                        this[property] = role.definition[property];
                    }
                }
                if ('function' === typeof role.definition.init) {
                    role.definition.init.call(this);
                }
            } else {
                throw new Error('Actor role "' + roles[i] + '" is not defined');
            }
        }
        return this;
    };

    Actor.prototype.set = function (name, value) {
        this.state[name] = value;
        this.trigger('update');
        return this;
    };

    Actor.prototype.prep = function () {
        var that = this;
        this.preparations.forEach(function (prep) {
            prep.call(that);
        });
    };

    util.mixin(Actor, [Emitter]);

    return Actor;
});
