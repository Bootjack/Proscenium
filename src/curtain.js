define([], function () {
    'use strict';
    
    function Curtain(config) {
        config = config || {};
        this.objects = [];
        this.template = function () {};
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
        if ('function' === typeof this.beforeUpdate) {
            this.beforeUpdate();
        }
        this.element.innerHTML = this.template(this);
        if ('function' === typeof this.afterUpdate) {
            this.beforeUpdate();
        } 
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
