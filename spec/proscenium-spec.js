define(['src/proscenium.js'], function (Proscenium) {
    describe('Proscenium', function () {
        describe('initializes with', function () {
            it('an empty set of actors', function () {
                expect(Proscenium.actors).toEqual({});
                expect(Proscenium._actors).toBe(0);
            });
            it('an empty set of curtains', function () {
                expect(Proscenium.curtains).toEqual({});
                expect(Proscenium._curtains).toBe(0);
            });
            it('an empty set of scenes', function () {
                expect(Proscenium.scenes).toEqual({});
                expect(Proscenium._scenes).toBe(0);
            });
            it('an empty set of stages', function () {
                expect(Proscenium.stages).toEqual({});
                expect(Proscenium._stages).toBe(0);
            });
        });
    });
});
