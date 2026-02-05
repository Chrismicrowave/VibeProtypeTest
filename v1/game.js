// ========================================
// GAME STATE & CONSTANTS
// ========================================

// Language System
let currentLanguage = localStorage.getItem('gameLanguage') || 'en';

const TRANSLATIONS = {
    en: {
        title: 'Dice Board Game V1',
        level: 'Level',
        bossesDefeated: 'Bosses Defeated',
        loop: 'Loop',
        playerStats: 'Player Stats',
        inventory: 'Inventory',
        skills: 'Skills',
        weapon: 'Weapon',
        armor: 'Armor',
        rings: 'Rings',
        active: 'Active',
        passive: 'Passive',
        noActiveSkills: 'No active skills yet',
        noPassiveSkills: 'No passive skills yet',
        noItems: 'No items',
        money: 'Money',
        rollDice: 'Roll Dice',
        welcome: 'Welcome! Click Roll Dice to start.',
        rolled: 'Rolled a',
        landedOn: 'Landed on',
        tile: 'tile',
        loopCompleted: 'Loop completed! Bonus +50 coins',
        foundCoins: 'Found',
        coins: 'coins',
        combatStart: 'Combat started against',
        victory: 'Victory! You defeated',
        gained: 'Gained',
        found: 'Found',
        victoryMsg: 'Victory!',
        defeatedEnemy: 'You defeated',
        equipped: 'Equipped',
        unequipped: 'Unequipped',
        used: 'Used',
        healed: 'healed',
        restored: 'restored',
        sold: 'Sold',
        for: 'for',
        bought: 'Bought',
        notEnoughMoney: 'Not enough money!',
        shop: 'Shop',
        yourMoney: 'Your Money',
        leaveShop: 'Leave Shop',
        treasure: 'Treasure',
        skillTrainer: 'Skill trainer (Coming soon!)',
        bossFight: 'BOSS FIGHT! (Coming soon!)',
        gameOver: 'Game Over',
        defeated: 'You were defeated...',
        keptItem: 'You managed to keep',
        tryAgain: 'Try Again',
        gameStarted: 'Game started! Roll the dice to begin your adventure!',
        gameRestarted: 'Game restarted! Good luck!',
        startingWith: 'Starting with',
        fromPreviousRun: 'from previous run!',
        battleStart: 'BATTLE START!',
        you: 'You',
        combatBegins: 'Combat begins!',
        dealtDamage: 'You dealt',
        damage: 'damage',
        enemyDealt: 'dealt',
        victoryLoot: 'Victory Loot!',
        chooseItems: 'Choose what to do with each item:',
        equip: 'Equip',
        use: 'Use',
        sell: 'Sell',
        continueAdventure: 'Continue Adventure',
        allItemsCollected: 'All items collected!',
        addedToInventory: 'Added',
        toInventory: 'to inventory',
        ringSlotsFull: 'ring slots full',
        leftClick: 'Left click: Equip/Use',
        rightClick: 'Right click: Sell for',
        clickToUnequip: 'Click to unequip',
        noWeapon: 'No weapon',
        noArmor: 'No armor',
        sellConfirm: 'Sell',
        ringsMax: 'You can only equip 2 rings! Unequip one first.',
        currentEquipped: 'Current Equipped',
        newItem: 'New Item',
        equipNewSellOld: 'Equip New & Sell Old',
        keepOldSellNew: 'Sell New Item',
        autoSoldOld: 'Auto-sold old',
        comparison: 'Comparison',
        noEquipped: 'None equipped',
        HP: 'HP',
        ATK: 'ATK',
        DEF: 'DEF',
        SP: 'SP',
        LUK: 'LUK'
    },
    zh: {
        title: '骰子棋盘游戏 V1',
        level: '等级',
        bossesDefeated: '已击败Boss',
        loop: '回合',
        playerStats: '玩家属性',
        inventory: '背包',
        skills: '技能',
        weapon: '武器',
        armor: '护甲',
        rings: '戒指',
        active: '主动',
        passive: '被动',
        noActiveSkills: '暂无主动技能',
        noPassiveSkills: '暂无被动技能',
        noItems: '背包空空',
        money: '金币',
        rollDice: '掷骰子',
        welcome: '欢迎！点击掷骰子开始游戏',
        rolled: '掷出了',
        landedOn: '降落在',
        tile: '格子',
        loopCompleted: '完成一圈！奖励 +50 金币',
        foundCoins: '发现了',
        coins: '金币',
        combatStart: '战斗开始，对手是',
        victory: '胜利！你击败了',
        gained: '获得了',
        found: '发现了',
        victoryMsg: '胜利！',
        defeatedEnemy: '你击败了',
        equipped: '装备了',
        unequipped: '卸下了',
        used: '使用了',
        healed: '恢复了',
        restored: '恢复了',
        sold: '出售了',
        for: '，获得',
        bought: '购买了',
        notEnoughMoney: '金币不足！',
        shop: '商店',
        yourMoney: '你的金币',
        leaveShop: '离开商店',
        treasure: '宝箱',
        skillTrainer: '技能训练师（即将推出！）',
        bossFight: 'Boss战！（即将推出！）',
        gameOver: '游戏结束',
        defeated: '你被击败了...',
        keptItem: '你保留了',
        tryAgain: '再试一次',
        gameStarted: '游戏开始！掷骰子开始你的冒险！',
        gameRestarted: '游戏重新开始！祝你好运！',
        startingWith: '带着',
        fromPreviousRun: '从上一局继续！',
        battleStart: '战斗开始！',
        you: '你',
        combatBegins: '战斗开始！',
        dealtDamage: '你造成了',
        damage: '伤害',
        enemyDealt: '造成了',
        victoryLoot: '战利品！',
        chooseItems: '选择如何处理这些物品：',
        equip: '装备',
        use: '使用',
        sell: '出售',
        continueAdventure: '继续冒险',
        allItemsCollected: '所有物品已收集！',
        addedToInventory: '添加了',
        toInventory: '到背包',
        ringSlotsFull: '戒指栏已满',
        leftClick: '左键：装备/使用',
        rightClick: '右键：出售，价格',
        clickToUnequip: '点击卸下',
        noWeapon: '无武器',
        noArmor: '无护甲',
        sellConfirm: '出售',
        ringsMax: '最多只能装备2个戒指！请先卸下一个。',
        currentEquipped: '当前装备',
        newItem: '新物品',
        equipNewSellOld: '装备新的并出售旧的',
        keepOldSellNew: '出售新物品',
        autoSoldOld: '自动出售了旧的',
        comparison: '对比',
        noEquipped: '未装备',
        HP: '生命',
        ATK: '攻击',
        DEF: '防御',
        SP: '法力',
        LUK: '幸运'
    }
};

function t(key) {
    return TRANSLATIONS[currentLanguage][key] || key;
}

function switchLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    localStorage.setItem('gameLanguage', currentLanguage);

    // Update all static UI text
    updateLanguageUI();
    updateUI();
    updateInventoryUI();
}

function updateLanguageUI() {
    document.querySelector('header h1').textContent = `🎲 ${t('title')} 🔥💧🌿`;
    document.getElementById('game-info').innerHTML = `
        <span>${t('level')}: <span id="level-display">${gameState.level}</span></span>
        <span>${t('bossesDefeated')}: <span id="bosses-display">${gameState.bossesDefeated}/3</span></span>
        <span>${t('loop')}: <span id="loop-display">${gameState.player ? gameState.player.loops : 0}/5</span></span>
    `;

    // Update panel headers
    document.querySelector('#player-stats h2').innerHTML = `
        ${t('playerStats')} 🤺
        <button class="collapse-btn" onclick="togglePanel('player-stats')">−</button>
    `;
    document.querySelector('#inventory-panel h2').innerHTML = `
        ${t('inventory')} 🎒
        <button class="collapse-btn" onclick="togglePanel('inventory-panel')">−</button>
    `;
    document.querySelector('#skills-panel h2').innerHTML = `
        ${t('skills')} ⭐
        <button class="collapse-btn" onclick="togglePanel('skills-panel')">−</button>
    `;

    // Update equipped slots
    document.querySelectorAll('.equipped-slot span')[0].textContent = t('weapon') + ':';
    document.querySelectorAll('.equipped-slot span')[1].textContent = t('armor') + ':';
    document.querySelectorAll('.equipped-slot span')[2].textContent = t('rings') + ':';

    // Update skills sections
    document.querySelector('#active-skills h3').textContent = t('active');
    document.querySelector('#passive-skills h3').textContent = t('passive');

    const activeEmpty = document.querySelector('#active-skills-list .empty-text');
    if (activeEmpty) activeEmpty.textContent = t('noActiveSkills');
    const passiveEmpty = document.querySelector('#passive-skills-list .empty-text');
    if (passiveEmpty) passiveEmpty.textContent = t('noPassiveSkills');

    // Update roll button
    const centerRollBtn = document.getElementById('center-roll-btn');
    if (centerRollBtn) centerRollBtn.innerHTML = `🎲 ${t('rollDice')}`;
}

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

const gameState = {
    player: null,
    board: [],
    level: 1,
    bossesDefeated: 0,
    currentPhase: 'playing', // 'playing', 'combat', 'shop', 'gameOver', 'boss'
    isRolling: false,
    currentEnemy: null, // Store current enemy for combat
    shopItems: [] // Store current shop items
};

// ========================================
// PLAYER CLASS
// ========================================

class Player {
    constructor() {
        this.position = 0;
        this.loops = 0;
        this.stats = {
            hp: 100,
            maxHp: 100,
            sp: 50,
            maxSp: 50,
            atk: 25,
            def: 8,
            luk: 5,
            money: 100
        };
        this.inventory = [];
        this.equippedWeapon = null;
        this.equippedArmor = null;
        this.equippedRings = [];
        this.skills = [];
        this.passiveBuffs = [];
        this.persistedItem = null; // Item carried over from previous game
    }

    move(steps) {
        const oldPosition = this.position;
        this.position = (this.position + steps) % 32;

        // Check if completed a loop
        if (oldPosition + steps >= 32) {
            this.loops++;
            this.gainMoney(50); // Bonus for completing loop

            // Heal 30% of max HP
            const healAmount = Math.floor(this.stats.maxHp * 0.3);
            this.heal(healAmount);

            logEvent(`🎉 ${t('loopCompleted')} & +${healAmount} HP! (${this.loops}/5)`);

            // Check for boss fight
            if (this.loops >= 5) {
                this.loops = 0;
                setTimeout(() => startBossFight(), 1000);
            }
        }

        return this.position;
    }

    takeDamage(amount) {
        const actualDamage = Math.max(1, amount - this.stats.def);
        this.stats.hp = Math.max(0, this.stats.hp - actualDamage);
        updateUI();
        return actualDamage;
    }

    heal(amount) {
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
        updateUI();
    }

    gainMoney(amount) {
        this.stats.money += amount;
        updateUI();
    }

    spendMoney(amount) {
        if (this.stats.money >= amount) {
            this.stats.money -= amount;
            updateUI();
            return true;
        }
        return false;
    }

    addItem(item) {
        this.inventory.push(item);
        updateInventoryUI();
    }

    getTotalAtk() {
        let atk = this.stats.atk;
        if (this.equippedWeapon) atk += this.equippedWeapon.stats.atk || 0;
        return atk;
    }

    getTotalDef() {
        let def = this.stats.def;
        if (this.equippedArmor) def += this.equippedArmor.stats.def || 0;
        return def;
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
        <button id="center-roll-btn" class="action-btn" style="width: 100%; max-width: 200px; margin-bottom: 15px;">🎲 ${t('rollDice')}</button>
        <div id="center-event-log" style="background: #f8f9fa; padding: 10px; border-radius: 8px; width: 100%; max-height: 150px; overflow-y: auto; font-size: 0.85em;">
            <p>${t('welcome')}</p>
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

    // Update stats
    document.getElementById('hp-bar').style.width = `${(p.stats.hp / p.stats.maxHp) * 100}%`;
    document.getElementById('hp-text').textContent = `${p.stats.hp}/${p.stats.maxHp}`;

    document.getElementById('sp-bar').style.width = `${(p.stats.sp / p.stats.maxSp) * 100}%`;
    document.getElementById('sp-text').textContent = `${p.stats.sp}/${p.stats.maxSp}`;

    document.getElementById('atk-value').textContent = p.getTotalAtk();
    document.getElementById('def-value').textContent = p.getTotalDef();
    document.getElementById('luk-value').textContent = p.stats.luk;
    document.getElementById('money-value').textContent = p.stats.money;

    // Update game info
    document.getElementById('level-display').textContent = gameState.level;
    document.getElementById('bosses-display').textContent = `${gameState.bossesDefeated}/3`;
    document.getElementById('loop-display').textContent = `${p.loops}/5`;
}

function updateInventoryUI() {
    const inventoryDiv = document.getElementById('inventory-items');
    if (!inventoryDiv) return;

    inventoryDiv.innerHTML = '';

    if (gameState.player.inventory.length === 0) {
        inventoryDiv.innerHTML = `<p class="empty-text">${t('noItems')}</p>`;
        return;
    }

    gameState.player.inventory.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = `item ${item.type}`;
        itemDiv.textContent = item.emoji;
        const sellPrice = item.sellValue || Math.floor(item.price * 0.6);
        itemDiv.title = `${item.name}\n${t('leftClick')}\n${t('rightClick')} ${sellPrice} ${t('coins')}`;
        itemDiv.onclick = () => useItem(index);
        itemDiv.oncontextmenu = (e) => {
            e.preventDefault();
            if (confirm(`${t('sellConfirm')} ${item.emoji} ${item.name} ${t('for')} ${sellPrice} ${t('coins')}?`)) {
                sellItem(index);
            }
        };
        inventoryDiv.appendChild(itemDiv);
    });

    // Update equipped items - make them clickable to unequip
    const weaponSlot = document.getElementById('equipped-weapon');
    if (weaponSlot) {
        weaponSlot.textContent = gameState.player.equippedWeapon ? gameState.player.equippedWeapon.emoji : '-';
        weaponSlot.style.cursor = gameState.player.equippedWeapon ? 'pointer' : 'default';
        weaponSlot.title = gameState.player.equippedWeapon ? `${gameState.player.equippedWeapon.name}\n${t('clickToUnequip')}` : t('noWeapon');
        weaponSlot.onclick = gameState.player.equippedWeapon ? unequipWeapon : null;
    }

    const armorSlot = document.getElementById('equipped-armor');
    if (armorSlot) {
        armorSlot.textContent = gameState.player.equippedArmor ? gameState.player.equippedArmor.emoji : '-';
        armorSlot.style.cursor = gameState.player.equippedArmor ? 'pointer' : 'default';
        armorSlot.title = gameState.player.equippedArmor ? `${gameState.player.equippedArmor.name}\n${t('clickToUnequip')}` : t('noArmor');
        armorSlot.onclick = gameState.player.equippedArmor ? unequipArmor : null;
    }

    const ringsSlot = document.getElementById('equipped-rings');
    if (ringsSlot) {
        if (gameState.player.equippedRings.length > 0) {
            ringsSlot.innerHTML = '';
            gameState.player.equippedRings.forEach((ring, idx) => {
                const ringSpan = document.createElement('span');
                ringSpan.textContent = ring.emoji;
                ringSpan.style.cursor = 'pointer';
                ringSpan.style.margin = '0 2px';
                ringSpan.title = `${ring.name}\n${t('clickToUnequip')}`;
                ringSpan.onclick = () => unequipRing(idx);
                ringsSlot.appendChild(ringSpan);
            });
        } else {
            ringsSlot.textContent = '-';
            ringsSlot.style.cursor = 'default';
        }
    }
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

            logEvent(`${t('rolled')} ${finalRoll}!`);

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
                logEvent(`🎉 ${t('loopCompleted')} (${gameState.player.loops}/5)`);

                // Check for boss fight
                if (gameState.player.loops >= 5) {
                    gameState.player.loops = 0;
                    setTimeout(() => startBossFight(), 1000);
                }
            }

            const tile = gameState.board[gameState.player.position];
            logEvent(`${t('landedOn')} ${tile.emoji} ${tile.type} ${t('tile')}!`);

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
            logEvent(`${t('foundCoins')} ${coins} ${t('coins')}! 💰`);
            break;
    }
}

// ========================================
// COMBAT SYSTEM
// ========================================

function startCombat() {
    gameState.currentPhase = 'combat';

    gameState.currentEnemy = generateEnemy();
    logEvent(`⚔️ ${t('combatStart')} ${gameState.currentEnemy.name}!`);

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

    return {
        name: type.name,
        emoji: type.emoji,
        hp: Math.floor(60 * type.hpMult * levelScale),
        maxHp: Math.floor(60 * type.hpMult * levelScale),
        atk: Math.floor(20 * type.atkMult * levelScale),
        def: Math.floor(5 * levelScale)
    };
}

function showCombatModal(enemy) {
    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 20px;">⚔️ ${t('battleStart')} ⚔️</h2>

        <div class="combat-arena">
            <!-- Player Side -->
            <div class="combatant combatant-left" id="player-combatant">
                <div class="combatant-name">${t('you')}</div>
                <div class="combatant-emoji">🤺</div>
                <div class="combatant-hp-container">
                    <div style="position: relative;">
                        <div id="combat-player-hp-bar" class="combatant-hp-bar" style="width: ${(gameState.player.stats.hp / gameState.player.stats.maxHp) * 100}%"></div>
                        <span id="combat-player-hp-text" class="combatant-hp-text">${gameState.player.stats.hp}/${gameState.player.stats.maxHp}</span>
                    </div>
                </div>
            </div>

            <!-- Enemy Side -->
            <div class="combatant combatant-right" id="enemy-combatant">
                <div class="combatant-name">${enemy.name}</div>
                <div class="combatant-emoji">${enemy.emoji}</div>
                <div class="combatant-hp-container">
                    <div style="position: relative;">
                        <div id="enemy-hp-bar" class="combatant-hp-bar" style="width: 100%"></div>
                        <span id="enemy-hp-text" class="combatant-hp-text">${enemy.hp}/${enemy.maxHp}</span>
                    </div>
                </div>
            </div>
        </div>

        <div id="combat-log" style="background: #f8f9fa; padding: 15px; border-radius: 8px; max-height: 150px; overflow-y: auto; margin: 20px 0; font-family: monospace;">
            <p style="text-align: center; color: #667eea; font-weight: bold;">⚔️ ${t('combatBegins')} ⚔️</p>
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

    let turn = 0;
    const combatInterval = setInterval(() => {
        turn++;

        // Player turn - Attack animation
        playerCombatant.classList.add('attacking-left');
        setTimeout(() => {
            playerCombatant.classList.remove('attacking-left');
        }, 300);

        const playerDmg = Math.max(1, Math.floor(
            (gameState.player.getTotalAtk() - enemy.def) * (0.8 + Math.random() * 0.4)
        ));

        // Enemy hurt animation
        setTimeout(() => {
            enemyCombatant.classList.add('hurt');
            enemy.hp -= playerDmg;
            addLog(`🤺 ${t('dealtDamage')} ${playerDmg} ${t('damage')}!`);

            // Update enemy HP bar
            const enemyHpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
            document.getElementById('enemy-hp-bar').style.width = `${enemyHpPercent}%`;
            document.getElementById('enemy-hp-text').textContent = `${Math.max(0, enemy.hp)}/${enemy.maxHp}`;

            setTimeout(() => {
                enemyCombatant.classList.remove('hurt');
            }, 300);

            if (enemy.hp <= 0) {
                clearInterval(combatInterval);
                addLog(`🎉 ${t('victoryMsg')} ${t('defeatedEnemy')} ${enemy.name}!`);

                const reward = Math.floor((20 + Math.random() * 30) * gameState.level);
                gameState.player.gainMoney(reward);
                addLog(`💰 ${t('gained')} ${reward} ${t('coins')}!`);

                setTimeout(() => {
                    showCombatLootModal();
                }, 1500);
                return;
            }

            // Enemy turn - Attack animation after player's turn
            setTimeout(() => {
                enemyCombatant.classList.add('attacking-right');
                setTimeout(() => {
                    enemyCombatant.classList.remove('attacking-right');
                }, 300);

                const enemyDmg = Math.max(1, Math.floor(
                    (enemy.atk - gameState.player.getTotalDef()) * (0.8 + Math.random() * 0.4)
                ));

                // Player hurt animation
                setTimeout(() => {
                    playerCombatant.classList.add('hurt');
                    gameState.player.takeDamage(enemyDmg);
                    addLog(`${enemy.emoji} ${enemy.name} ${t('enemyDealt')} ${enemyDmg} ${t('damage')}!`);

                    // Update player HP bar
                    const playerHpPercent = (gameState.player.stats.hp / gameState.player.stats.maxHp) * 100;
                    document.getElementById('combat-player-hp-bar').style.width = `${playerHpPercent}%`;
                    document.getElementById('combat-player-hp-text').textContent =
                        `${gameState.player.stats.hp}/${gameState.player.stats.maxHp}`;

                    setTimeout(() => {
                        playerCombatant.classList.remove('hurt');
                    }, 300);

                    if (gameState.player.stats.hp <= 0) {
                        clearInterval(combatInterval);
                        addLog(`💀 ${t('defeated')}`);

                        setTimeout(() => {
                            closeModal();
                            gameOver();
                        }, 1500);
                    }
                }, 200);
            }, 400);
        }, 200);

    }, 1400);
}

function showCombatLootModal() {
    // Generate 1-3 random items
    const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
    const lootItems = [];

    for (let i = 0; i < numItems; i++) {
        const itemType = ['weapons', 'armor', 'potions', 'rings'][Math.floor(Math.random() * 4)];
        const item = createRandomItem(itemType, 1 + gameState.level * 0.2);
        lootItems.push(item);
    }

    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    function formatItemStats(item) {
        const parts = [];
        if (item.stats.atk) parts.push(`⚔️ ${t('ATK')} +${item.stats.atk}`);
        if (item.stats.def) parts.push(`🛡️ ${t('DEF')} +${item.stats.def}`);
        if (item.stats.hp) parts.push(`❤️ ${t('HP')} +${item.stats.hp}`);
        if (item.stats.sp) parts.push(`💙 ${t('SP')} +${item.stats.sp}`);
        if (item.stats.luk) parts.push(`🍀 ${t('LUK')} +${item.stats.luk}`);
        if (item.special) parts.push(`✨ ${item.special.effect}`);
        return parts.join(' | ');
    }

    function getCurrentEquippedItem(itemType) {
        if (itemType === 'weapon') return gameState.player.equippedWeapon;
        if (itemType === 'armor') return gameState.player.equippedArmor;
        return null;
    }

    function renderLootUI() {
        const remainingItems = lootItems.filter(i => i);

        // Auto-close if all items are taken
        if (remainingItems.length === 0) {
            setTimeout(() => {
                closeModal();
                gameState.currentPhase = 'playing';
            }, 800);
            return;
        }

        let itemsHTML = lootItems.map((item, idx) => {
            if (!item) return ''; // Item was taken

            const sellPrice = item.sellValue || Math.floor(item.price * 0.6);
            const currentEquipped = getCurrentEquippedItem(item.type);

            // For weapons and armor, show comparison
            if ((item.type === 'weapon' || item.type === 'armor') && currentEquipped) {
                return `
                    <div class="loot-item-${idx}" style="display: inline-block; margin: 10px; padding: 15px; border: 3px solid #667eea; border-radius: 10px; min-width: 300px; background: #f8f9fa;">
                        <h4 style="text-align: center; color: #667eea; margin-bottom: 10px;">📊 ${t('comparison')}</h4>
                        <div style="display: flex; gap: 15px; margin-bottom: 10px;">
                            <!-- Current Equipped -->
                            <div style="flex: 1; text-align: center; background: #fff3cd; padding: 10px; border-radius: 8px; border: 2px solid #ffc107;">
                                <div style="font-size: 0.75em; color: #856404; font-weight: bold; margin-bottom: 5px;">${t('currentEquipped')}</div>
                                <div style="font-size: 2em; margin-bottom: 5px;">${currentEquipped.emoji}</div>
                                <div style="font-weight: bold; font-size: 0.85em; color: #2c3e50;">${currentEquipped.name}</div>
                                <div style="color: #666; font-size: 0.75em; margin-top: 5px;">${formatItemStats(currentEquipped)}</div>
                                <div style="color: #f39c12; font-weight: bold; font-size: 0.85em; margin-top: 5px;">💰 ${currentEquipped.sellValue || Math.floor(currentEquipped.price * 0.6)}</div>
                            </div>
                            <!-- Arrow -->
                            <div style="display: flex; align-items: center; font-size: 2em; color: #667eea;">➡️</div>
                            <!-- New Item -->
                            <div style="flex: 1; text-align: center; background: #d1ecf1; padding: 10px; border-radius: 8px; border: 2px solid #17a2b8;">
                                <div style="font-size: 0.75em; color: #0c5460; font-weight: bold; margin-bottom: 5px;">${t('newItem')}</div>
                                <div style="font-size: 2em; margin-bottom: 5px;">${item.emoji}</div>
                                <div style="font-weight: bold; font-size: 0.85em; color: #2c3e50;">${item.name}</div>
                                <div style="color: #666; font-size: 0.75em; margin-top: 5px;">${formatItemStats(item)}</div>
                                <div style="color: #17a2b8; font-weight: bold; font-size: 0.85em; margin-top: 5px;">💰 ${sellPrice}</div>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <button class="loot-equip-btn-${idx}" style="padding: 10px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 0.9em;">
                                ✅ ${t('equipNewSellOld')}
                            </button>
                            <button class="loot-sell-btn-${idx}" style="padding: 10px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 0.9em;">
                                ❌ ${t('keepOldSellNew')}
                            </button>
                        </div>
                    </div>
                `;
            } else {
                // For potions, rings, or when nothing is equipped
                return `
                    <div class="loot-item-${idx}" style="display: inline-block; margin: 10px; padding: 15px; border: 3px solid #667eea; border-radius: 10px; min-width: 180px; background: #f8f9fa;">
                        <div style="font-size: 3em; margin-bottom: 5px;">${item.emoji}</div>
                        <div style="font-weight: bold; margin-bottom: 5px; color: #2c3e50;">${item.name}</div>
                        <div style="color: #666; font-size: 0.85em; margin-bottom: 10px;">${formatItemStats(item)}</div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <button class="loot-equip-btn-${idx}" style="padding: 8px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                                ${item.type === 'potion' ? `🧪 ${t('use')}` : `⚔️ ${t('equip')}`}
                            </button>
                            <button class="loot-sell-btn-${idx}" style="padding: 8px; background: #f39c12; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                                💰 ${t('sell')} (${sellPrice})
                            </button>
                        </div>
                    </div>
                `;
            }
        }).join('');

        content.innerHTML = `
            <h2 style="text-align: center; margin-bottom: 20px;">🎁 ${t('victoryLoot')} 🎁</h2>
            <p style="text-align: center; margin-bottom: 20px; color: #666;">
                ${t('chooseItems')}
            </p>
            <div style="text-align: center; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 20px;">
                ${itemsHTML}
            </div>
            <div class="modal-buttons">
                <button id="close-loot-btn" class="modal-btn primary">${t('continueAdventure')}</button>
            </div>
        `;

        // Add event listeners for each item
        lootItems.forEach((item, idx) => {
            if (!item) return;

            const equipBtn = content.querySelector(`.loot-equip-btn-${idx}`);
            const sellBtn = content.querySelector(`.loot-sell-btn-${idx}`);

            if (equipBtn) {
                equipBtn.addEventListener('click', () => {
                    if (item.type === 'weapon') {
                        // Auto-sell old weapon if exists
                        if (gameState.player.equippedWeapon) {
                            const oldWeapon = gameState.player.equippedWeapon;
                            const oldSellPrice = oldWeapon.sellValue || Math.floor(oldWeapon.price * 0.6);
                            gameState.player.gainMoney(oldSellPrice);
                            logEvent(`${t('autoSoldOld')} ${oldWeapon.emoji} ${oldWeapon.name} ${t('for')} ${oldSellPrice} ${t('coins')}`);
                        }
                        gameState.player.equippedWeapon = item;
                        logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
                    } else if (item.type === 'armor') {
                        // Auto-sell old armor if exists
                        if (gameState.player.equippedArmor) {
                            const oldArmor = gameState.player.equippedArmor;
                            const oldSellPrice = oldArmor.sellValue || Math.floor(oldArmor.price * 0.6);
                            gameState.player.gainMoney(oldSellPrice);
                            logEvent(`${t('autoSoldOld')} ${oldArmor.emoji} ${oldArmor.name} ${t('for')} ${oldSellPrice} ${t('coins')}`);
                        }
                        gameState.player.equippedArmor = item;
                        logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
                    } else if (item.type === 'potion') {
                        if (item.stats.hp) {
                            gameState.player.heal(item.stats.hp);
                            logEvent(`${t('used')} ${item.emoji} ${item.name}, ${t('healed')} ${item.stats.hp} HP`);
                        }
                        if (item.stats.sp) {
                            gameState.player.stats.sp = Math.min(
                                gameState.player.stats.maxSp,
                                gameState.player.stats.sp + item.stats.sp
                            );
                            logEvent(`${t('used')} ${item.emoji} ${item.name}, ${t('restored')} ${item.stats.sp} SP`);
                        }
                    } else if (item.type === 'ring') {
                        if (gameState.player.equippedRings.length < 2) {
                            gameState.player.equippedRings.push(item);
                            logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
                        } else {
                            // Add to inventory if can't equip
                            gameState.player.inventory.push(item);
                            logEvent(`${t('addedToInventory')} ${item.emoji} ${item.name} ${t('toInventory')} (${t('ringSlotsFull')})`);
                        }
                    }

                    lootItems[idx] = null; // Mark as taken
                    updateUI();
                    updateInventoryUI();
                    renderLootUI(); // Re-render
                });
            }

            if (sellBtn) {
                sellBtn.addEventListener('click', () => {
                    const sellPrice = item.sellValue || Math.floor(item.price * 0.6);
                    gameState.player.gainMoney(sellPrice);
                    logEvent(`${t('sold')} ${item.emoji} ${item.name} ${t('for')} ${sellPrice} ${t('coins')}!`);

                    lootItems[idx] = null; // Mark as sold
                    renderLootUI(); // Re-render
                });
            }
        });

        // Add event listener for close button
        const closeBtn = content.querySelector('#close-loot-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                // Add any remaining items to inventory
                lootItems.forEach(item => {
                    if (item) {
                        gameState.player.addItem(item);
                        logEvent(`Added ${item.emoji} ${item.name} to inventory`);
                    }
                });
                closeModal();
                gameState.currentPhase = 'playing';
            });
        }
    }

    renderLootUI();
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
        <h2>🏪 ${t('shop')}</h2>
        <div style="text-align: center; margin-bottom: 20px;">
            <strong style="font-size: 1.2em;">${t('yourMoney')}: 💰 ${gameState.player.stats.money}</strong>
        </div>
        <div style="text-align: center; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
            ${itemsHTML}
        </div>
        <div class="modal-buttons">
            <button id="leave-shop-btn" class="modal-btn secondary">${t('leaveShop')}</button>
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
        logEvent(`${t('bought')} ${item.emoji} ${item.name} ${t('for')} ${item.price} ${t('coins')}!`);
        closeModal();
        gameState.currentPhase = 'playing';
    } else {
        alert(t('notEnoughMoney'));
    }
}

// ========================================
// TREASURE & SKILL TRAINER
// ========================================

function openTreasure() {
    const rewards = [];
    const coins = Math.floor((30 + Math.random() * 50) * gameState.level);
    gameState.player.gainMoney(coins);
    rewards.push(`💰 ${coins} ${t('coins')}`);

    if (Math.random() < 0.5) {
        const itemType = ['weapons', 'armor', 'potions', 'rings'][Math.floor(Math.random() * 4)];
        const item = createRandomItem(itemType, 1 + gameState.level * 0.3);
        gameState.player.addItem(item);
        rewards.push(`${item.emoji} ${item.name}`);
    }

    logEvent(`💎 ${t('treasure')}: ${rewards.join(', ')}`);
}

function openSkillTrainer() {
    logEvent(`⭐ ${t('skillTrainer')}`);
    // TODO: Implement skill learning system
}

function startBossFight() {
    logEvent(`👹 ${t('bossFight')}`);
    // TODO: Implement boss fight
}

// ========================================
// ITEM USAGE
// ========================================

function useItem(index) {
    const item = gameState.player.inventory[index];
    if (!item) return;

    if (item.type === 'weapon') {
        // Auto-sell current weapon if any
        if (gameState.player.equippedWeapon) {
            const oldWeapon = gameState.player.equippedWeapon;
            const oldSellPrice = oldWeapon.sellValue || Math.floor(oldWeapon.price * 0.6);
            gameState.player.gainMoney(oldSellPrice);
            logEvent(`${t('autoSoldOld')} ${oldWeapon.emoji} ${oldWeapon.name} ${t('for')} ${oldSellPrice} ${t('coins')}`);
        }
        gameState.player.equippedWeapon = item;
        gameState.player.inventory.splice(index, 1);
        logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
    } else if (item.type === 'armor') {
        // Auto-sell current armor if any
        if (gameState.player.equippedArmor) {
            const oldArmor = gameState.player.equippedArmor;
            const oldSellPrice = oldArmor.sellValue || Math.floor(oldArmor.price * 0.6);
            gameState.player.gainMoney(oldSellPrice);
            logEvent(`${t('autoSoldOld')} ${oldArmor.emoji} ${oldArmor.name} ${t('for')} ${oldSellPrice} ${t('coins')}`);
        }
        gameState.player.equippedArmor = item;
        gameState.player.inventory.splice(index, 1);
        logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
    } else if (item.type === 'potion') {
        if (item.stats.hp) {
            gameState.player.heal(item.stats.hp);
            logEvent(`${t('used')} ${item.emoji} ${item.name}, ${t('healed')} ${item.stats.hp} HP`);
        }
        if (item.stats.sp) {
            gameState.player.stats.sp = Math.min(
                gameState.player.stats.maxSp,
                gameState.player.stats.sp + item.stats.sp
            );
            logEvent(`${t('used')} ${item.emoji} ${item.name}, ${t('restored')} ${item.stats.sp} SP`);
        }
        gameState.player.inventory.splice(index, 1);
    } else if (item.type === 'ring') {
        if (gameState.player.equippedRings.length < 2) {
            gameState.player.equippedRings.push(item);
            gameState.player.inventory.splice(index, 1);
            logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
        } else {
            alert(t('ringsMax'));
        }
    }

    updateInventoryUI();
    updateUI();
}

function unequipWeapon() {
    if (gameState.player.equippedWeapon) {
        gameState.player.inventory.push(gameState.player.equippedWeapon);
        logEvent(`${t('unequipped')} ${gameState.player.equippedWeapon.emoji} ${gameState.player.equippedWeapon.name}`);
        gameState.player.equippedWeapon = null;
        updateInventoryUI();
        updateUI();
    }
}

function unequipArmor() {
    if (gameState.player.equippedArmor) {
        gameState.player.inventory.push(gameState.player.equippedArmor);
        logEvent(`${t('unequipped')} ${gameState.player.equippedArmor.emoji} ${gameState.player.equippedArmor.name}`);
        gameState.player.equippedArmor = null;
        updateInventoryUI();
        updateUI();
    }
}

function unequipRing(ringIndex) {
    if (gameState.player.equippedRings[ringIndex]) {
        const ring = gameState.player.equippedRings[ringIndex];
        gameState.player.inventory.push(ring);
        logEvent(`${t('unequipped')} ${ring.emoji} ${ring.name}`);
        gameState.player.equippedRings.splice(ringIndex, 1);
        updateInventoryUI();
        updateUI();
    }
}

function sellItem(index) {
    const item = gameState.player.inventory[index];
    if (!item) return;

    const sellPrice = item.sellValue || Math.floor(item.price * 0.6);
    gameState.player.gainMoney(sellPrice);
    gameState.player.inventory.splice(index, 1);
    logEvent(`${t('sold')} ${item.emoji} ${item.name} ${t('for')} ${sellPrice} ${t('coins')}!`);
    updateInventoryUI();
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
        <h2>💀 ${t('gameOver')}</h2>
        <p style="text-align: center; font-size: 1.2em; margin: 20px 0;">
            ${t('defeated')}
        </p>
        ${keptItem ? `
            <p style="text-align: center; margin: 20px 0;">
                ${t('keptItem')}: ${keptItem.emoji} ${keptItem.name}
            </p>
        ` : ''}
        <div class="modal-buttons">
            <button id="restart-btn" class="modal-btn primary">🔄 ${t('tryAgain')}</button>
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
            logEvent(`${t('startingWith')} ${item.emoji} ${item.name} ${t('fromPreviousRun')}`);
        } catch (e) {
            console.error('Error loading persisted item:', e);
        }
        localStorage.removeItem('persistedItem');
    }

    updateLanguageUI();
    renderBoard();
    updateUI();
    updateInventoryUI();
    logEvent(`🎮 ${t('gameRestarted')}`);
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

    updateLanguageUI();
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

    logEvent(`🎮 ${t('gameStarted')}`);
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
