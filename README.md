# Proscenium

A game engine that maybe takes the theatrical stage metaphor one step too far.

## Setup

This project uses Grunt and Bower, which need to be set up separately

    $ npm install
    $ bower install
    $ grunt build

Now you can view file:///[path/to/repo]/examples/life/index.html in your browser

## Usage

Currently implemented with Conway's Game of Life starting from the acorn pattern. But the important part
is that this demo game uses Proscenium actors, stages, and a scene to iterate and render the game world.
The debug output is also represented using a curtain.

The stage is little more than a shell for stage-type logic. It only requires an implementation of an evaluate()
method on it in order to run as part of a scene.

Latest benchmarking suggests that 60 fps should be possible for up to 1000 actors being redrawn each frame,
with an inversely proportional effect on framerate as that number increases (doubling the number of redrawn 
actors halves the effective framerate).
