define(['src/proscenium.js'], function (Proscenium) {
    describe('Proscenium', function () {
        describe('initializes with', function () {
            var Game = new Proscenium();
            it('exists', function () {
                expect(Game).toBeDefined();
            })
        });
    });
});
