define([], function () {
    function Collection() {
        this.objects = [];
    }
    
    Collection.prototype.update = function () {
        this.objects = this.objects || [];
    };
    
    Collection.prototype.add = function (object) {
        var self = this;
        this.objects = this.objects || [];
        function boundListener() {
            self.update(arguments);
        }
        object.on('update', boundListener);
        this.objects.push(object);
        this.update();
        return this;
    };
    
    return Collection;
});
