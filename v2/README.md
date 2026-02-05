# Dice Board Game V2 - Type System Edition 🔥💧🌿

## What's New in V2?

V2 introduces a **Pokemon-style type system** with multiple characters!

### Major Changes

#### 1. **Three Characters Instead of One**
- Players now have **3 characters** instead of a single player
  - 🔥 **Blaze** (Fire Type)
  - 💧 **Aqua** (Water Type)
  - 🌿 **Flora** (Grass Type)
- Each character has independent HP, SP, ATK, and DEF stats
- Characters can faint individually

#### 2. **Type Effectiveness System**
Type advantages work like Pokemon:
- 🔥 **Fire** beats 🌿 Grass (1.5x damage)
- 🌿 **Grass** beats 💧 Water (1.5x damage)
- 💧 **Water** beats 🔥 Fire (1.5x damage)

Reverse matchups deal reduced damage (0.67x)

#### 3. **Character Selection Before Combat**
- Before each battle, choose which character to use
- **You cannot see the enemy type beforehand!**
- Cannot switch characters during combat
- Strategic decision-making is key

#### 4. **NPCs Have Types Too**
- All enemies now have one of the three types
- Enemy type is displayed during combat
- Type matchups apply to both player and enemy attacks

#### 5. **Updated Combat System**
- Combat log shows type effectiveness
  - "Super Effective!" for 1.5x damage
  - "Not very effective..." for 0.67x damage
- Character names and type emojis displayed during battle
- Characters show "Fainted" status when HP reaches 0

#### 6. **Team Management**
- Sidebar shows all 3 characters with their:
  - Current HP
  - Type
  - Fainted status
- Potions now heal ALL characters
- Game Over occurs when all 3 characters faint

## How to Play V2

1. Open `index-v2.html` in your browser
2. Roll dice to move around the board
3. When you land on a combat tile:
   - **Choose your character** from the 3 options
   - Consider type advantages (but you won't know enemy type yet!)
   - Fight automatically begins
4. Win battles, collect items, and upgrade your team
5. If a character faints, you can still continue with remaining characters
6. Game Over when all 3 characters faint

## Files

- `index-v2.html` - V2 game HTML
- `game-v2.js` - V2 game logic with type system
- `styles-v2.css` - V2 styles

## Tips

- 💡 Diversify your team - having all types gives you options
- 💡 Watch your characters' HP - heal before it's too late
- 💡 Type advantage can turn the tide of battle
- 💡 Potions heal all characters, use them wisely

## Comparison: V1 vs V2

| Feature | V1 | V2 |
|---------|----|----|
| Characters | 1 player | 3 characters (Fire/Water/Grass) |
| Combat | Direct damage | Type effectiveness system |
| Character Selection | N/A | Choose before each battle |
| NPC Types | None | Fire/Water/Grass types |
| Game Over | Player HP = 0 | All characters faint |
| Potions | Heal player | Heal all characters |

Enjoy the new strategic depth of V2! 🎮✨
