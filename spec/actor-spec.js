define(['src/actor.js'], function (Actor) {
    describe('Actor', function () {
        describe('initializes with', function () {
            var actor = new Actor();
            it('an empty state', function () {
                expect(actor._state).toBeDefined();
            });
        });
        it('can define new roles', function () {
            var actor = new Actor();
            Actor.prototype._roles['test-role'] = {
                hasTestRole: true
            };
            expect(actor.hasTestRole).toBeFalsy();
            expect(actor.hasAnotherTestRole).toBeFalsy();
            expect(actor.hasLastTestRole).toBeFalsy();
            actor.role('test-role');
            expect(actor.hasTestRole).toBeTruthy();
            Actor.prototype._roles['another-test-role'] = {
                hasAnotherTestRole: true
            };
            Actor.prototype._roles['last-test-role'] = {
                hasLastTestRole: true
            };
            actor.role(['another-test-role', 'last-test-role']);
            expect(actor.hasAnotherTestRole).toBeTruthy();
            expect(actor.hasLastTestRole).toBeTruthy();
            Actor.prototype._roles = {};
        });
    });
});
