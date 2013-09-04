define([], function () {
    'use strict';
    
    function Actor() {
        // The state object stores all data about the actor so that it can be saved and restored.
        this._state = {};
        return this;
    }

    // A shared set of role definitions. Proscenium.role() adds to this list.
    Actor.prototype._roles = {};

    /* Assign a role or array of roles to an actor. The actor will inherit (all the way up the prototype chain) all
     * properties of given role(s) in the given order. */
    Actor.prototype.role = function (roles) {
        var i, r, roleSet;
        if ('string' === typeof roles) {
            roles = [roles];
        }
        for (i = 0; i < roles.length; i += 1) {
            roleSet = this._roles[roles[i]];
            if (roleSet) {
                for (r in roleSet) {
                    this[r] = roleSet[r];
                }
            }
        }
        return this;
    };
    
    // Function called at every step of the main stage, allowing actor to update its own state.
    Actor.prototype._evaluate = function () {
        return false;
    };
    
    return Actor;
});
