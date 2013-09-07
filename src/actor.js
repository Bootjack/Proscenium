define(['src/emitter', 'src/util'], function (Emitter, util) {
    'use strict';
    
    function Actor() {
        // The state object stores all data about the actor so that it can be saved and restored.
        this.state = {};
        this.roles = [];
        return this;
    }

    util.mixin(Actor, Emitter);
    
    Actor.prototype.set = function (name, value) {
        this.state[name] = value;
        this.trigger('update');
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
                    this[property] = role.definition[property];
                }
            } else {
                throw new Error('Actor role "' + roles[i] + '" is not defined');
            }
        }
        return this;
    };
    
    // Function called at every step of the main stage, allowing actor to update its own state.
    Actor.prototype.evaluate = function () {
        return false;
    };
    
    return Actor;
});
