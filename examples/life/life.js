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
     * prototype definition. This means there is no limitation to configuration options for roles. Every property on
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
