# Architecture Documentation

## Project Structure

```
DiceGameTest/
├── index.html          # Main game file
├── styles.css          # All styling
├── game.js            # Core game logic
├── README.md          # User documentation
└── ARCHITECTURE.md    # This file
```

## Technical Stack

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling, animations, responsive layout
- **Vanilla JavaScript**: All game logic (no frameworks)
- **LocalStorage**: Save game state (optional feature)

## Core Systems

### 1. Game State Management

```javascript
GameState = {
  players: [],           // Array of player objects
  currentPlayer: 0,      // Index of active player
  gamePhase: string,     // 'setup', 'playing', 'combat', 'shop', 'gameOver', 'pvp'
  level: number,         // Current difficulty level
  bossesDefeated: 0,     // Progress toward final battle
  board: []              // 32 tile objects in loop
}
```

### 2. Player Object

```javascript
Player = {
  id: number,
  name: string,
  position: number,      // 0-39 on board
  loops: number,         // Completed loops count
  stats: {
    hp: number,
    maxHp: number,
    sp: number,
    maxSp: number,
    atk: number,
    def: number,
    luk: number,
    money: number
  },
  inventory: [],         // Array of Item objects
  equippedWeapon: Item,
  equippedArmor: Item,
  equippedRings: [],     // Max 2-3 rings
  skills: [],            // Array of Skill objects
  passiveBuffs: []       // Active passive effects
}
```

### 3. Tile System

```javascript
Tile = {
  id: number,            // 0-39
  type: string,          // 'shop', 'combat', 'treasure', 'skillTrainer', 'empty'
  emoji: string,         // Visual representation
  level: number,         // Difficulty/reward scaling
  onLand: function()     // Trigger when player lands
}
```

**Tile Distribution** (32 tiles):
- Shop: 4 tiles
- Combat: 12 tiles
- Treasure: 6 tiles
- Skill Trainer: 4 tiles
- Empty: 6 tiles

### 4. Item System

```javascript
Item = {
  id: number,
  name: string,
  type: string,          // 'weapon', 'armor', 'potion', 'ring'
  emoji: string,
  stats: {               // Stat modifiers
    atk: number,
    def: number,
    hp: number
  },
  special: {             // For rings
    effect: string,      // 'crit', 'freeze', 'regen', 'lifesteal'
    value: number,
    duration: number     // For temporary effects
  },
  price: number,
  sellValue: number
}
```

### 5. Skill System

```javascript
Skill = {
  id: number,
  name: string,
  type: string,          // 'passive' or 'active'
  category: string,      // 'melee', 'ranged', 'aoe' (for active)
  emoji: string,
  spCost: number,        // For active skills
  effect: {
    damage: number,      // Base damage multiplier
    targets: number,     // 1 for single, >1 for AOE
    range: string,       // 'melee', 'ranged'
    buff: object         // For passive skills
  },
  level: number,         // Skill level
  upgradeCost: number
}
```

### 6. Combat System

**Combat Flow:**
1. Initialize combat (player vs NPC or player vs player)
2. Calculate turn order (based on speed/luck)
3. Auto-execute turns:
   - Calculate damage: `(ATK - DEF) * modifiers * random(0.8-1.2)`
   - Apply ring effects (crit, freeze, etc.)
   - Apply active skills if SP available
   - Update HP
4. Check win/lose conditions
5. Distribute rewards or handle defeat

**NPC Scaling:**
```javascript
NPC stats = baseStats * (1 + level * 0.3) * loopMultiplier
```

### 7. Boss Fight System

- Triggered after 5 completed loops
- Boss has significantly higher stats than regular NPCs
- Special mechanics (multi-phase, special attacks, etc.)
- Larger rewards on victory
- Defeating 3 bosses unlocks final PvP

### 8. PvP System

**Same-Tile Encounters:**
- Triggered when 2+ players land on same tile
- Winner takes: random item OR 30% of loser's money
- Combat uses same system as NPC fights

**Final Battle:**
- All remaining players fight
- Last player standing wins the game
- Can only trigger after 3 bosses defeated

### 9. Death & Persistence

**On Player Death:**
1. Select 1 random item from inventory
2. Reset player stats to base values
3. Clear other items and skills
4. Keep the selected item
5. Restart at position 0

## UI Components

### Main Layout
```
┌─────────────────────────────────────┐
│         Game Board (32 tiles)       │
│                                     │
├─────────────────┬───────────────────┤
│  Player Stats   │   Current Action  │
│  - HP/SP bars   │   - Dice roll     │
│  - ATK/DEF/LUK  │   - Combat log    │
│  - Money        │   - Event text    │
├─────────────────┼───────────────────┤
│   Inventory     │     Skills        │
│  (emoji grid)   │  (emoji list)     │
└─────────────────┴───────────────────┘
```

### Emoji Guide
- **Dice**: 🎲
- **Player**: 🧙 🧙‍♀️ 👤
- **Shop**: 🏪
- **Combat**: ⚔️
- **Treasure**: 💎
- **Skill**: ⭐
- **Empty**: 🪙
- **Boss**: 👹 🐉
- **Weapon**: ⚔️ 🗡️ 🏹
- **Armor**: 🛡️ 👕
- **Potion**: 🧪
- **Ring**: 💍
- **Coin**: 🪙 💰

## Event System

```javascript
EventBus = {
  emit(event, data),     // Trigger event
  on(event, callback),   // Subscribe to event
  off(event, callback)   // Unsubscribe
}
```

**Key Events:**
- `dice:rolled`
- `player:moved`
- `tile:landed`
- `combat:started`
- `combat:ended`
- `item:acquired`
- `skill:learned`
- `boss:defeated`
- `game:over`

## Development Phases

### Phase 1: Core Engine (Current)
- Game state management
- Basic UI structure
- Board rendering

### Phase 2: Movement & Tiles
- Dice rolling
- Player movement
- Tile landing logic

### Phase 3: Stats & Items
- Player stats system
- Item system
- Inventory management

### Phase 4: Combat
- Automatic combat system
- NPC encounters
- Damage calculations

### Phase 5: Skills & Buffs
- Skill system
- Passive/active mechanics
- Ring effects

### Phase 6: Boss & PvP
- Boss fights
- PvP encounters
- Final battle

### Phase 7: Polish
- Animations
- Sound effects (optional)
- Balance tuning
- Game over/restart flow

## Performance Considerations

- Single page, no routing needed
- Minimal DOM manipulation (update only changed elements)
- Event delegation for click handlers
- LocalStorage for persistence (max ~5MB should be plenty)

## Future Enhancements

- Multiplayer over network (WebSockets)
- More item types and rarities
- Skill trees and specializations
- Different board layouts per level
- Animation improvements
- Sound effects and music
- Save/load multiple game slots
