define(['src/scene', 'src/actor'], function (Scene, Actor) {
    describe('Scene', function () {
        var scene = new Scene();
        Actor.prototype._roles['test'] = {
            definition: {},
            members: []
        };
        it('starts with an empty set of actors', function () {
            expect(scene.actors).toBeDefined();
        });
    });
});
