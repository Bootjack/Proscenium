define([], function () {
    'use strict';
    
    function Curtain(config) {
        config = config || {};
        this.objects = [];
        if (window && window.document) {
            if (config.element instanceof HTMLElement) {
                this.element = config.element;
            } else if (config.element) {
                this.element = window.document.getElementById(config.element);
            } else {
                this.element = window.document.body.appendChild(window.document.createElement('div'));
                this.element.id = 'pr-curtain-' + config.id;
            }
        }
    }
    
    Curtain.prototype.destroy = function () {
        this.element.parentNode.removeChild(this.element);
    };
    
    Curtain.prototype.update = function () {
        var i, html;
        html = '<ul>' + "\n";
        for (i = 0; i < this.objects.length; i += 1) {
            html += '<li>' +
                'Light [' + i + '] is ' +
                (this.objects[i].state.on ? 'on' : 'off') +
                '.' +
                '</li>' +
                "\n";
        }
        html += '</ul>';
        this.element.innerHTML = html;
        return this;
    };
    
    Curtain.prototype.add = function (object) {
        var self = this;
        function boundListener() {
            self.update(arguments);
        }
        object.on('update', boundListener);
        this.objects.push(object);
        this.update();
    };
    
    return Curtain;
});
