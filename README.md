# kai-elo-rating
simple elo rating system implementation.

## elo-engine (default import)
This is the core of the library. It consists of a typescript implementation of Arpad Elo ranking system. Use this if you want to roll with your own handling of the ranking board, player roster and matches ledger.

The core propose the following helper functions:
### expectedScore
Evaluate chances of a player against an oppoennt based on their respective elo ranks. 
A player's expected score is their probability of winning plus half their probability of drawing. Thus, an expected score of 0.75 could represent a 75% chance of winning, 25% chance of losing, and 0% chance of drawing. On the other extreme it could represent a 50% chance of winning, 0% chance of losing, and 50% chance of drawing.

### scoreDifferential
Evaluates the elo rank shift that happens based on players ranks, match outcome and K factor. Basically this helper function can evaluate how much a player's rank will be affected by a match result against a specific opponent. The K factor only impact the apmlitude of the shift.

Given a K Factor there is 3 different possible match outcome for the player (actualScore)
1 = the player won the match (rank is increased)
0 = the player lost the match (rank is decreased)
0.5 = the match is a draw (rank shift slightly depending on opponent having a higher or lower rank than the player's)

### monoMatchCalculator
Evaluate player and opponent ELO rank change after match is decided. This helper is complimentary to both *expectedScore* and *scoreDifferential*.

Use this if you want to calculate both player and opponent rank shifts after a match. Players can have varying K factors.

### multiMatchCalculator
Use this helper to evaluate a player's rank shift considering several matches in a row. You want to use this in a tournament setting where players ranks are updated at the end of the whole tournament.

Only one player at a time is calculated this way. Therefore this helper has to be used for each players in the tournament to have the complete picture of all ranks shifts for the tournament.

## elo-ranks-board & elo-kfactor-rules
In case you don't want to handle all the manual handling of player rosters and matches ledger, you can use the elo-board class to handle that for you.
*Only supports mono matches*

You need to instantiate the class with an *initialRank* for new players and a *kFactorRule* handler. Then after you can add players and matches and ranks will be calculated and kept up-to-date for the whole player roster. 