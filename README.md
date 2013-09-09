# Proscenium

A game engine that maybe takes the theatrical stage metaphor one step too far.

## Setup

This project uses Grunt and Bower, which need to be set up separately

    $ npm install
    $ bower install
    $ grunt build

Now you can view file:///[path/to/repo]/public/index.html in your browser

## Usage

Doesn't do too much yet. Only Actor and Curtain are implemented, and those only just barely so. The index.html page runs a hello world game loaded from src/app.js. You can poke around in that file, or just alter the game state in your browser console. Try `Proscenium.actors['light-1'].switch()` to see the curtain use evented updating. The game world loads with one Actor assigned the role of "light," which implements simple light switch behavior: a state of on or off and a function to toggle between states or to a given state.

The curtain also supports adding more actors to track.

    Proscenium.curtains['lights'].add(
        Proscenium.actor('light-2').role('light')
    );
