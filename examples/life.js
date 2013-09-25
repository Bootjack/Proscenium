require(['src/proscenium.js'], function (Proscenium) {
    var i, j, cell, column, row, paper, WIDTH, HEIGHT;
    WIDTH = 80;
    HEIGHT = 50;
    ACORN = (function () {
        var ox, oy;
        ox = Math.floor(0.75 * WIDTH + Math.random() * 0.1 * WIDTH);
        oy = Math.floor(0.1 * HEIGHT + Math.random() * 0.2 * HEIGHT);
        return function (x, y) {
            var dx, dy, value;
            dx = x - ox;
            dy = y - oy;
            if ((0 === dy && -1 !== [-3, -2, 1, 2, 3].indexOf(dx)) || (-1 === dy && 0 === dx) || (-2 === dy && -2 === dx)) {
                value = true;
            }
            return !!value;
        }
    }());
    column = [];
    row  = [];
    paper = window.paper;
    
    Proscenium.role('cell', {
        init: function () {
            this.state.alive = false;
            this.neighbors = this.neighbors || [];
        },
        evaluate: function () {
            var i, count, execute;
            count = 0;
            /*
            for (i = 0; i < this.neighbors.length; i += 1) {
                if (this.neighbors[i].state.alive) {
                    count += 1;
                }
            }
            if (!this.state.alive && 3 === count) {
                execute = function () {
                    this.set('alive', true);
                };
            } else if (this.state.alive && (count < 2 || count > 3)) {
                execute = function () {
                    this.set('alive', false);
                }
            } else {
                execute = false;
            }
             return execute;
            */
            return false;
        }
    });
    
    Proscenium.curtain('cells');
    Proscenium.curtains.cells.template = function (obj) {
        var i, count, html;
        for (i = 0, count = 0; i < obj.objects.length; i += 1) {
            if (obj.objects[i].state.alive) {
                count += 1;
            }
        }
        html = count + ' live cell' + (1 === count ? '' : 's') + ' at ' + (Proscenium.actors.debug.state.framerate || '0') + 'fps';
        return html;
    };
    document.getElementById('page-wrapper').appendChild(Proscenium.curtains.cells.element);

    Proscenium.scene('main');
    Proscenium.scenes.main.always = function (interval) {
        Proscenium.actors.debug.set('framerate', this._framerate);
    };
    //Proscenium.scenes.main._throttle = 1;
    
    Proscenium.actor('debug');
    Proscenium.curtains.cells.add(Proscenium.actors.debug);

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
            Proscenium.curtains.cells.add(cell);
            Proscenium.scenes.main.load(cell);
        }
    }
    
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

    Proscenium.stage('life');
    (function () {
        var i, all, live;
        all = Proscenium.roles.cell.members;
        live = [];

        function test(cell) {
            var n, count, value;
            count = 0;
            for (n = 0; n < cell.neighbors.length; n += 1) {
                if (cell.neighbors[n].state.alive) {
                    count += 1;
                }
            }
            if (3 === count) {
                value = true;
            } else if (cell.state.alive && 2 === count) {
                value = true;
            }
            return value;
        }
        
        for (i = 0; i < all.length; i += 1) {
            if (all[i].state.alive) {
                live.push(all[i]);
            }
        }
        
        Proscenium.stages.life.evaluate = function () {
            var i, n, cell, neighbor, survivors;
            survivors = [];
            while (cell = live.pop()) {
                if (test(cell)) {
                    survivors.push(cell);
                }
                for (n = 0; n < cell.neighbors.length; n += 1) {
                    neighbor = cell.neighbors[n];
                    if (!neighbor.state.alive && -1 === survivors.indexOf(neighbor)) {
                        if (test(neighbor)) {
                            survivors.push(neighbor);
                        }
                    }
                }
            }
            for (i = 0; i < all.length; i += 1) {
                all[i].state.alive = false
            }
            while (cell = survivors.pop()) {
                cell.state.alive = true;
                live.push(cell);
            }
        };
    }());

    Proscenium.stage('paper');
    document.getElementById('page-wrapper').appendChild(document.createElement('canvas'));
    paper.setup(document.getElementsByTagName('canvas')[0]);
    (function () {
        var i, cells, dot, dots, protoDot, radius;
        radius = 5;
        paper.view.viewSize = new paper.Size(2 * radius * WIDTH, 2 * radius * HEIGHT);
        cells = Proscenium.roles.cell.members;
        protoDot = new paper.Path.Circle(new paper.Point(0, 0), 1.1 * radius);
        protoDot.fillColor = new paper.Color(0.2, 0.8, 0.9);
        dot = new paper.Symbol(protoDot);
        dots = [];

        for (i = 0; i < cells.length; i += 1) {
            dots.push(
                dot.place(new paper.Point(
                    radius + cells[i].state.x * 2 * radius,
                    radius + cells[i].state.y * 2 * radius
                ))
            );
        }

        Proscenium.stages.paper.evaluate = function () {
            for (i = 0; i < cells.length; i += 1) {
                dots[i].visible = cells[i].state.alive;                    
            }
            paper.view.draw();
        };
    }());

    Proscenium.scenes.main.stages['life'] = Proscenium.stages.life;
    Proscenium.scenes.main.stages['paper'] = Proscenium.stages.paper;
    
    Proscenium.scenes.main.run();
    
    window.Proscenium = Proscenium;
});
