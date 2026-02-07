# Toggle Test Mode

Modify the TEST_MODE config in v1/game.js to enable/disable test mode and set tile types.

## Location
File: `v1/game.js`
Config at top of file:
```js
const TEST_MODE = {
    enabled: true,              // Set to false for normal gameplay
    tileTypes: ['shop', 'combat'] // Only these tile types in test mode
};
```

## Available Tile Types
- `shop` - Buy equipment
- `combat` - Fight enemies
- `treasure` - Random rewards
- `skillTrainer` - Learn skills (placeholder)
- `empty` - Get coins

## Usage Examples
- `/test-mode off` - Disable test mode, use normal board
- `/test-mode shop combat` - Only shop and combat tiles
- `/test-mode combat` - Only combat tiles
- `/test-mode shop treasure` - Only shop and treasure
