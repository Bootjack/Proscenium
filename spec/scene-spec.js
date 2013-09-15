define(['src/scene', 'src/actor'], function (Scene, Actor) {
    describe('Scene', function () {
        var scene = new Scene();
        Actor.prototype._roles['test'] = {
            definition: {},
            members: []
        };
        describe('actors', function () {
            var actor = new Actor().role('test');
            it('starts with an empty set', function () {
                expect(scene.actors).toBeDefined();
            });
            it('can load actors into the set', function () {
                scene.load(actor.id);
                expect(scene.actors.length).toBe(1);
            });
            it('or unload them', function () {
                scene.unload(actor.id);
                expect(scene.actors.length).toBe(0);
            });
        });
    });
});
