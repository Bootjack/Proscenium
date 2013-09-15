require(['src/proscenium.js'], function (Proscenium) {
    var actor, curtain, element, wrapper;
    element = document.createElement('div');
    element.id = 'curtain-lights';
    wrapper = document.getElementById('page-wrapper');
    wrapper.appendChild(element);
    curtain = Proscenium.curtain('lights', {
        element: 'curtain-lights'
    });
    curtain.template = function (obj) {
        var i, html;
        html = '<ul>' + "\n";
        for (i = 0; i < obj.objects.length; i += 1) {
            html += '<li>' +
                'Light [' + i + '] is ' +
                (obj.objects[i].state.on ? 'on' : 'off') +
                '.' +
                '</li>' +
                "\n";
        }
        html += '</ul>';
        return html;
    };
    Proscenium.role('light', {
        init: function () {
            this._seed = Math.floor(Math.random() * 500);
        },
        switch: function (direction) {
            if (!direction && !this.state.on) {
                direction = 'on';                    
            }
            this.set('on', ('on' === direction || 'up' === direction));
            return this;
        },
        evaluate: function () {
            var time = new Date().getTime() % 1000;
            if (time > this._seed && time < this._seed + 10) {
                return function () {
                    this.switch();
                };
            } else {
                return false;
            }
        }
    });
    Proscenium.scene('main');
    for (i = 0; i < 8; i += 1) {
        actor = Proscenium.actor('light1').role('light').switch('off');
        Proscenium.curtains.lights.add(actor);
        Proscenium.scenes.main.load(actor);
    }
    
    Proscenium.scenes.main.init().run();

    window.Proscenium = Proscenium;
});
