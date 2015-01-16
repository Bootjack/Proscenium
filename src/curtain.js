define([
    'src/collection',
    'src/util'
], function (
    Collection,
    util
) {
    'use strict';
    
    var Curtain = function (config) {
        config = config || {};
        this._updating = false;

        if ('function' === typeof config.beforeUpdate) {
            this.beforeUpdate = config.beforeUpdate;
        }

        if ('function' === typeof config.afterUpdate) {
            this.afterUpdate = config.afterUpdate;
        }

        if (config.template) {
            this.template = config.template;
        }

        if ('function' === typeof config.calculate) {
            this.calculate = config.calculate;
        }

        if ('function' === typeof config.render) {
            this.render = config.render;
        }

        if (config.element instanceof HTMLElement) {
            this.element = config.element;
        } else if (config.element) {
            this.element = document.getElementById(config.element);
        } else {
            this.element = document.body.appendChild(document.createElement('div'));
            this.element.id = 'pr-curtain-' + config.id;
        }

        if ('function' === typeof config.init) {
            config.init.call(this);
        }
    };

    /**
     * The updating process is intended to be highly configurable. Any work that needs to be done whenever the
     * curtain is updated but is unrelated to rendering new curtain content belongs in beforeUpdate or afterUpdate.
     *
     * The rendering process itself is run by render(), which first prepares data using calculate() and then passes
     * that data to template(). At a minimum the template must be provided in order to generate any output. By default
     * the template is rendered with the entire curtain object passed as its data context. To change this behavior,
     * provide a custom calculate function that returns a data object. To customize the entire render process, a new
     * render function may be provided that does something completely different..
     */

    Curtain.prototype.beforeUpdate = function () {};

    Curtain.prototype.afterUpdate= function () {};

    Curtain.prototype.calculate = function () {
        return this;
    };

    Curtain.prototype.template = function () {
        return "";
    };

    Curtain.prototype.render = function () {
        var data = this.calculate();
        return this.template(data);
    };

    Curtain.prototype.update = function () {
        var that = this;

        if (!this._updating) {
            this._updating = true;
            this.beforeUpdate();
            this.element.innerHTML = this.render();
            this.afterUpdate();

            setTimeout(function () {
                that._updating = false;
            }, 5);
        }
        return this;
    };

    Curtain.prototype.destroy = function () {
        this.element.parentNode.removeChild(this.element);
    };

    Curtain = util.mixin(Curtain, [Collection], {name: 'actors'});

    return Curtain;
});
