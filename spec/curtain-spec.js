define(['src/curtain.js'], function (Curtain) {
    describe('Curtain', function () {
        var curtain = new Curtain();
        it('creates a DOM element', function () {
            var element = document.getElementById('curtain-0');
            expect(element).toBeDefined();
        });
    });
});
