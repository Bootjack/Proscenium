require(['src/proscenium.js'], function (Proscenium) {
    var i, j, cell, column, row, WIDTH, HEIGHT;
    WIDTH = 20;
    HEIGHT = 20;
    column = [];
    row  = [];
    
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
    
    Proscenium.stage('paper');
    
    Proscenium.actor('debug');
    Proscenium.curtains.cells.add(Proscenium.actors.debug);

    for (i = 0; i < WIDTH; i += 1) {
        column[i] = [];
        for (j = 0; j < HEIGHT; j += 1) {
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
    
    Proscenium.scenes.main.run();
    
    window.Proscenium = Proscenium;
});
