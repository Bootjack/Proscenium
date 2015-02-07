require([
    'bower_components/Snap.svg/dist/snap.svg',
    '../../dist/proscenium'
], function (
    Snap,
    Proscenium
) {
    if (Snap) {
        console.log('Hey, we got Snap');
    }
    if (Proscenium) {
        console.log('Hey, we got Proscenium');
    }
});
