# Dice Board Game Demo

A monopoly-style board game where players roll dice, collect items, upgrade skills, and fight NPCs and other players.

## Game Overview

- **Board**: 32 tiles in a perfect loop (9 on top/bottom, 7 on sides)
- **Objective**: Defeat 3 bosses and win the final PvP battle
- **Combat**: Automatic turn-based combat
- **Progression**: Collect items, upgrade stats, learn skills

## How to Play

1. Roll dice to move around the board
2. Land on different tiles to gain rewards, fight enemies, or shop
3. Upgrade your character with items and skills
4. Complete 5 loops to trigger a boss fight
5. Defeat 3 bosses to unlock the final PvP battle
6. If you lose, restart with 1 random item from your previous run

## Testing Instructions

**Simple Method (Recommended):**
1. Navigate to the project folder
2. Double-click `index.html` to open in your browser
3. The game will run locally - no server needed!

**Alternative Method (with live server):**
```bash
# If you have Python installed
cd D:\Files\Desktop\Claude\Projects\DiceGameTest
python -m http.server 8000
# Then visit http://localhost:8000
```

Or use any local development server (VS Code Live Server, etc.)

## Game Mechanics

### Stats
- **HP**: Health points
- **SP**: Skill points (for using active skills)
- **ATK**: Attack power
- **DEF**: Defense
- **LUK**: Luck (affects crits, drops, etc.)
- **Money**: Currency for buying items

### Tile Types
- 🏪 **Shop**: Buy weapons, armor, potions, rings
- ⚔️ **Combat**: Fight NPCs (difficulty increases each level)
- 💎 **Treasure**: Random rewards
- ⭐ **Skill Trainer**: Learn or upgrade skills
- 🪙 **Empty**: Small coin reward

### Items
- **Weapons**: Increase ATK
- **Armor**: Increase DEF
- **Potions**: Restore HP/SP
- **Rings**: Special effects (critical hits, freeze enemy, HP regen, etc.)

### Skills
- **Passive**: Always-on buffs
- **Active**: Melee, ranged, and AOE attacks

### Combat
- Automatic turn-based
- NPCs get stronger with each level
- Victory rewards: coins, items, experience

### PvP
- **Small fights**: Triggered when players land on the same tile (winner takes item/money)
- **Final battle**: After defeating 3 bosses

## Development Progress

See `ARCHITECTURE.md` for technical details.

## Controls

- Click "Roll Dice" button to roll and move
- Click items/skills to use or equip them
- Combat happens automatically
- Shop/inventory UI appears when relevant

## Browser Requirements

- Modern browser (Chrome, Firefox, Edge, Safari)
- JavaScript enabled
- No internet connection required
