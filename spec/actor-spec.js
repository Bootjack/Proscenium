define(['src/actor.js'], function (Actor) {
    describe('Actor', function () {
        describe('initializes with', function () {
            var actor = new Actor();
            it('an empty state', function () {
                expect(actor.state).toEqual({});
            });
        });
        describe('has one or more roles', function () {
            var actor = new Actor();
            Actor.prototype._roles['test-role'] = {
                definition: {hasTestRole: true},
                members: []
            };
            Actor.prototype._roles['another-test-role'] = {
                definition: {hasAnotherTestRole: true},
                members: []
            };
            Actor.prototype._roles['last-test-role'] = {
                definition: {hasLastTestRole: true},
                members: []
            };
            it('that can be defined and assigned', function () {
                expect(actor.hasTestRole).toBeFalsy();
                expect(actor.hasAnotherTestRole).toBeFalsy();
                expect(actor.hasLastTestRole).toBeFalsy();
                actor.role('test-role');
                expect(actor.hasTestRole).toBeTruthy();
                actor.role(['another-test-role', 'last-test-role']);
                expect(actor.hasAnotherTestRole).toBeTruthy();
                expect(actor.hasLastTestRole).toBeTruthy();
            });
            it('that group actors by role', function () {
                expect(Actor.prototype._roles['last-test-role'].members).toContain(actor);
                expect(actor.roles).toContain('last-test-role');
            });
        });
    });
});
