describe('Curtain', function () {
    it('initializes with one empty world', function () {
        expect(game.world).toBeDefined();
        expect(game.world.length).toBe(0);
    });
    
    it('initializes with one proscenium', function () {
        expect(game.proscenium).toBeDefined();
    });
    
    describe('Proscenium', function () {
        beforeEach(function () {
            // Set up importable DOM element
            var element = document.createElement('div');
            element.id = 'test-proscenium';
            document.body.appendChild(element);            
        });
        
        afterEach(function () {
            // Tear down importable DOM element
            document.body.removeChild(element);
        });
        
        it('creates a DOM element', function () {
            game.proscenium();
            expect(document.getElementById('proscenium')).toBeTruthy();
        });
        
        it('accepts an existing DOM element by reference', function () {
            game.proscenium(element);
            expect(document.body.contains(element)).toBeTruthy();
        });
        
        it('accepts an existing DOM element by id', function () {
            game.proscenium(element);
            expect(document.getElementById('game-interface-test')).toBeTruthy();
        });
    });
    
    describe('World', function () {
        it('holds newly created actors', function () {
            var actor = new game.Actor();
            expect(game.world.length).toBe(1);
        })
    })
})
