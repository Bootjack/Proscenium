define([
    'src/actor',
    'src/curtain',
    'src/scene',
    'src/stage'
], function (Actor, Curtain, Scene, Stage) {
    'use strict';
    
    var Proscenium = { 
        actors: {},
        _actors: 0,
        curtains: {},
        _curtains: 0,
        scenes: {},
        _scenes: 0,
        stages: {},
        _stages: 0,
        
        create: function (Constructor, collection, id, config) {
            config = config || ('string' !== typeof id && id);
            id = id || collection + '-' + this['_' + collection];
            config.id = config.id || id;
            var instance = new Constructor(config);
            this[collection][id] = instance;
            this['_' + collection] += 1;
            return instance;
        },
        
        actor: function (id, config) {
            return this.create(Actor, 'actors', id, config);
        },

        curtain: function (id, config) {
            return this.create(Curtain, 'curtains', id, config);
        },

        role: function (id, role) {
            Actor.prototype._roles[id] = {
                definition: role,
                members: []
            };
        },
        
        scene: function (id, config) {
            return this.create(Scene, 'scenes', id, config);
        },
        
        stage: function (id, config) {
            return this.create(Stage, 'stages', id, config);
        }
    };
    
    return Proscenium;
});
