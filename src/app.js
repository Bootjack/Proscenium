require(['src/paperclip-engine.js', 'lib/phyzix/phyzix.js'], function (Paperclip, Phyzix) {

    //paperclip = new Paperclip();
    //paperclip.scene('menu.main');

    var physics, dude;
    physics = new Phyzix();
    dude = new physics.Body(50, 100);
    console.log(dude);
    console.log(physics);
});
