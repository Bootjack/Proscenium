define(['src/curtain', 'src/emitter'], function (Curtain, Emitter) {
    describe('Curtain', function () {
        var actor, curtain;
        curtain = new Curtain({id: 'test'});
        actor = new Emitter();
        actor.state = {};
        it('creates a DOM element', function () {
            var element = document.getElementById('pr-curtain-test');
            expect(element).toBeTruthy();
        });
        it('tracks a set of objects', function () {
            spyOn(curtain, 'update');
            curtain.add(actor);
            expect(curtain.objects).toContain(actor);
            actor.trigger('update');
            expect(curtain.update).toHaveBeenCalled();
        })
    });
});
