define(['src/curtain.js'], function (Curtain) {
    describe('Curtain', function () {
        var testCurtain;
        it('can create a new curtain by name', function () {
            new Curtain('test');
            expect(Curtain._object['test']).toBeDefined();
        });
        it('can create a new anonymous curtain', function () {
            testCurtain = new Curtain();
            expect(Curtain._array.length).toBe(2);
        });
        it('can destroy a curtain by name', function () {
            expect(false).toBeTruthy();
        });
        it('can destroy a curtain by reference', function () {
            expect(false).toBeTruthy();
        });
    });
});
