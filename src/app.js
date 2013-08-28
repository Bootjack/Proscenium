require([], function () {
    // Create an empty project and a view for the canvas
    paper.setup(document.getElementById('paper-canvas'));

    // Create a shape as a meta for paths
    // NOTE: This is just me thinking through the tutorial; Paper likely has a better way
    var alpha, bravo, charlie, delta, shape, uva;

    shape = {
        outline: new paper.Path(),
        origin: {x: 50, y: 50, z: 0},
        box: {hh: 40, hw: 40}
    };

    // Give the outline a stroke color
    shape.outline.strokeColor = 'black';

    // Draw the shape relative to origin
    shape.outline.add(
        new paper.Point(-shape.box.hw, -shape.box.hh),
        new paper.Point(-shape.box.hw, shape.box.hh),
        new paper.Point(shape.box.hw, shape.box.hh),
        new paper.Point(shape.box.hw, -shape.box.hh)
    );

    shape.outline.closed = true;
    shape.outline.position.x += shape.origin.x;
    shape.outline.position.y += shape.origin.y;

    alpha = shape.outline.clone();
    alpha.insert(1, new paper.Point(shape.origin.x + 31, shape.origin.y + 25, shape.origin.z));
    alpha.position.x += 150;
    
    bravo = alpha.clone();
    bravo.closed = false;
    bravo.position.x += 150;
    
    charlie = bravo.clone();
    charlie.removeSegment(3);
    charlie.position.x += 150;
    
    delta = charlie.clone();
    delta.smooth();
    delta.position.x += 150;
    
    new paper.Path.Rectangle(new paper.Rectangle(new paper.Point(200, 150), new paper.Point(250, 200))).strokeColor = "red";
    
    new paper.Path.RegularPolygon({x: 400, y: 175}, 7, 30).strokeColor = new paper.Color(0.8, 0.5, 0);
    
    /* This is a weird one. The docs seem to suggest that the importSVG function is available on Item, 
     * Shape, Layer, etc., but it only appears on paper.project (not even paper.Project, mind you). */
    uva = paper.project.importSVG(document.getElementById('svg-2'));
    uva.position = {x: 300, y: 350};

    uva.onFrame = function (event) {
        var target = 60 / 1000;
        uva.rotate(3 * event.delta / target);
    };
    
    // Draw the view now:
    paper.view.draw();
});
