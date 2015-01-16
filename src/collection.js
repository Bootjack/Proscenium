define([], function () {

    // Utility functions
    function addOne (name, object) {
        object.on('update', this.update.bind(this));
        this[name].push(object);
        this.update();
    }

    function removeOne (name, object) {
        var index = this[name].indexOf(object);
        this[name].splice(index, 1);
        object.off('update', this.update.bind(this));
        this.update();
    }

    var Collection = function (config) {
        var collection, name;
        config = config || {};

        collection = [];
        name = config.name || 'collection';

        this[name] = collection;
        this.addOne = function (object) {
            addOne.call(this, name, object);
        };

        this.removeOne = function (object) {
            removeOne.call(this, name, object);
        };

        this.clear = function () {
            this[name].forEach(this.removeOne.bind(this));
        };
    };

    Collection.prototype.update = function () {
        return this;
    };
    
    Collection.prototype.add = function (addition) {
        if (Array === addition.constructor) {
            addition.forEach(this.addOne.bind(this));
        } else {
            this.addOne(addition);
        }

        return this;
    };

    Collection.prototype.remove = function (member) {
        if (Array === member.constructor) {
            member.forEach(this.removeOne.bind(this));
        } else {
            this.removeOne(member);
        }
    };
    
    return Collection;
});
