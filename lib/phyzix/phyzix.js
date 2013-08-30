// The world's most useless physics engine

var define;

define([], function () {
    'use strict';
    
    var Body, Phyzix;
    
    Phyzix = function () {
        // All the physical bodies in our world and their center-of-mass position
        this.bodies = [];
        
        /* As bodies are added to the world, store them in an array, but be smart
         * about reusing any available indices as other bodies are deleted. Likewise,
         * deleting a body simply leaves its array index undefined. */
        this.addBody = function (x, y) {
            var body, index;
            
            body = new Body(x, y);
            
            index = this.bodies.indexOf(undefined);
            if (-1 !== index) {
                this.bodies[index] = body;
            } else {
                this.bodies.push(body);
            }
            body.index = this.bodies.indexOf(body);
            return body;
        };
        
        this.removeBody = function (body) {
            delete this.bodies[body];
        };
        
        return this;
    };

    Body = function (x, y) {
        if ('array' === typeof x && x.length > 1) {
            y = x[1];
            x = x[0];
        } else if ('object' === typeof x) {
            y = x.y || 0;
            x = x.x || 0;
        }
        if (isNaN(x)) {
            x = parseFloat(x);
        }
        if (isNaN(y)) {
            y = parseFloat(y);
        }
        this.x = x || 0;
        this.y = y || 0;

        return this;
    };
    
    return Phyzix;
});
