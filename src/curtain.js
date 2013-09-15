define(['src/collection', 'src/util'], function (Collection, util) {
    'use strict';
    
    function Curtain(config) {
        config = config || {};
        this._updating = false;
        this.actors = this.objects;
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
    
    util.mixin(Curtain, Collection);
    
    Curtain.prototype.destroy = function () {
        this.element.parentNode.removeChild(this.element);
    };
    
    Curtain.prototype.update = function () {
        var self = this;
        if (!this._updating) {
            this._updating = true;
            if ('function' === typeof this.beforeUpdate) {
                this.beforeUpdate();
            }
            this.element.innerHTML = this.template(this);
            if ('function' === typeof this.afterUpdate) {
                this.beforeUpdate();
            }
            setTimeout(function () {
                self._updating = false;
            }, 5);
        }
        return this;
    };
    
    return Curtain;
});
