# Project-Battleship

Battleships game built with JavaScript, CSS & HTML

Human vs Computer only. The main focus of the build looked at implementing the computer opponent. Less effort toward the game aesthetic.

Although a lot of effort has gone into making the computer make intelligent decisions, of curse there are still room for improvements (see improvements below) Have a play and see what you think.

Improvements:

1. For computer's target board, remove the off-limit cells for sunk ships. As no two ships can be touching

Todo:

1.  Make computer better by having another single square processing route that has options in only one direction which rolls off the generalFoundHitProcessing() method - DONE
2.  Start screen to have enter name only. Once name is submitted this reveals the boards with the player name in place - DONE
3.  Keep reset button visible during game play. Clicking this should rerun the generateUI() method to restart the game (similar to refreshing the browser) - DONE
4.  Implement the computer setTimeout delay by deactivating the human click listener on clicking the human turn and reactivating at the end of the computer turn - DONE

Further comments:

- This is all my own work and like most of the programing problems I tackle has allowed for a decent amout of learning
- At this point I am still undecided to whether the factory function approach that reveals an object of methods that use private variables within its execution context (closure) or using classes with shared methods on the prototype and simple instance properties is better? First feeling is that classes and objects are a easier to visualise. Refactoring the to use classes is a task for another day!
