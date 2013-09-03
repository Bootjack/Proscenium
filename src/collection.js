define([], function () {
    'use strict';

    var array, map;
    map = {};
    array = [];

    function Collection(id, config) {
        if ('string' !== typeof id) {
            config = id;
            id = array.length;
        }
        config = config || {};
        var item = {};

        map[id] = item;
        array.push(item);
        return item;
    }

    Collection._object = map;
    Collection._array = array;
    Collection.destroy = function (item) {
        delete this._object[item.id];
        delete this._array[this._array.indexOf(item)];
        item = undefined;
    };
    Collection.prototype.destroy = function () {
        Collection.destroy(this);
    };

    return Collection;
});
