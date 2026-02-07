# Adjust Game Timing

Modify the TIMING config in v1/game.js to change game speed.

## Location
File: `v1/game.js`
Config at top of file:
```js
const TIMING = {
    // Dice Roll
    diceRollInterval: 40,       // Speed of dice animation
    diceResultDelay: 400,       // Delay after showing result

    // Movement
    moveStepInterval: 300,      // Time between each step
    tileLandingDelay: 300,      // Delay before tile event triggers
    bossFightDelay: 1000,       // Delay before boss fight starts

    // Combat
    combatStartDelay: 20,       // Delay before combat begins
    combatTurnInterval: 1400,   // Time between turns
    attackAnimation: 300,       // Attack animation duration
    hurtAnimation: 300,         // Hurt animation duration
    enemyHurtDelay: 200,        // Delay before enemy takes damage
    enemyTurnDelay: 400,        // Delay before enemy attacks
    playerHurtDelay: 200,       // Delay before player takes damage
    victoryDelay: 1000,         // Delay after victory before loot
    defeatDelay: 1000,          // Delay after defeat before game over
};
```

## Presets
- **fast**: All values at 50%
- **normal**: Default values above
- **slow**: All values at 200%

## Usage Examples
- `/timing fast` - Apply fast preset
- `/timing combatTurnInterval 2000` - Set specific value
- `/timing diceRollInterval 20 combatTurnInterval 1000` - Set multiple values
