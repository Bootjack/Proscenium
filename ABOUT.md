# About Proscenium

The philosophy behind this game engine.

## What is a game?

A game is a set of objects, each assigned an initial state. The game 
challenges the player to manipulate the state of the game objects
into a winning state while avoiding any potential losing states.
The game may have a single winning state, in which case the challenge
is inherent to the difficulty of altering the state of game objects.
Or each player may have their own winning state, in which case the 
challenge emerges from competing players attempting to achieve 
conflicting game states so that either they win, their opponents
lose, or both.

## Scenes

A scene is a segment of gameplay having a defined initial state and
one or more end states. One scene may comprise an entire game, or a
game may require the player to progress through multiple scenes.
The initial state of a scene may be influenced by the end states of
previous scenes. This is achieved by saving the state of objects from
the end of a scene to a global set of game object states. Subsequent 
scenes may load those global states into the initial scene state.

This may seem like a tedious distinction, but it is an important construct
for persisting the game world efficiently. There's nothing stopping a
complex game world from persisting every game object in perpetuity within
a single scene, but this is likely to be inefficient. If we can define
individual scenes that can be loaded, run, and discarded at any time, we
can likely optimize the gameplay during each scene, allowing for manageable
complexity and fast rendering. The global objects persisted between scenes
are static, but allow the scenes to load in a way that is consistent with
experiences the player has already had in other scenes. Note that none
of this limits the scenes to a linear progression.

## Stage

Scenes are presented on the stage. This is essentially a read-only operation.
Audience participation is as much a part of theatre as it is a game. Indeed,
probably more so, because even inferred reactions from the audience can shape
the presentation of a play. And in a game, the interaction is always mediated 
by some form of interface. Any audience member could potentially walk on stage
in the middle of a play and punch an actor. Any game with a dialog tree
serves to show that such freedom is not only discouraged but impossible in
a game situation.

As in a play, when the scene needs to
change, we probably want to hide that activity behind a curtain. This is
where the interface comes in.

## Curtain

The curtain is the interface layer on top of the stage.  The most basic
function of the curtain is to transition between scenes. Most likely
the first thing a player encounters is a gameplay selection interface.
This could be a selection of unlocked levels, single- or multi-player
game types, or configuration options. The curtain also manages any
loading states to inform the player that the game is working and will
proceed to the next scene as soon as it's available.

What makes the curtain such an apt metaphor is that it also persists on top
of the stage throughout scenes. The curtain is the medium through which
the player interacts with the scenes on the stage. It captures player input
like keyboard or mouse controls and provides meta-information about the
scene and objects.

This is how non-visual gameplay becomes a viable option. In such a game,
there may be no rendered visuals of the game objects because their visual 
relationships are irrelevant to gameplay. In such a case it feels as if the 
game is the interface. This is almost true. A typical card game like Hearts
illustrates the distinction between interface and stage in such a case.
The interface shows the player the cards in their hand, but the visual
relationship among those cards and between them and the other cards in the 
game is irrelevant. The world tracks the state of each card from the deck
to the players hand to the current trick to the winning player's pile.
The interface shows the player information about the game state and handles
the player's actions, including showing which actions are available at each
point in the game. And yes, a card game could include a rendered scene
to track the position of each card, animated smoothly at 60 fps. It could 
also include a physics engine to calculate the friction of cards sliding
across the table. That may even be a really cool idea.

The point is that a game can exist without a rendered scene, or physics,
or sound. What's left when those elements are removed is the abstraction
of a game that this framework aims to manage. 

## Hierarchy

Proscenium (essentially a global namespace)
- world
- Curtain
- Actor
- Scene
