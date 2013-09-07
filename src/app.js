require(['src/proscenium.js'], function (Proscenium) {
    var curtain, element, wrapper;
    element = document.createElement('div');
    element.id = 'curtain-lights';
    wrapper = document.getElementById('page-wrapper');
    wrapper.appendChild(element);
    curtain = Proscenium.curtain('lights', {
        element: 'curtain-lights'
    });
    Proscenium.role('light', {
        switch: function (direction) {
            if (!direction && !this.state.on) {
                direction = 'on';                    
            }
            this.set('on', ('on' === direction || 'up' === direction));
        }
    });
    Proscenium.actor('light-1').role('light').switch('off');
    curtain.add(Proscenium.actors['light-1']);
    window.Proscenium = Proscenium;
});
