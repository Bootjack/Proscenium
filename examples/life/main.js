define('src/emitter',[], function () {

    var Emitter = function () {
        this._events = {};
        return this;
    };

    Emitter.prototype.trigger = function (event, data) {
        var i;
        if (this._events[event] && this._events[event].length) {
            for (i = 0; i < this._events[event].length; i += 1) {
                if ('function' === typeof this._events[event][i]) {
                    this._events[event][i](data);
                }
            }
        }
    };

    Emitter.prototype.on = function (event, func, scope) {
        scope = scope || this;
        func = func.bind(scope);
        this._events[event] = this._events[event] || [];
        this._events[event].push(func);
    };

    Emitter.prototype.off = function (event, func) {
        var index = this._events[event].indexOf(func);
        if (func) {
            this._events[event].splice(index, 1);
        } else {
            this._events[event] = [];
        }
    };

    return Emitter;
});

define('src/util',[], function() {
    

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
        mixin: function (Self, Mixins, config) {
            var mix, proto, Mixed = function () {};
            Mixins.forEach(function (Mixin) {
                Mixed = util.inherit(Mixed, Mixin, config);
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

define('src/actor',['src/emitter', 'src/util'], function (Emitter, util) {
    
    
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

    Actor = util.mixin(Actor, [Emitter]);

    return Actor;
});

define('src/collection',[], function () {

    // Utility functions
    function addOne (name, object) {
        object.on('update', this.update.bind(this));
        this[name].push(object);
        this.update();
    }

    function removeOne (name, object) {
        var index = this[name].indexOf(object);
        this[name].splice(index, 1);
        object.off('update', this.update.bind(this));
        this.update();
    }

    var Collection = function (config) {
        var collection, name;
        config = config || {};

        collection = [];
        name = config.name || 'collection';

        this[name] = collection;
        this.addOne = function (object) {
            addOne.call(this, name, object);
        };

        this.removeOne = function (object) {
            removeOne.call(this, name, object);
        };

        this.clear = function () {
            this[name].forEach(this.removeOne.bind(this));
        };
    };

    Collection.prototype.update = function () {
        return this;
    };
    
    Collection.prototype.add = function (addition) {
        if (Array === addition.constructor) {
            addition.forEach(this.addOne.bind(this));
        } else {
            this.addOne(addition);
        }

        return this;
    };

    Collection.prototype.remove = function (member) {
        if (Array === member.constructor) {
            member.forEach(this.removeOne.bind(this));
        } else {
            this.removeOne(member);
        }
    };
    
    return Collection;
});

define('src/curtain',[
    'src/collection',
    'src/util'
], function (
    Collection,
    util
) {
    
    
    var Curtain = function (config) {
        config = config || {};
        this._updating = false;

        if ('function' === typeof config.beforeUpdate) {
            this.beforeUpdate = config.beforeUpdate;
        }

        if ('function' === typeof config.afterUpdate) {
            this.afterUpdate = config.afterUpdate;
        }

        if (config.template) {
            this.template = config.template;
        }

        if ('function' === typeof config.calculate) {
            this.calculate = config.calculate;
        }

        if ('function' === typeof config.render) {
            this.render = config.render;
        }

        if (config.element instanceof HTMLElement) {
            this.element = config.element;
        } else if (config.element) {
            this.element = document.getElementById(config.element);
        } else {
            this.element = document.body.appendChild(document.createElement('div'));
            this.element.id = 'pr-curtain-' + config.id;
        }

        if ('function' === typeof config.init) {
            config.init.call(this);
        }
    };

    /**
     * The updating process is intended to be highly configurable. Any work that needs to be done whenever the
     * curtain is updated but is unrelated to rendering new curtain content belongs in beforeUpdate or afterUpdate.
     *
     * The rendering process itself is run by render(), which first prepares data using calculate() and then passes
     * that data to template(). At a minimum the template must be provided in order to generate any output. By default
     * the template is rendered with the entire curtain object passed as its data context. To change this behavior,
     * provide a custom calculate function that returns a data object. To customize the entire render process, a new
     * render function may be provided that does something completely different..
     */

    Curtain.prototype.beforeUpdate = function () {};

    Curtain.prototype.afterUpdate= function () {};

    Curtain.prototype.calculate = function () {
        return this;
    };

    Curtain.prototype.template = function () {
        return "";
    };

    Curtain.prototype.render = function () {
        var data = this.calculate();
        return this.template(data);
    };

    Curtain.prototype.update = function () {
        var that = this;

        if (!this._updating) {
            this._updating = true;
            this.beforeUpdate();
            this.element.innerHTML = this.render();
            this.afterUpdate();

            setTimeout(function () {
                that._updating = false;
            }, 5);
        }
        return this;
    };

    Curtain.prototype.destroy = function () {
        this.element.parentNode.removeChild(this.element);
    };

    Curtain = util.mixin(Curtain, [Collection], {name: 'actors'});

    return Curtain;
});

define('src/scene',[
    'src/collection',
    'src/util'
], function (
    Collection,
    util
) {
    

    var Scene = function(config, scope) {
        var that = this;

        config = config || {};
        this.id = config.id;

        this._frame = 0;
        this._framerate = 0;
        this._lastFrame = 0;
        this._pausedAt = 0;
        this._pausedFor = 0;

        this.actors = [];
        this.conditions = [];
        this.curtains = {};
        this.paused = false;
        this.stages = {};

        this.always = config.always;
        this.throttle = config.throttle || 60;

        if (config.curtains instanceof Array) {
            this.curtains = config.curtains.map(function (name) {
                return scope.curtains[name];
            });
        } else if ('string' === typeof config.curtains) {
            this.curtains.push(scope.curtains[name]);
        }

        if (config.stages instanceof Array) {
            this.stages = config.stages.map(function (name) {
                return scope.stages[name];
            });
        } else if ('string' === typeof config.curtains) {
            this.stages.push(scope.steages[name]);
        }

        if ('function' === typeof config.prep) {
            this.prep = config.prep.bind(this);
        }

        if ('function' === typeof config.init) {
            config.init.call(this);
        }

        return this;
    };

    Scene.prototype.warmup = function (config) {
        this.prep(config);
        this.curtains.forEach(function (curtain) {
            curtain.clear();
        });
        this.stages.forEach(function (stage) {
            if ('function' === typeof stage.prep) {
                stage.prep(config);
            }
        });
        this.actors.forEach(function (actor) {
            if ('function' === typeof actor.prep) {
                actor.prep(config);
            }
        });
        return this;
    };
    
    Scene.prototype.evaluate = function (interval) {
        var evaluations, frame;

        evaluations = [];
        this._frame += 1;
        frame = this._frame;

        if ('function' === typeof this.always) {
            this.always(interval);
        }

        this.actors.forEach(function (actor) {
            if ('function' === actor.evaluate) {
                evaluations.push(actor.evaluate(interval));
            }
        });

        evaluations.forEach(function (execute) {
            execute();
        });

        this.stages.forEach(function (stage) {
            if ('function' === typeof stage.evaluate) {
                if ('function' !== typeof stage.phase || stage.phase(frame)) {
                    stage.evaluate(interval);
                }
            }
        });

        this.conditions.forEach(function (condition) {
            if (condition.test()) {
                condition.run();
            }
        });
    };
    
    Scene.prototype.pause = function () {
        if (!this.paused) {
            this.paused = true;
            this._pausedAt = new Date().getTime();
        }
        return this;
    };
    
    Scene.prototype.unpause = function () {
        if (this.paused) {
            this.paused = false;
            this._pausedFor += new Date().getTime() - this._pausedAt;
        }
        return this;
    };
    
    Scene.prototype.run = function () {
        var interval, now, timeout;

        now = new Date().getTime();
        timeout = 1000 / this.throttle;
        interval = now - this._lastFrame;
        this._lastFrame = now;

        if (!this.paused) {
            this.evaluate(interval);
            now = new Date().getTime();
            interval = now - this._lastFrame;
            if (interval < timeout) {
                timeout -= interval;
                this._framerate = this.throttle;
            } else {
                timeout = interval % timeout;
                this._framerate = Math.floor(1000 / Math.max(interval, 1));
            }
        }

        this._timeout = setTimeout(
            (function (self) {
                return function () {
                    self.run();
                };
            }(this)),
            timeout
        );

        return this;
    };

    Scene.prototype.begin = function (config) {
        this.warmup(config);
        this.run();
    };

    Scene.prototype.end = function () {
        clearTimeout(this._timeout);
    };

    return Scene;
});

define('src/stage',[], function () {
    

    function phaseFactory(interval, offset) {
        return function (frame) {
            var phase = (frame + offset) % interval;
            return !phase;
        };
    }

    /**
     * A Stage is a place for Actors to be manipulated. While a Scene is running it will iterate over all of its
     * active Stages to call each one's evaluate() method. This happens immediately after the Actors have run their
     * own evaluations.
     *
     * @param config
     * @constructor
     */
    var Stage = function (config) {
        config = config || {};
        this.id = config.id;

        if (config.interval > 1) {
            this.phase = phaseFactory(config.interval, config.offset);
        }

        if ('function' === typeof config.prep) {
            this.prep = config.prep.bind(this);
        }

        if ('function' === typeof config.evaluate) {
            this.evaluate = config.evaluate.bind(this);
        }

        if ('function' === typeof config.init) {
            config.init.call(this);
        }
    };

    return Stage;
});

define('src/proscenium',[
    'src/actor',
    'src/curtain',
    'src/scene',
    'src/stage'
], function (Actor, Curtain, Scene, Stage) {
    
    
    var Proscenium = { 
        actors: {},
        _actors: 0,
        curtains: {},
        _curtains: 0,
        scenes: {},
        _scenes: 0,
        stages: {},
        _stages: 0,
        roles: Actor.prototype._roles,
        
        create: function (Constructor, collection, id, config) {
            config = config || ('string' !== typeof id && id);
            id = id || collection + '-' + this['_' + collection];
            config.id = config.id || id;
            var instance = new Constructor(config, this);
            this[collection][id] = instance;
            this['_' + collection] += 1;
            return instance;
        },

        destroy: function () {

        },
        
        actor: function (id, config) {
            config = config || {};
            return this.create(Actor, 'actors', id, config);
        },

        curtain: function (id, config) {
            config = config || {};
            return this.create(Curtain, 'curtains', id, config);
        },

        role: function (id, role) {
            Actor.prototype._roles[id] = {
                definition: role,
                members: []
            };
        },
        
        scene: function (id, config) {
            config = config || {};
            return this.create(Scene, 'scenes', id, config);
        },
        
        stage: function (id, config) {
            config = config || {};
            return this.create(Stage, 'stages', id, config);
        }
    };
    
    return Proscenium;
});

/**
 * This is an example implementation of Conway's Game of Life using Proscenium
 */

require(['src/proscenium', 'src/util'], function (Proscenium, util) {
    /**
     * The start of our implementation deals mostly with game logic and barely involves Proscenium at all. After
     * defining two configuration constants for board size we define a function that walks through the game board
     * creating and initializing an actor at each square on the board. This will be used when the main scene is
     * initialized. If our game was larger, we'd probably want to put this sort of logic in a dedicated file for
     * that scene.
     */

    window.util = util;

    var HEIGHT, WIDTH;

    WIDTH = 120;
    HEIGHT = 50;

    Array.prototype.contains = function (x) {
        return (-1 === this.indexOf(x));
    };

    function initializeActors() {
        var i, j, cell, cells, column, row, ACORN;

        cells = [];
        column = [];
        row  = [];

        // We want the acorn to play out for many generations, but here's just a little variety for each start.
        function randomizeOrigin() {
            var origin = {};
            origin.x = Math.floor(0.5 * WIDTH + Math.random() * 0.1 * WIDTH);
            origin.y = Math.floor(0.1 * HEIGHT + Math.random() * 0.2 * HEIGHT);
            return origin;
        }

        // When applied to a group of cells, activate only those that will create this structure at the given origin.
        ACORN = (function (origin) {
            return function (x, y) {
                var dx, dy, value;
                dx = x - origin.x;
                dy = y - origin.y;
                if ((0 === dy && -1 !== [-3, -2, 1, 2, 3].indexOf(dx)) || (-1 === dy && 0 === dx) || (-2 === dy && -2 === dx)) {
                    value = true;
                }
                return !!value;
            }
        }(randomizeOrigin()));

        // Instantiate a cell actor for every position on the grid.
        for (i = 0; i < HEIGHT; i += 1) {
            column[i] = [];
            for (j = 0; j < WIDTH; j += 1) {
                row[j] = [];
                cell = Proscenium.actor().role('cell');
                cell.state.x = j;
                cell.state.y = i;
                cell.state.alive = ACORN(j, i);
                column[i].push(cell);
                row[j].push(cell);
                cells.push(cell);
            }
        }

        // Go back through the entire grid and add a reference to the neighbors for every cell actor
        for (i = 0; i < column.length; i += 1) {
            for (j = 0; j < column[i].length; j += 1) {
                if (j > 0) {
                    column[i][j].neighbors.push(column[i][j - 1]);
                }
                if (j < row.length - 1) {
                    column[i][j].neighbors.push(column[i][j + 1]);
                }
                if (i > 0) {
                    column[i][j].neighbors.push(column[i - 1][j]);
                    if (j > 0) {
                        column[i][j].neighbors.push(column[i - 1][j - 1]);
                    }
                    if (j < row.length - 1) {
                        column[i][j].neighbors.push(column[i - 1][j + 1]);
                    }
                }
                if (i < column.length - 1) {
                    column[i][j].neighbors.push(column[i + 1][j]);
                    if (j > 0) {
                        column[i][j].neighbors.push(column[i + 1][j - 1]);
                    }
                    if (j < row.length - 1) {
                        column[i][j].neighbors.push(column[i + 1][j + 1]);
                    }
                }
            }
        }

        return cells;
    }

    /**
     * Define Actor Roles
     *
     * A role may serve as a simple label for a group of actors or it may provide some additional functionality that
     * will be shared among all members of that role.
     *
     * In this example, we only have one type of actor so we only need to define one role. Whenever this role is
     * applied to an actor, the init function will run, so that's where we set some default properties.
     *
     * Where other Proscenium constructor patterns accept a configuration object, the role constructor accepts a
     * prototype definition. This means there is no limitation to configuration options for roles. Every propoerty on
     * the prototype definition will be inherited by all actors assuming that role.
     *
     * TODO: Roles need to clean up after themselves when unassigned, restoring any properties they overwrote.
     */

    Proscenium.role('cell', {
        init: function () {
            this.state.alive = false;
            this.neighbors = [];
        },
        test: function () {
            var count, value;
            count = 0;
            this.neighbors.forEach(function (neighbor) {
                if (neighbor.state.alive) {
                    count += 1;
                }
            });
            if (3 === count) {
                value = true;
            } else if (this.state.alive && 2 === count) {
                value = true;
            }
            return value;
        }
    });

    /**
     * Define Stages
     *
     * This game will only need one scene, but it will execute on two stages. The "life" stage executes the game logic
     * for determining which cells die or are born each generation. The second stage "paper" handles visual rendering
     * via the Paper.js library.
     *
     * The life stage takes advantage of a processor load option available to stages. The interval and offset
     * configuration options are used internally to decide on which frames to evaluate this stage. By giving 3 and 1
     * as the interval and offset, we've set this stage to run every third frame starting on frame 2 (2, 5, 8, ...).
     * In this example, there is no other processor-intensive stage to balance against, so these settings merely serve
     * to retard the simulation speed (which would probably have been done better by utilizing the millisecond interval
     * argument passed in to every evaluate call).
     *
     * The paper stage illustrates how Proscenium is agnostic toward any external libraries dedicated to handling tasks
     * like rendering, physics, sound, or network traffic. Any of these may run on their own stage or be grouped onto
     * shared stages as appropriate for a particular game.
     */

    Proscenium.stage('life', {
        interval: 3,
        offset: 1,
        init: function () {
            this.all = [];
            this.live = [];
        },
        prep: function () {
            var live = this.live;

            this.all = Proscenium.roles.cell.members;
            this.all.forEach(function (cell) {
                if (cell.state.alive) {
                    live.push(cell);
                }
            });
        },
        evaluate: function (interval) {
            var expirers, survivors;

            survivors = [];
            expirers = [];

            this.live.forEach(function (cell) {
                if (cell.test()) {
                    survivors.push(cell);
                } else {
                    expirers.push(cell);
                }
                cell.neighbors.forEach(function (neighbor){
                    if (!neighbor.state.alive && -1 === survivors.indexOf(neighbor) && -1 === expirers.indexOf(neighbor)) {
                        if (neighbor.test()) {
                            survivors.push(neighbor);
                        } else {
                            expirers.push(neighbor);
                        }
                    }
                });
            });

            expirers.forEach(function (cell) {
                cell.state.alive = false;
            });

            survivors.forEach(function (cell) {
                cell.state.alive = true;
            });

            this.live = survivors;
        }
    });

    Proscenium.stage('paper', {
        init: function () {
            this.cells = [];
            this.dots = [];
            this.radius = 5;
        },
        prep: function () {
            var dot, dots, protoDot, radius;

            dots = this.dots;
            radius = this.radius;

            paper.setup(document.getElementById('paper-canvas'));
            paper.view.viewSize = new paper.Size(2 * radius * WIDTH, 2 * radius * HEIGHT);

            protoDot = new paper.Path.Circle(new paper.Point(0, 0), 1.1 * radius);
            protoDot.fillColor = new paper.Color(0.2, 0.8, 0.9);

            dot = new paper.Symbol(protoDot);

            this.cells = Proscenium.roles.cell.members;
            this.cells.forEach(function (cell) {
                dots.push(
                    dot.place(new paper.Point(
                        radius + cell.state.x * 2 * radius,
                        radius + cell.state.y * 2 * radius
                    ))
                );
            });
        },
        evaluate: function () {
            var dots = this.dots;
            this.cells.forEach(function (cell, i) {
                dots[i].visible = cell.state.alive;
            });
            paper.view.draw();
        }
    });


    /**
     * Define Curtains
     *
     * This example is extremely light on user interface elements, and that's how curtains are intended to be used.
     * The curtain declared below simply updates a count of live cells.
     */

    Proscenium.curtain('cells', {
        element: document.getElementById('cells-info'),
        calculate: function () {
            var data, count = 0;

            this.actors.forEach(function (cell) {
                if (cell.state.alive) {
                    count += 1;
                }
            });

            data = {
                framerate: Proscenium.scenes.main._framerate,
                count: count
            };

            return data;
        },
        template: function (data) {
            return data.count + ' live cell' + (1 === data.count ? '' : 's') + ' at ' + (data.framerate || '0') + 'fps';
        }
    });

    /**
     * Define Scenes
     *
     *
     */

    Proscenium.scene('main', {
        throttle: 60,
        curtains: ['cells'],
        stages: ['life', 'paper'],
        prep: function () {
            var cells = initializeActors();
            this.actors.concat(cells);
            Proscenium.curtains.cells.add(cells);
        },
        always: function (interval) {
            Proscenium.curtains.cells.update();
        }
    });

    /**
     * Showtime!
     */
    Proscenium.scenes.main.begin();

    // Just to make debugging a little easier
    window.Proscenium = Proscenium;
});

define("examples/life/life.js", function(){});

