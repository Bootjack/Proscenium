define([], function () {
    'use strict';
    
    function Curtain(id, config) {
        config = config || {};
        this.objects = [];
        if (window && window.document) {
            if (config.element && window.document.body.contains(config.element)) {
                this.element = config.element;
            } else if (config.element) {
                this.element = window.document.getElementById(config.element);
            } else {
                this.element = window.document.body.appendChild(window.document.createElement('div'));
                this.element.id = 'pr-curtain-' + id;
            }
        }
    }
    
    Curtain.prototype.destroy = function () {
        this.element.parentNode.removeChild(this.element);
    };
    
    Curtain.prototype.update = function () {
        console.log('curtain update called from bound listener')
    };
    
    Curtain.prototype.add = function (object) {
        var self = this;
        function boundListener() {
            console.log('bound listener called');
            self.update(arguments);
        }
        object.on('update', boundListener);
        this.objects.push(object);
    };
    
    return Curtain;
});
