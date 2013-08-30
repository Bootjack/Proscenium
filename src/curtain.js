define([], function () {
    'use strict';
    
    return function (world, config) {
        config = config || {};
        if (window && window.document && config.element) {
            if (window.document.body.contains(elem)) {
                this.element = elem;
            } else if (elem) {
                this.element = window.document.getElementById(elem);
            } else {
                this.element = window.document.body.appendChild(window.document.createElement('div'));
                this.element.id = 'curtain-interface';
            }
        }
    };
});
