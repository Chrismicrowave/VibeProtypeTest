// ========================================
// GAME STATE & CONSTANTS
// ========================================

const TILE_TYPES = {
    SHOP: 'shop',
    COMBAT: 'combat',
    TREASURE: 'treasure',
    SKILL_TRAINER: 'skillTrainer',
    EMPTY: 'empty'
};

const TILE_EMOJIS = {
    shop: '🏪',
    combat: '⚔️',
    treasure: '💎',
    skillTrainer: '⭐',
    empty: '🪙'
};

// ========================================
// CHARACTER TYPES SYSTEM
// ========================================

const CHAR_TYPES = {
    FIRE: 'fire',
    WATER: 'water',
    GRASS: 'grass'
};

const TYPE_EMOJIS = {
    fire: '🔥',
    water: '💧',
    grass: '🌿'
};

const TYPE_NAMES = {
    fire: 'Fire',
    water: 'Water',
    grass: 'Grass'
};

// Type effectiveness: returns multiplier for attacker vs defender
function getTypeEffectiveness(attackerType, defenderType) {
    if (attackerType === defenderType) return 1.0;

    // Fire > Grass > Water > Fire
    if (attackerType === CHAR_TYPES.FIRE && defenderType === CHAR_TYPES.GRASS) return 1.5;
    if (attackerType === CHAR_TYPES.GRASS && defenderType === CHAR_TYPES.WATER) return 1.5;
    if (attackerType === CHAR_TYPES.WATER && defenderType === CHAR_TYPES.FIRE) return 1.5;

    // Weak against
    if (attackerType === CHAR_TYPES.FIRE && defenderType === CHAR_TYPES.WATER) return 0.67;
    if (attackerType === CHAR_TYPES.WATER && defenderType === CHAR_TYPES.GRASS) return 0.67;
    if (attackerType === CHAR_TYPES.GRASS && defenderType === CHAR_TYPES.FIRE) return 0.67;

    return 1.0;
}

const gameState = {
    player: null,
    board: [],
    level: 1,
    bossesDefeated: 0,
    currentPhase: 'playing', // 'playing', 'combat', 'shop', 'gameOver', 'boss', 'charSelect'
    isRolling: false,
    currentEnemy: null, // Store current enemy for combat
    shopItems: [], // Store current shop items
    selectedCharacter: null // Currently selected character for battle
};

// ========================================
// CHARACTER CLASS
// ========================================

class Character {
    constructor(type, name) {
        this.type = type;
        this.name = name;
        this.emoji = TYPE_EMOJIS[type];
        this.stats = {
            hp: 100,
            maxHp: 100,
            sp: 50,
            maxSp: 50,
            atk: 25,
            def: 8
        };
        this.isAlive = true;
    }

    takeDamage(amount) {
        const actualDamage = Math.max(1, amount);
        this.stats.hp = Math.max(0, this.stats.hp - actualDamage);
        if (this.stats.hp <= 0) {
            this.isAlive = false;
        }
        return actualDamage;
    }

    heal(amount) {
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
        if (this.stats.hp > 0) {
            this.isAlive = true;
        }
    }

    getDisplayName() {
        return `${this.emoji} ${this.name}`;
    }
}

// ========================================
// PLAYER CLASS
// ========================================

class Player {
    constructor() {
        this.position = 0;
        this.loops = 0;

        // Player now has 3 characters
        this.characters = [
            new Character(CHAR_TYPES.FIRE, 'Blaze'),
            new Character(CHAR_TYPES.WATER, 'Aqua'),
            new Character(CHAR_TYPES.GRASS, 'Flora')
        ];

        this.money = 100;
        this.luk = 5;
        this.inventory = [];
        this.equippedWeapon = null;
        this.equippedArmor = null;
        this.equippedRings = [];
        this.skills = [];
        this.passiveBuffs = [];
        this.persistedItem = null;
    }

    getAliveCharacters() {
        return this.characters.filter(c => c.isAlive);
    }

    hasAliveCharacters() {
        return this.getAliveCharacters().length > 0;
    }

    move(steps) {
        const oldPosition = this.position;
        this.position = (this.position + steps) % 32;

        // Check if completed a loop
        if (oldPosition + steps >= 32) {
            this.loops++;
            this.gainMoney(50); // Bonus for completing loop
            logEvent(`🎉 Loop completed! Bonus +50 coins. (${this.loops}/5)`);

            // Check for boss fight
            if (this.loops >= 5) {
                this.loops = 0;
                setTimeout(() => startBossFight(), 1000);
            }
        }

        return this.position;
    }

    gainMoney(amount) {
        this.money += amount;
        updateUI();
    }

    spendMoney(amount) {
        if (this.money >= amount) {
            this.money -= amount;
            updateUI();
            return true;
        }
        return false;
    }

    healAllCharacters(amount) {
        this.characters.forEach(char => {
            if (char.isAlive) {
                char.heal(amount);
            }
        });
        updateUI();
    }

    addItem(item) {
        this.inventory.push(item);
        updateInventoryUI();
    }

    // Get stats for a specific character (or average for UI display)
    getTotalAtk(character = null) {
        const char = character || this.characters[0]; // Default to first character
        let atk = char.stats.atk;
        if (this.equippedWeapon) atk += this.equippedWeapon.stats.atk || 0;
        return atk;
    }

    getTotalDef(character = null) {
        const char = character || this.characters[0];
        let def = char.stats.def;
        if (this.equippedArmor) def += this.equippedArmor.stats.def || 0;
        return def;
    }

    getAverageHP() {
        const aliveChars = this.getAliveCharacters();
        if (aliveChars.length === 0) return { current: 0, max: 0 };
        const totalHp = aliveChars.reduce((sum, char) => sum + char.stats.hp, 0);
        const totalMaxHp = aliveChars.reduce((sum, char) => sum + char.stats.maxHp, 0);
        return { current: Math.floor(totalHp / aliveChars.length), max: Math.floor(totalMaxHp / aliveChars.length) };
    }
}

// ========================================
// ITEM SYSTEM
// ========================================

class Item {
    constructor(type, name, emoji, stats, special = null, price = 0) {
        this.id = Date.now() + Math.random();
        this.type = type; // 'weapon', 'armor', 'potion', 'ring'
        this.name = name;
        this.emoji = emoji;
        this.stats = stats;
        this.special = special;
        this.price = price;
        this.sellValue = Math.floor(price * 0.6);
    }
}

const ITEM_TEMPLATES = {
    weapons: [
        { name: 'Iron Sword', emoji: '🗡️', stats: { atk: 5 }, price: 50 },
        { name: 'Steel Sword', emoji: '⚔️', stats: { atk: 10 }, price: 100 },
        { name: 'Magic Staff', emoji: '🪄', stats: { atk: 8 }, price: 90 },
        { name: 'Bow', emoji: '🏹', stats: { atk: 7 }, price: 80 },
    ],
    armor: [
        { name: 'Leather Armor', emoji: '🦺', stats: { def: 5 }, price: 50 },
        { name: 'Chain Mail', emoji: '🛡️', stats: { def: 10 }, price: 100 },
        { name: 'Plate Armor', emoji: '🛡️', stats: { def: 15 }, price: 150 },
    ],
    potions: [
        { name: 'Health Potion', emoji: '🧪', stats: { hp: 30 }, price: 30 },
        { name: 'Greater Health Potion', emoji: '🧪', stats: { hp: 60 }, price: 60 },
        { name: 'Mana Potion', emoji: '💙', stats: { sp: 20 }, price: 25 },
    ],
    rings: [
        { name: 'Ring of Strength', emoji: '💍', stats: { atk: 3 }, price: 80 },
        { name: 'Ring of Defense', emoji: '💍', stats: { def: 3 }, price: 80 },
        { name: 'Lucky Ring', emoji: '💍', stats: { luk: 5 }, price: 100 },
        { name: 'Vampire Ring', emoji: '💍', stats: {}, special: { effect: 'lifesteal', value: 0.2 }, price: 120 },
    ]
};

function createRandomItem(category, levelScale = 1) {
    const templates = ITEM_TEMPLATES[category];
    const template = templates[Math.floor(Math.random() * templates.length)];

    const scaledStats = {};
    for (let stat in template.stats) {
        scaledStats[stat] = Math.floor(template.stats[stat] * levelScale);
    }

    return new Item(
        category.slice(0, -1), // Remove 's' from category name
        template.name,
        template.emoji,
        scaledStats,
        template.special,
        Math.floor(template.price * levelScale)
    );
}

// ========================================
// BOARD GENERATION
// ========================================

function generateBoard() {
    const board = [];
    const distribution = {
        shop: 4,
        combat: 12,
        treasure: 6,
        skillTrainer: 4,
        empty: 6
    };

    // Create array of tile types
    const tileTypes = [];
    for (let type in distribution) {
        for (let i = 0; i < distribution[type]; i++) {
            tileTypes.push(type);
        }
    }

    // Shuffle
    for (let i = tileTypes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tileTypes[i], tileTypes[j]] = [tileTypes[j], tileTypes[i]];
    }

    // Create tiles (32 tiles for perfect loop)
    for (let i = 0; i < 32; i++) {
        board.push({
            id: i,
            type: tileTypes[i],
            emoji: TILE_EMOJIS[tileTypes[i]]
        });
    }

    return board;
}

// ========================================
// UI FUNCTIONS
// ========================================

function renderBoard() {
    const boardElement = document.getElementById('game-board');
    boardElement.innerHTML = '';

    // Add center action panel
    const centerPanel = document.createElement('div');
    centerPanel.id = 'board-center';
    centerPanel.style.gridRow = '2 / 9';
    centerPanel.style.gridColumn = '2 / 9';
    centerPanel.style.display = 'flex';
    centerPanel.style.flexDirection = 'column';
    centerPanel.style.alignItems = 'center';
    centerPanel.style.justifyContent = 'center';
    centerPanel.style.padding = '20px';
    centerPanel.style.background = 'rgba(255, 255, 255, 0.95)';
    centerPanel.style.borderRadius = '15px';
    centerPanel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    centerPanel.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 15px;">
            <div id="center-dice-number" style="font-size: 4em; font-weight: bold; color: #667eea; text-shadow: 0 2px 4px rgba(0,0,0,0.3); min-height: 1.2em; display: flex; align-items: center; justify-content: center;"></div>
            <div id="center-dice" style="font-size: 4em; margin-top: -10px;">🎲</div>
        </div>
        <button id="center-roll-btn" class="action-btn" style="width: 100%; max-width: 200px; margin-bottom: 15px;">🎲 Roll Dice</button>
        <div id="center-event-log" style="background: #f8f9fa; padding: 10px; border-radius: 8px; width: 100%; max-height: 150px; overflow-y: auto; font-size: 0.85em;">
            <p>Welcome! Click Roll Dice to start.</p>
        </div>
    `;
    boardElement.appendChild(centerPanel);

    gameState.board.forEach((tile, index) => {
        const tileDiv = document.createElement('div');
        tileDiv.className = `tile ${tile.type}`;
        tileDiv.dataset.tileId = index;

        // Calculate grid position for loop layout
        // 32 tiles: 9 on top/bottom, 7 on left/right sides
        const gridPos = getTileGridPosition(index);
        tileDiv.style.gridRow = gridPos.row;
        tileDiv.style.gridColumn = gridPos.col;

        const numberSpan = document.createElement('span');
        numberSpan.className = 'tile-number';
        numberSpan.textContent = index;

        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'tile-emoji';
        emojiSpan.textContent = tile.emoji;

        tileDiv.appendChild(numberSpan);
        tileDiv.appendChild(emojiSpan);

        // Show player on current tile
        if (gameState.player && gameState.player.position === index) {
            const playerMarker = document.createElement('span');
            playerMarker.className = 'player-marker';
            playerMarker.textContent = '🤺';
            tileDiv.appendChild(playerMarker);
            tileDiv.classList.add('active');
        }

        boardElement.appendChild(tileDiv);
    });
}

function getTileGridPosition(tileIndex) {
    // 32 tiles arranged in a perfect loop around 9x9 grid
    // Top row: tiles 0-8 (9 tiles)
    if (tileIndex >= 0 && tileIndex <= 8) {
        return { row: 1, col: tileIndex + 1 };
    }
    // Right column: tiles 9-15 (7 tiles, excluding corners)
    if (tileIndex >= 9 && tileIndex <= 15) {
        return { row: (tileIndex - 9) + 2, col: 9 };
    }
    // Bottom row: tiles 16-24 (9 tiles, right to left)
    if (tileIndex >= 16 && tileIndex <= 24) {
        return { row: 9, col: 9 - (tileIndex - 16) };
    }
    // Left column: tiles 25-31 (7 tiles, bottom to top, excluding corners)
    if (tileIndex >= 25 && tileIndex <= 31) {
        return { row: 8 - (tileIndex - 25), col: 1 };
    }
    return { row: 1, col: 1 };
}

function updateUI() {
    if (!gameState.player) return;

    const p = gameState.player;

    // Update average HP from all characters
    const avgHp = p.getAverageHP();
    document.getElementById('hp-bar').style.width = `${avgHp.max > 0 ? (avgHp.current / avgHp.max) * 100 : 0}%`;
    document.getElementById('hp-text').textContent = `${avgHp.current}/${avgHp.max} (Avg)`;

    // SP bar - use first alive character or 0
    const firstChar = p.getAliveCharacters()[0];
    if (firstChar) {
        document.getElementById('sp-bar').style.width = `${(firstChar.stats.sp / firstChar.stats.maxSp) * 100}%`;
        document.getElementById('sp-text').textContent = `${firstChar.stats.sp}/${firstChar.stats.maxSp}`;
    } else {
        document.getElementById('sp-bar').style.width = '0%';
        document.getElementById('sp-text').textContent = '0/0';
    }

    document.getElementById('atk-value').textContent = p.getTotalAtk();
    document.getElementById('def-value').textContent = p.getTotalDef();
    document.getElementById('luk-value').textContent = p.luk;
    document.getElementById('money-value').textContent = p.money;

    // Update game info
    document.getElementById('level-display').textContent = gameState.level;
    document.getElementById('bosses-display').textContent = `${gameState.bossesDefeated}/3`;
    document.getElementById('loop-display').textContent = `${p.loops}/5`;

    // Update character team display
    updateCharacterTeamUI();
}

function updateCharacterTeamUI() {
    const teamDiv = document.getElementById('team-characters');
    if (!teamDiv) return;

    teamDiv.innerHTML = '';

    gameState.player.characters.forEach((char, idx) => {
        const charCard = document.createElement('div');
        charCard.style.cssText = `
            flex: 1;
            background: ${char.isAlive ? '#f8f9fa' : '#e0e0e0'};
            border: 2px solid ${char.isAlive ? '#667eea' : '#999'};
            border-radius: 8px;
            padding: 8px;
            text-align: center;
            font-size: 0.85em;
            opacity: ${char.isAlive ? '1' : '0.6'};
        `;

        charCard.innerHTML = `
            <div style="font-size: 2em; margin-bottom: 3px;">${char.emoji}</div>
            <div style="font-weight: bold; font-size: 0.9em;">${char.name}</div>
            <div style="color: #666; font-size: 0.8em; margin-bottom: 3px;">${TYPE_NAMES[char.type]}</div>
            <div style="font-size: 0.8em;">${char.stats.hp}/${char.stats.maxHp} HP</div>
            ${!char.isAlive ? '<div style="color: #e74c3c; font-weight: bold; font-size: 0.8em;">Fainted</div>' : ''}
        `;

        teamDiv.appendChild(charCard);
    });
}

function updateInventoryUI() {
    const inventoryDiv = document.getElementById('inventory-items');
    inventoryDiv.innerHTML = '';

    if (gameState.player.inventory.length === 0) {
        inventoryDiv.innerHTML = '<p class="empty-text">No items</p>';
        return;
    }

    gameState.player.inventory.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = `item ${item.type}`;
        itemDiv.textContent = item.emoji;
        itemDiv.title = `${item.name}\n${JSON.stringify(item.stats)}`;
        itemDiv.onclick = () => useItem(index);
        inventoryDiv.appendChild(itemDiv);
    });

    // Update equipped items
    document.getElementById('equipped-weapon').textContent =
        gameState.player.equippedWeapon ? gameState.player.equippedWeapon.emoji : '-';
    document.getElementById('equipped-armor').textContent =
        gameState.player.equippedArmor ? gameState.player.equippedArmor.emoji : '-';
    document.getElementById('equipped-rings').textContent =
        gameState.player.equippedRings.length > 0 ?
        gameState.player.equippedRings.map(r => r.emoji).join(' ') : '-';
}

function logEvent(message) {
    // Log to center board log
    const centerLog = document.getElementById('center-event-log');
    if (centerLog) {
        const p = document.createElement('p');
        p.textContent = message;
        p.style.marginBottom = '5px';
        p.style.paddingLeft = '5px';
        p.style.borderLeft = '3px solid #667eea';
        centerLog.insertBefore(p, centerLog.firstChild);

        // Keep only last 8 messages
        while (centerLog.children.length > 8) {
            centerLog.removeChild(centerLog.lastChild);
        }
    }

    // Also log to side panel if it exists
    const logDiv = document.getElementById('event-log');
    if (logDiv) {
        const p = document.createElement('p');
        p.textContent = message;
        logDiv.insertBefore(p, logDiv.firstChild);

        // Keep only last 10 messages
        while (logDiv.children.length > 10) {
            logDiv.removeChild(logDiv.lastChild);
        }
    }
}

// ========================================
// GAME ACTIONS
// ========================================

function rollDice() {
    if (gameState.isRolling || gameState.currentPhase !== 'playing') return;

    gameState.isRolling = true;

    const rollBtn = document.getElementById('roll-dice-btn');
    if (rollBtn) rollBtn.disabled = true;

    const centerRollBtn = document.getElementById('center-roll-btn');
    if (centerRollBtn) centerRollBtn.disabled = true;

    const centerDice = document.getElementById('center-dice');
    const centerDiceNumber = document.getElementById('center-dice-number');

    // Animate dice roll
    let rolls = 0;
    const rollInterval = setInterval(() => {
        const tempRoll = Math.floor(Math.random() * 6) + 1;
        centerDice.textContent = '🎲';
        if (centerDiceNumber) centerDiceNumber.textContent = tempRoll;
        centerDice.style.transform = `rotate(${rolls * 36}deg) scale(${1 + Math.sin(rolls) * 0.2})`;
        rolls++;

        if (rolls >= 15) {
            clearInterval(rollInterval);
            const finalRoll = Math.floor(Math.random() * 6) + 1;
            centerDice.textContent = '🎲';
            if (centerDiceNumber) {
                centerDiceNumber.textContent = finalRoll;
                centerDiceNumber.style.fontSize = '5em';
            }
            centerDice.style.transform = 'rotate(0deg) scale(1.2)';

            const diceResult = document.getElementById('dice-result');
            if (diceResult) diceResult.textContent = '🎲 ' + finalRoll;

            logEvent(`Rolled a ${finalRoll}!`);

            setTimeout(() => {
                centerDice.style.transform = 'rotate(0deg) scale(1)';
                if (centerDiceNumber) {
                    centerDiceNumber.textContent = '';
                    centerDiceNumber.style.fontSize = '4em';
                }
                movePlayer(finalRoll);
            }, 800);
        }
    }, 80);
}

function movePlayer(steps) {
    let currentStep = 0;
    const startPosition = gameState.player.position;

    // Animate step by step
    const moveInterval = setInterval(() => {
        if (currentStep < steps) {
            currentStep++;
            gameState.player.position = (startPosition + currentStep) % 32;
            renderBoard();

            // Re-attach event listener to center button after re-render
            const centerRollBtn = document.getElementById('center-roll-btn');
            if (centerRollBtn) {
                centerRollBtn.replaceWith(centerRollBtn.cloneNode(true));
                document.getElementById('center-roll-btn').addEventListener('click', rollDice);
            }
        } else {
            clearInterval(moveInterval);

            // Check if completed a loop
            if (startPosition + steps >= 32) {
                gameState.player.loops++;
                gameState.player.gainMoney(50);
                logEvent(`🎉 Loop completed! Bonus +50 coins. (${gameState.player.loops}/5)`);

                // Check for boss fight
                if (gameState.player.loops >= 5) {
                    gameState.player.loops = 0;
                    setTimeout(() => startBossFight(), 1000);
                }
            }

            const tile = gameState.board[gameState.player.position];
            logEvent(`Landed on ${tile.emoji} ${tile.type} tile!`);

            // Reset center display
            const centerDice = document.getElementById('center-dice');
            if (centerDice) {
                centerDice.textContent = '🎲';
                centerDice.style.transform = 'scale(1)';
            }

            setTimeout(() => {
                handleTileLanding(tile);
                gameState.isRolling = false;

                const rollBtn = document.getElementById('roll-dice-btn');
                if (rollBtn) rollBtn.disabled = false;

                const centerRollBtn = document.getElementById('center-roll-btn');
                if (centerRollBtn) centerRollBtn.disabled = false;
            }, 300);
        }
    }, 300);
}

function handleTileLanding(tile) {
    switch(tile.type) {
        case TILE_TYPES.SHOP:
            openShop();
            break;
        case TILE_TYPES.COMBAT:
            startCombat();
            break;
        case TILE_TYPES.TREASURE:
            openTreasure();
            break;
        case TILE_TYPES.SKILL_TRAINER:
            openSkillTrainer();
            break;
        case TILE_TYPES.EMPTY:
            const coins = Math.floor(Math.random() * 20) + 10;
            gameState.player.gainMoney(coins);
            logEvent(`Found ${coins} coins! 💰`);
            break;
    }
}

// ========================================
// COMBAT SYSTEM
// ========================================

function startCombat() {
    gameState.currentPhase = 'charSelect';
    gameState.currentEnemy = generateEnemy();

    // Show character selection first
    showCharacterSelection();
}

function showCharacterSelection() {
    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    const aliveChars = gameState.player.getAliveCharacters();

    let charsHTML = aliveChars.map((char, idx) => `
        <div class="char-select-card" onclick="selectCharacterForBattle(${gameState.player.characters.indexOf(char)})" style="display: inline-block; margin: 15px; padding: 20px; border: 3px solid #667eea; border-radius: 12px; cursor: pointer; text-align: center; min-width: 150px; transition: all 0.3s;">
            <div style="font-size: 4em; margin-bottom: 10px;">${char.emoji}</div>
            <div style="font-weight: bold; font-size: 1.2em; margin-bottom: 5px;">${char.name}</div>
            <div style="color: #666; margin-bottom: 10px;">${TYPE_NAMES[char.type]} Type</div>
            <div style="background: #f8f9fa; padding: 8px; border-radius: 6px; margin-bottom: 5px;">
                <div style="margin-bottom: 3px;">HP: ${char.stats.hp}/${char.stats.maxHp}</div>
                <div>ATK: ${char.stats.atk} | DEF: ${char.stats.def}</div>
            </div>
        </div>
    `).join('');

    content.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 20px;">⚔️ Choose Your Character! ⚔️</h2>
        <p style="text-align: center; color: #666; margin-bottom: 20px;">
            You're about to fight a ${gameState.currentEnemy.name}! Pick your character wisely.
        </p>
        <div style="text-align: center;">
            ${charsHTML}
        </div>
        <p style="text-align: center; margin-top: 20px; font-size: 0.9em; color: #999;">
            💡 Tip: ${TYPE_EMOJIS[CHAR_TYPES.FIRE]} Fire beats ${TYPE_EMOJIS[CHAR_TYPES.GRASS]} Grass |
            ${TYPE_EMOJIS[CHAR_TYPES.GRASS]} Grass beats ${TYPE_EMOJIS[CHAR_TYPES.WATER]} Water |
            ${TYPE_EMOJIS[CHAR_TYPES.WATER]} Water beats ${TYPE_EMOJIS[CHAR_TYPES.FIRE]} Fire
        </p>
    `;

    modal.classList.remove('hidden');
}

function selectCharacterForBattle(charIndex) {
    const selectedChar = gameState.player.characters[charIndex];

    if (!selectedChar.isAlive) {
        alert('This character has fainted!');
        return;
    }

    gameState.selectedCharacter = selectedChar;
    gameState.currentPhase = 'combat';

    logEvent(`⚔️ ${selectedChar.name} ${selectedChar.emoji} is ready to fight!`);

    // Show combat modal
    showCombatModal(gameState.currentEnemy);
}

function generateEnemy() {
    const enemyTypes = [
        { name: 'Goblin', emoji: '👺', hpMult: 1, atkMult: 1 },
        { name: 'Orc', emoji: '👹', hpMult: 1.3, atkMult: 1.2 },
        { name: 'Skeleton', emoji: '💀', hpMult: 0.8, atkMult: 1.4 },
        { name: 'Slime', emoji: '🟢', hpMult: 1.5, atkMult: 0.7 },
    ];

    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const levelScale = 1 + (gameState.level - 1) * 0.3;

    // Random character type for enemy
    const charTypes = [CHAR_TYPES.FIRE, CHAR_TYPES.WATER, CHAR_TYPES.GRASS];
    const charType = charTypes[Math.floor(Math.random() * charTypes.length)];

    return {
        name: type.name,
        emoji: type.emoji,
        charType: charType,
        typeEmoji: TYPE_EMOJIS[charType],
        hp: Math.floor(60 * type.hpMult * levelScale),
        maxHp: Math.floor(60 * type.hpMult * levelScale),
        atk: Math.floor(20 * type.atkMult * levelScale),
        def: Math.floor(5 * levelScale)
    };
}

function showCombatModal(enemy) {
    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    const playerChar = gameState.selectedCharacter;

    // Calculate type effectiveness
    const effectiveness = getTypeEffectiveness(playerChar.type, enemy.charType);
    let matchupText = '';
    if (effectiveness > 1) matchupText = '💪 Super Effective!';
    else if (effectiveness < 1) matchupText = '😰 Not Very Effective...';
    else matchupText = '⚔️ Normal Damage';

    content.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 10px;">⚔️ BATTLE START! ⚔️</h2>
        <p style="text-align: center; color: #667eea; font-weight: bold; margin-bottom: 20px;">
            ${playerChar.emoji} ${playerChar.name} VS ${enemy.typeEmoji} ${enemy.emoji} ${enemy.name}<br>
            <span style="font-size: 0.9em;">${matchupText}</span>
        </p>

        <div class="combat-arena">
            <!-- Player Side -->
            <div class="combatant combatant-left" id="player-combatant">
                <div class="combatant-name">${playerChar.emoji} ${playerChar.name}</div>
                <div class="combatant-emoji">${playerChar.emoji}</div>
                <div style="font-size: 0.8em; color: #666; margin-bottom: 5px;">${TYPE_NAMES[playerChar.type]} Type</div>
                <div class="combatant-hp-container">
                    <div style="position: relative;">
                        <div id="combat-player-hp-bar" class="combatant-hp-bar" style="width: ${(playerChar.stats.hp / playerChar.stats.maxHp) * 100}%"></div>
                        <span id="combat-player-hp-text" class="combatant-hp-text">${playerChar.stats.hp}/${playerChar.stats.maxHp}</span>
                    </div>
                </div>
            </div>

            <!-- Enemy Side -->
            <div class="combatant combatant-right" id="enemy-combatant">
                <div class="combatant-name">${enemy.typeEmoji} ${enemy.name}</div>
                <div class="combatant-emoji">${enemy.emoji}</div>
                <div style="font-size: 0.8em; color: #666; margin-bottom: 5px;">${TYPE_NAMES[enemy.charType]} Type</div>
                <div class="combatant-hp-container">
                    <div style="position: relative;">
                        <div id="enemy-hp-bar" class="combatant-hp-bar" style="width: 100%"></div>
                        <span id="enemy-hp-text" class="combatant-hp-text">${enemy.hp}/${enemy.maxHp}</span>
                    </div>
                </div>
            </div>
        </div>

        <div id="combat-log" style="background: #f8f9fa; padding: 15px; border-radius: 8px; max-height: 150px; overflow-y: auto; margin: 20px 0; font-family: monospace;">
            <p style="text-align: center; color: #667eea; font-weight: bold;">⚔️ Combat begins! ⚔️</p>
        </div>
    `;

    modal.classList.remove('hidden');

    // Start combat automatically after a short delay
    setTimeout(() => {
        executeCombat();
    }, 500);
}

function executeCombat() {
    const enemy = gameState.currentEnemy;
    const playerChar = gameState.selectedCharacter;
    const combatLog = document.getElementById('combat-log');
    const playerCombatant = document.getElementById('player-combatant');
    const enemyCombatant = document.getElementById('enemy-combatant');

    function addLog(msg) {
        const p = document.createElement('p');
        p.textContent = msg;
        p.style.marginBottom = '5px';
        combatLog.appendChild(p);
        combatLog.scrollTop = combatLog.scrollHeight;
    }

    // Calculate type effectiveness
    const playerEffectiveness = getTypeEffectiveness(playerChar.type, enemy.charType);
    const enemyEffectiveness = getTypeEffectiveness(enemy.charType, playerChar.type);

    let turn = 0;
    const combatInterval = setInterval(() => {
        turn++;

        // Player turn - Attack animation
        playerCombatant.classList.add('attacking-left');
        setTimeout(() => {
            playerCombatant.classList.remove('attacking-left');
        }, 300);

        // Calculate player damage with type effectiveness
        const basePlayerDmg = Math.max(1, Math.floor(
            (gameState.player.getTotalAtk(playerChar) - enemy.def) * (0.8 + Math.random() * 0.4)
        ));
        const playerDmg = Math.floor(basePlayerDmg * playerEffectiveness);

        // Enemy hurt animation
        setTimeout(() => {
            enemyCombatant.classList.add('hurt');
            enemy.hp -= playerDmg;
            let effectMsg = playerEffectiveness > 1 ? ' (Super Effective!)' : playerEffectiveness < 1 ? ' (Not very effective...)' : '';
            addLog(`${playerChar.emoji} ${playerChar.name} dealt ${playerDmg} damage!${effectMsg}`);

            // Update enemy HP bar
            const enemyHpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
            document.getElementById('enemy-hp-bar').style.width = `${enemyHpPercent}%`;
            document.getElementById('enemy-hp-text').textContent = `${Math.max(0, enemy.hp)}/${enemy.maxHp}`;

            setTimeout(() => {
                enemyCombatant.classList.remove('hurt');
            }, 300);

            if (enemy.hp <= 0) {
                clearInterval(combatInterval);
                addLog(`🎉 Victory! You defeated ${enemy.name}!`);

                const reward = Math.floor((20 + Math.random() * 30) * gameState.level);
                gameState.player.gainMoney(reward);
                addLog(`💰 Gained ${reward} coins!`);

                // Random item drop
                if (Math.random() < 0.3) {
                    const itemType = ['weapons', 'armor', 'potions', 'rings'][Math.floor(Math.random() * 4)];
                    const item = createRandomItem(itemType, 1 + gameState.level * 0.2);
                    gameState.player.addItem(item);
                    addLog(`📦 Found ${item.emoji} ${item.name}!`);
                }

                setTimeout(() => {
                    closeModal();
                    gameState.currentPhase = 'playing';
                }, 1500);
                return;
            }

            // Enemy turn - Attack animation after player's turn
            setTimeout(() => {
                enemyCombatant.classList.add('attacking-right');
                setTimeout(() => {
                    enemyCombatant.classList.remove('attacking-right');
                }, 300);

                // Calculate enemy damage with type effectiveness
                const baseEnemyDmg = Math.max(1, Math.floor(
                    (enemy.atk - gameState.player.getTotalDef(playerChar)) * (0.8 + Math.random() * 0.4)
                ));
                const enemyDmg = Math.floor(baseEnemyDmg * enemyEffectiveness);

                // Player hurt animation
                setTimeout(() => {
                    playerCombatant.classList.add('hurt');
                    playerChar.takeDamage(enemyDmg);
                    let effectMsg = enemyEffectiveness > 1 ? ' (Super Effective!)' : enemyEffectiveness < 1 ? ' (Not very effective...)' : '';
                    addLog(`${enemy.typeEmoji} ${enemy.name} dealt ${enemyDmg} damage!${effectMsg}`);

                    // Update player HP bar
                    const playerHpPercent = (playerChar.stats.hp / playerChar.stats.maxHp) * 100;
                    document.getElementById('combat-player-hp-bar').style.width = `${playerHpPercent}%`;
                    document.getElementById('combat-player-hp-text').textContent =
                        `${playerChar.stats.hp}/${playerChar.stats.maxHp}`;

                    setTimeout(() => {
                        playerCombatant.classList.remove('hurt');
                    }, 300);

                    if (playerChar.stats.hp <= 0) {
                        clearInterval(combatInterval);
                        playerChar.isAlive = false;
                        addLog(`💀 ${playerChar.name} fainted...`);

                        // Check if player has any alive characters
                        if (!gameState.player.hasAliveCharacters()) {
                            addLog(`💀 All your characters fainted!`);
                            setTimeout(() => {
                                closeModal();
                                gameOver();
                            }, 1500);
                        } else {
                            addLog(`You still have ${gameState.player.getAliveCharacters().length} character(s) left!`);
                            setTimeout(() => {
                                closeModal();
                                gameState.currentPhase = 'playing';
                            }, 1500);
                        }
                    }
                }, 200);
            }, 400);
        }, 200);

    }, 1400);
}

// ========================================
// SHOP SYSTEM
// ========================================

function openShop() {
    gameState.currentPhase = 'shop';

    gameState.shopItems = [
        createRandomItem('weapons', 1 + gameState.level * 0.3),
        createRandomItem('armor', 1 + gameState.level * 0.3),
        createRandomItem('potions', 1),
        createRandomItem('rings', 1 + gameState.level * 0.2)
    ];

    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    function formatItemStats(item) {
        const parts = [];
        if (item.stats.atk) parts.push(`⚔️ ATK +${item.stats.atk}`);
        if (item.stats.def) parts.push(`🛡️ DEF +${item.stats.def}`);
        if (item.stats.hp) parts.push(`❤️ HP +${item.stats.hp}`);
        if (item.stats.sp) parts.push(`💙 SP +${item.stats.sp}`);
        if (item.stats.luk) parts.push(`🍀 LUK +${item.stats.luk}`);
        if (item.special) parts.push(`✨ ${item.special.effect}`);
        return parts.join(' | ');
    }

    let itemsHTML = gameState.shopItems.map((item, idx) => `
        <div class="item ${item.type} shop-item-${idx}" style="display: inline-block; margin: 10px; padding: 15px; cursor: pointer; border: 3px solid; min-width: 150px;">
            <div style="font-size: 2.5em; margin-bottom: 5px;">${item.emoji}</div>
            <div style="font-weight: bold; margin-bottom: 5px;">${item.name}</div>
            <div style="color: #666; font-size: 0.85em; margin-bottom: 8px;">${formatItemStats(item)}</div>
            <div style="color: #f39c12; font-weight: bold; font-size: 1.1em;">💰 ${item.price}</div>
        </div>
    `).join('');

    content.innerHTML = `
        <h2>🏪 Shop</h2>
        <div style="text-align: center; margin-bottom: 20px;">
            <strong style="font-size: 1.2em;">Your Money: 💰 ${gameState.player.money}</strong>
        </div>
        <div style="text-align: center; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
            ${itemsHTML}
        </div>
        <div class="modal-buttons">
            <button id="leave-shop-btn" class="modal-btn secondary">Leave Shop</button>
        </div>
    `;

    modal.classList.remove('hidden');

    // Add event listeners for each shop item
    gameState.shopItems.forEach((item, idx) => {
        document.querySelector(`.shop-item-${idx}`).addEventListener('click', () => {
            buyItem(idx);
        });
    });

    // Add event listener for leave button
    document.getElementById('leave-shop-btn').addEventListener('click', () => {
        closeModal();
        gameState.currentPhase = 'playing';
    });
}

function buyItem(index) {
    const item = gameState.shopItems[index];

    if (gameState.player.spendMoney(item.price)) {
        gameState.player.addItem(item);
        logEvent(`Bought ${item.emoji} ${item.name} for ${item.price} coins!`);
        closeModal();
        gameState.currentPhase = 'playing';
    } else {
        alert('Not enough money!');
    }
}

// ========================================
// TREASURE & SKILL TRAINER
// ========================================

function openTreasure() {
    const rewards = [];
    const coins = Math.floor((30 + Math.random() * 50) * gameState.level);
    gameState.player.gainMoney(coins);
    rewards.push(`💰 ${coins} coins`);

    if (Math.random() < 0.5) {
        const itemType = ['weapons', 'armor', 'potions', 'rings'][Math.floor(Math.random() * 4)];
        const item = createRandomItem(itemType, 1 + gameState.level * 0.3);
        gameState.player.addItem(item);
        rewards.push(`${item.emoji} ${item.name}`);
    }

    logEvent(`💎 Treasure: ${rewards.join(', ')}`);
}

function openSkillTrainer() {
    logEvent('⭐ Skill trainer (Coming soon!)');
    // TODO: Implement skill learning system
}

function startBossFight() {
    logEvent('👹 BOSS FIGHT! (Coming soon!)');
    // TODO: Implement boss fight
}

// ========================================
// ITEM USAGE
// ========================================

function useItem(index) {
    const item = gameState.player.inventory[index];
    if (!item) return;

    if (item.type === 'weapon') {
        gameState.player.equippedWeapon = item;
        gameState.player.inventory.splice(index, 1);
        logEvent(`Equipped ${item.emoji} ${item.name}`);
    } else if (item.type === 'armor') {
        gameState.player.equippedArmor = item;
        gameState.player.inventory.splice(index, 1);
        logEvent(`Equipped ${item.emoji} ${item.name}`);
    } else if (item.type === 'potion') {
        if (item.stats.hp) {
            gameState.player.healAllCharacters(item.stats.hp);
            logEvent(`Used ${item.emoji} ${item.name}, healed all characters ${item.stats.hp} HP`);
        }
        if (item.stats.sp) {
            // Restore SP to all alive characters
            gameState.player.characters.forEach(char => {
                if (char.isAlive) {
                    char.stats.sp = Math.min(char.stats.maxSp, char.stats.sp + item.stats.sp);
                }
            });
            logEvent(`Used ${item.emoji} ${item.name}, restored ${item.stats.sp} SP to all characters`);
        }
        gameState.player.inventory.splice(index, 1);
    } else if (item.type === 'ring') {
        if (gameState.player.equippedRings.length < 2) {
            gameState.player.equippedRings.push(item);
            gameState.player.inventory.splice(index, 1);
            logEvent(`Equipped ${item.emoji} ${item.name}`);
        } else {
            alert('You can only equip 2 rings! Unequip one first.');
        }
    }

    updateInventoryUI();
    updateUI();
}

// ========================================
// GAME OVER & RESTART
// ========================================

function gameOver() {
    gameState.currentPhase = 'gameOver';

    // Select random item to keep
    let keptItem = null;
    if (gameState.player.inventory.length > 0) {
        const randomIndex = Math.floor(Math.random() * gameState.player.inventory.length);
        keptItem = gameState.player.inventory[randomIndex];
    }

    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <h2>💀 Game Over</h2>
        <p style="text-align: center; font-size: 1.2em; margin: 20px 0;">
            You were defeated...
        </p>
        ${keptItem ? `
            <p style="text-align: center; margin: 20px 0;">
                You managed to keep: ${keptItem.emoji} ${keptItem.name}
            </p>
        ` : ''}
        <div class="modal-buttons">
            <button id="restart-btn" class="modal-btn primary">🔄 Try Again</button>
        </div>
    `;

    modal.classList.remove('hidden');

    // Store kept item for restart
    if (keptItem) {
        localStorage.setItem('persistedItem', JSON.stringify(keptItem));
    }

    // Add event listener for restart button
    document.getElementById('restart-btn').addEventListener('click', restartGame);
}

function restartGame() {
    closeModal();

    // Get persisted item if exists
    const persistedItemData = localStorage.getItem('persistedItem');

    // Reset game state
    gameState.player = new Player();
    gameState.level = 1;
    gameState.bossesDefeated = 0;
    gameState.currentPhase = 'playing';

    // Add persisted item
    if (persistedItemData) {
        try {
            const itemData = JSON.parse(persistedItemData);
            const item = new Item(
                itemData.type,
                itemData.name,
                itemData.emoji,
                itemData.stats,
                itemData.special,
                itemData.price
            );
            gameState.player.addItem(item);
            logEvent(`Starting with ${item.emoji} ${item.name} from previous run!`);
        } catch (e) {
            console.error('Error loading persisted item:', e);
        }
        localStorage.removeItem('persistedItem');
    }

    renderBoard();
    updateUI();
    updateInventoryUI();
    logEvent('🎮 Game restarted! Good luck!');
}

// ========================================
// MODAL HELPERS
// ========================================

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

// ========================================
// INITIALIZATION
// ========================================

function initGame() {
    gameState.player = new Player();
    gameState.board = generateBoard();

    renderBoard();
    updateUI();
    updateInventoryUI();

    // Setup event listeners
    const rollBtn = document.getElementById('roll-dice-btn');
    if (rollBtn) rollBtn.addEventListener('click', rollDice);

    const centerRollBtn = document.getElementById('center-roll-btn');
    if (centerRollBtn) centerRollBtn.addEventListener('click', rollDice);

    // Close modal on overlay click
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') {
            if (gameState.currentPhase === 'shop') {
                closeModal();
                gameState.currentPhase = 'playing';
            }
        }
    });

    logEvent('🎮 Game V2 started! You have 3 characters: 🔥 Blaze, 💧 Aqua, 🌿 Flora!');
    logEvent('Roll the dice to begin your adventure!');
}

// Start the game when page loads
window.addEventListener('DOMContentLoaded', initGame);

// ========================================
// PANEL COLLAPSE FUNCTIONALITY
// ========================================

function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    const btn = panel.querySelector('.collapse-btn');

    if (panel.classList.contains('collapsed')) {
        panel.classList.remove('collapsed');
        btn.textContent = '−';
    } else {
        panel.classList.add('collapsed');
        btn.textContent = '+';
    }
}
