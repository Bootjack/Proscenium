define([], function () {
    'use strict';
    
    function Curtain(config) {
        config = config || {};
        if (window && window.document) {
            if (config.element && window.document.body.contains(config.element)) {
                this.element = config.element;
            } else if (config.element) {
                this.element = window.document.getElementById(config.element);
            } else {
                this.element = window.document.body.appendChild(window.document.createElement('div'));
                this.element.id = 'curtain-' + config.id;
            }
        }
    }
    
    return Curtain;
});
