define([], function () {
    'use strict';
    
    var array, curtains;
    curtains = {};
    array = [];
    
    function Curtain(id, config) {
        if ('string' !== typeof id) {
            config = id;
            id = array.length;
        }
        config = config || {};
        var curtain = {};
        if (window && window.document) {
            if (config.element && window.document.body.contains(config.element)) {
                curtain.element = config.element;
            } else if (config.element) {
                curtain.element = window.document.getElementById(config.element);
            } else {
                curtain.element = window.document.body.appendChild(window.document.createElement('div'));
                curtain.element.id = 'curtain-' + id;
            }
        }

        curtains[id] = curtain;
        array.push(curtain);
        return curtain;
    }

    Curtain._curtains = curtains;
    Curtain._array = array;
    Curtain.destroy = function (curtain) {
        try {
            curtain.element.parentElement.removeChild(curtain.element);
        } catch (err) {}
        delete this._array[this._array.indexOf(curtain)];
        delete this._curtains[curtain.id];
        curtain = undefined;
    };
    Curtain.prototype.destroy = function () {
        Curtain.destroy(this);
    };
    
    return Curtain;
});
