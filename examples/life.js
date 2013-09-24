require(['src/proscenium.js'], function (Proscenium) {
    var i, j, cell, column, row, paper, WIDTH, HEIGHT;
    WIDTH = 100;
    HEIGHT = 20;
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
       
    Proscenium.actor('debug');
    Proscenium.curtains.cells.add(Proscenium.actors.debug);

    for (i = 0; i < HEIGHT; i += 1) {
        column[i] = [];
        for (j = 0; j < WIDTH; j += 1) {
            row[j] = [];
            cell = Proscenium.actor().role('cell');
            cell.state.y = i;
            cell.state.x = j;
            cell.state.alive = (Math.random() > 0.8);
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
                if (dots[i].visible !== cells[i].state.alive) {
                    dots[i].visible = cells[i].state.alive;                    
                }
            }
            paper.view.draw();
        };
    }());
    Proscenium.scenes.main.stages['paper'] = Proscenium.stages.paper;
    
    Proscenium.scenes.main.run();
    
    window.Proscenium = Proscenium;
});
