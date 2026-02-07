// ========================================
// GAME STATE & CONSTANTS
// ========================================

// Timing Configuration (in milliseconds)
// Adjust these values to change game speed
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

// Test Mode Configuration
const TEST_MODE = {
    enabled: true,              // Set to false for normal gameplay
    tileTypes: ['shop', 'combat'] // Only these tile types in test mode
};

// Combat Configuration
const CRIT_MULTIPLIER = 2.0;

// Buff Configuration
const BUFF_CONFIG = {
    LIFESTEAL: { type: 'attack', emoji: '🧛', minValue: 5, maxValue: 25 },
    FREEZE: { type: 'attack', emoji: '❄️', minValue: 10, maxValue: 30, duration: 1 },
    POISON: { type: 'attack', emoji: '☠️', minValue: 5, maxValue: 25, duration: 3 },
    AUTO_BLOCK: { type: 'defense', emoji: '🛡️', minValue: 5, maxValue: 20 },
    REFLECT: { type: 'defense', emoji: '↩️', minValue: 10, maxValue: 50 }
};

// Item buff rules: which buffs allowed per item type
const ITEM_BUFF_RULES = {
    weapon: { allowed: ['LIFESTEAL', 'FREEZE', 'POISON'], maxBuffs: 3 },
    armor: { allowed: ['AUTO_BLOCK', 'REFLECT'], maxBuffs: 3 },
    ring: { allowed: ['LIFESTEAL'], maxBuffs: 3 },
    potion: { allowed: [], maxBuffs: 0 }
};

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
        CRIT: 'CRIT',
        useNow: 'Use Now',
        addToInventory: 'Add to Inventory',
        clickToUse: 'Click to use',
        none: 'None',
        noRing: 'No ring',
        replace: 'Replace',
        buy: 'Buy',
        shopItem: 'Shop Item',
        buyAndReplace: 'Buy & Replace'
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
        CRIT: '暴击',
        useNow: '立即使用',
        addToInventory: '添加到背包',
        clickToUse: '点击使用',
        none: '无',
        noRing: '无戒指',
        replace: '替换',
        buy: '购买',
        shopItem: '商品',
        buyAndReplace: '购买并替换'
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
            crit: 5,
            money: 100
        };
        this.inventory = [];
        this.equippedWeapon = null;
        this.equippedArmor = null;
        this.equippedRing = null;
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
                setTimeout(() => startBossFight(), TIMING.bossFightDelay);
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
        this.buffs = [];  // Array for combat buffs
        this.price = price;
        this.sellValue = Math.floor(price * 0.6);
    }
}

function generateItemBuffs(itemType, levelScale = 1) {
    const rules = ITEM_BUFF_RULES[itemType];
    if (!rules || rules.maxBuffs === 0) return [];

    const buffs = [];
    const numBuffs = Math.floor(Math.random() * (rules.maxBuffs + 1)); // 0 to maxBuffs
    const availableBuffs = [...rules.allowed];

    for (let i = 0; i < numBuffs && availableBuffs.length > 0; i++) {
        const buffIndex = Math.floor(Math.random() * availableBuffs.length);
        const buffType = availableBuffs.splice(buffIndex, 1)[0];
        const config = BUFF_CONFIG[buffType];

        const baseValue = config.minValue + Math.random() * (config.maxValue - config.minValue);
        const scaledValue = Math.min(config.maxValue, Math.floor(baseValue * (0.8 + levelScale * 0.2)));

        buffs.push({
            type: buffType,
            emoji: config.emoji,
            value: scaledValue,
            duration: config.duration || 0
        });
    }

    return buffs;
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
        { name: 'Lucky Ring', emoji: '💍', stats: { crit: 5 }, price: 100 },
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

    const item = new Item(
        category.slice(0, -1), // Remove 's' from category name
        template.name,
        template.emoji,
        scaledStats,
        template.special,
        Math.floor(template.price * levelScale)
    );

    // Generate buffs for the item based on its type
    item.buffs = generateItemBuffs(item.type, levelScale);

    return item;
}

// ========================================
// BOARD GENERATION
// ========================================

function generateBoard() {
    const board = [];

    if (TEST_MODE.enabled) {
        // TEST MODE: Only specified tile types
        for (let i = 0; i < 32; i++) {
            const type = TEST_MODE.tileTypes[i % TEST_MODE.tileTypes.length];
            board.push({
                id: i,
                type: type,
                emoji: TILE_EMOJIS[type]
            });
        }
    } else {
        // NORMAL MODE: Standard distribution
        const tileDistribution = [
            'shop', 'combat', 'empty', 'combat', 'treasure', 'combat', 'empty', 'combat',
            'shop', 'combat', 'skillTrainer', 'combat', 'empty', 'combat', 'treasure', 'combat',
            'shop', 'combat', 'empty', 'combat', 'treasure', 'combat', 'empty', 'combat',
            'shop', 'combat', 'skillTrainer', 'combat', 'empty', 'combat', 'treasure', 'combat'
        ];
        for (let i = 0; i < 32; i++) {
            const type = tileDistribution[i];
            board.push({
                id: i,
                type: type,
                emoji: TILE_EMOJIS[type]
            });
        }
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
    document.getElementById('crit-value').textContent = p.stats.crit;
    document.getElementById('money-value').textContent = p.stats.money;

    // Update game info
    document.getElementById('level-display').textContent = gameState.level;
    document.getElementById('bosses-display').textContent = `${gameState.bossesDefeated}/3`;
    document.getElementById('loop-display').textContent = `${p.loops}/5`;
}

function updateInventoryUI() {
    // Update inventory items (potions only)
    const inventoryDiv = document.getElementById('inventory-items');
    if (inventoryDiv) {
        inventoryDiv.innerHTML = '';

        if (gameState.player.inventory.length === 0) {
            inventoryDiv.innerHTML = `<p class="empty-text">${t('noItems')}</p>`;
        } else {
            gameState.player.inventory.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = `item ${item.type}`;
                itemDiv.textContent = item.emoji;
                itemDiv.title = `${item.name}\n${t('clickToUse')}`;
                itemDiv.onclick = () => useItem(index);
                inventoryDiv.appendChild(itemDiv);
            });
        }
    }

    // Update equipped items display (view only)
    const weaponSlot = document.getElementById('equipped-weapon');
    if (weaponSlot) {
        if (gameState.player.equippedWeapon) {
            weaponSlot.textContent = gameState.player.equippedWeapon.emoji;
            weaponSlot.title = gameState.player.equippedWeapon.name;
            weaponSlot.style.fontSize = '';
            weaponSlot.style.color = '';
        } else {
            weaponSlot.textContent = t('noWeapon');
            weaponSlot.style.fontSize = '0.7em';
            weaponSlot.style.color = '#999';
        }
    }

    const armorSlot = document.getElementById('equipped-armor');
    if (armorSlot) {
        if (gameState.player.equippedArmor) {
            armorSlot.textContent = gameState.player.equippedArmor.emoji;
            armorSlot.title = gameState.player.equippedArmor.name;
            armorSlot.style.fontSize = '';
            armorSlot.style.color = '';
        } else {
            armorSlot.textContent = t('noArmor');
            armorSlot.style.fontSize = '0.7em';
            armorSlot.style.color = '#999';
        }
    }

    const ringSlot = document.getElementById('equipped-rings');
    if (ringSlot) {
        if (gameState.player.equippedRing) {
            ringSlot.textContent = gameState.player.equippedRing.emoji;
            ringSlot.title = gameState.player.equippedRing.name;
            ringSlot.style.fontSize = '';
            ringSlot.style.color = '';
        } else {
            ringSlot.textContent = t('noRing');
            ringSlot.style.fontSize = '0.7em';
            ringSlot.style.color = '#999';
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
            }, TIMING.diceResultDelay);
        }
    }, TIMING.diceRollInterval);
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
                    setTimeout(() => startBossFight(), TIMING.bossFightDelay);
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
            }, TIMING.tileLandingDelay);
        }
    }, TIMING.moveStepInterval);
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
    }, TIMING.combatStartDelay);
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
        }, TIMING.attackAnimation);

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
            }, TIMING.hurtAnimation);

            if (enemy.hp <= 0) {
                clearInterval(combatInterval);
                addLog(`🎉 ${t('victoryMsg')} ${t('defeatedEnemy')} ${enemy.name}!`);

                const reward = Math.floor((20 + Math.random() * 30) * gameState.level);
                gameState.player.gainMoney(reward);
                addLog(`💰 ${t('gained')} ${reward} ${t('coins')}!`);

                setTimeout(() => {
                    showLootModal();
                }, TIMING.victoryDelay);
                return;
            }

            // Enemy turn - Attack animation after player's turn
            setTimeout(() => {
                enemyCombatant.classList.add('attacking-right');
                setTimeout(() => {
                    enemyCombatant.classList.remove('attacking-right');
                }, TIMING.attackAnimation);

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
                    }, TIMING.hurtAnimation);

                    if (gameState.player.stats.hp <= 0) {
                        clearInterval(combatInterval);
                        addLog(`💀 ${t('defeated')}`);

                        setTimeout(() => {
                            closeModal();
                            gameOver();
                        }, TIMING.defeatDelay);
                    }
                }, TIMING.playerHurtDelay);
            }, TIMING.enemyTurnDelay);
        }, TIMING.enemyHurtDelay);

    }, TIMING.combatTurnInterval);
}

function showLootModal(providedItems = null) {
    // Use provided items or generate random loot
    let lootItems;
    if (providedItems) {
        lootItems = providedItems;
    } else {
        // Generate 1-3 random items for combat
        const numItems = Math.floor(Math.random() * 3) + 1;
        lootItems = [];
        for (let i = 0; i < numItems; i++) {
            const itemType = ['weapons', 'armor', 'potions', 'rings'][Math.floor(Math.random() * 4)];
            const item = createRandomItem(itemType, 1 + gameState.level * 0.2);
            lootItems.push(item);
        }
    }

    gameState.currentPhase = 'loot';

    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    function formatItemStats(item) {
        const parts = [];
        if (item.stats.atk) parts.push(`⚔️ ${t('ATK')} +${item.stats.atk}`);
        if (item.stats.def) parts.push(`🛡️ ${t('DEF')} +${item.stats.def}`);
        if (item.stats.hp) parts.push(`❤️ ${t('HP')} +${item.stats.hp}`);
        if (item.stats.sp) parts.push(`💙 ${t('SP')} +${item.stats.sp}`);
        if (item.stats.crit) parts.push(`⚡ ${t('CRIT')} +${item.stats.crit}`);
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

            // For potions - Use now or Add to inventory
            if (item.type === 'potion') {
                return `
                    <div class="loot-item-${idx}" style="display: inline-block; margin: 10px; padding: 15px; border: 3px solid #2ecc71; border-radius: 10px; min-width: 180px; background: #f8f9fa;">
                        <div style="font-size: 3em; margin-bottom: 5px;">${item.emoji}</div>
                        <div style="font-weight: bold; margin-bottom: 5px; color: #2c3e50;">${item.name}</div>
                        <div style="color: #666; font-size: 0.85em; margin-bottom: 10px;">${formatItemStats(item)}</div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <button class="loot-use-btn-${idx}" style="padding: 8px; background: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                                🧪 ${t('useNow')}
                            </button>
                            <button class="loot-keep-btn-${idx}" style="padding: 8px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                                🎒 ${t('addToInventory')}
                            </button>
                        </div>
                    </div>
                `;
            }

            // For weapons, armor - always show comparison
            if (item.type === 'weapon' || item.type === 'armor') {
                const hasEquipped = currentEquipped !== null;
                return `
                    <div class="loot-item-${idx}" style="display: inline-block; margin: 10px; padding: 15px; border: 3px solid #667eea; border-radius: 10px; min-width: 300px; background: #f8f9fa;">
                        <h4 style="text-align: center; color: #667eea; margin-bottom: 10px;">📊 ${t('comparison')}</h4>
                        <div style="display: flex; gap: 15px; margin-bottom: 10px;">
                            <!-- Current Equipped -->
                            <div style="flex: 1; text-align: center; background: ${hasEquipped ? '#fff3cd' : '#f5f5f5'}; padding: 10px; border-radius: 8px; border: 2px solid ${hasEquipped ? '#ffc107' : '#ddd'};">
                                <div style="font-size: 0.75em; color: ${hasEquipped ? '#856404' : '#999'}; font-weight: bold; margin-bottom: 5px;">${t('currentEquipped')}</div>
                                <div style="font-size: 2em; margin-bottom: 5px;">${hasEquipped ? currentEquipped.emoji : '❌'}</div>
                                <div style="font-weight: bold; font-size: 0.85em; color: #2c3e50;">${hasEquipped ? currentEquipped.name : t('none')}</div>
                                ${hasEquipped ? `<div style="color: #666; font-size: 0.75em; margin-top: 5px;">${formatItemStats(currentEquipped)}</div>` : ''}
                                ${hasEquipped ? `<div style="color: #f39c12; font-weight: bold; font-size: 0.85em; margin-top: 5px;">💰 ${currentEquipped.sellValue || Math.floor(currentEquipped.price * 0.6)}</div>` : ''}
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
                                ✅ ${hasEquipped ? t('equipNewSellOld') : t('equip')}
                            </button>
                            <button class="loot-sell-btn-${idx}" style="padding: 10px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 0.9em;">
                                ${hasEquipped ? `❌ ${t('keepOldSellNew')}` : `💰 ${t('sell')} (${sellPrice})`}
                            </button>
                        </div>
                    </div>
                `;
            }

            // For rings - same comparison as weapon/armor (single slot)
            if (item.type === 'ring') {
                const currentRing = gameState.player.equippedRing;
                return `
                    <div class="loot-item-${idx}" style="display: inline-block; margin: 10px; padding: 15px; border: 3px solid #f39c12; border-radius: 10px; min-width: 300px; background: #f8f9fa;">
                        <h4 style="text-align: center; color: #f39c12; margin-bottom: 10px;">💍 ${t('comparison')}</h4>
                        <div style="display: flex; gap: 15px; margin-bottom: 10px;">
                            <!-- Current Equipped -->
                            <div style="flex: 1; text-align: center; background: ${currentRing ? '#fff3cd' : '#f5f5f5'}; padding: 10px; border-radius: 8px; border: 2px solid ${currentRing ? '#ffc107' : '#ddd'};">
                                <div style="font-size: 0.75em; color: ${currentRing ? '#856404' : '#999'}; font-weight: bold; margin-bottom: 5px;">${t('currentEquipped')}</div>
                                <div style="font-size: 2em; margin-bottom: 5px;">${currentRing ? currentRing.emoji : '❌'}</div>
                                <div style="font-weight: bold; font-size: 0.85em; color: #2c3e50;">${currentRing ? currentRing.name : t('none')}</div>
                                ${currentRing ? `<div style="color: #666; font-size: 0.75em; margin-top: 5px;">${formatItemStats(currentRing)}</div>` : ''}
                                ${currentRing ? `<div style="color: #f39c12; font-weight: bold; font-size: 0.85em; margin-top: 5px;">💰 ${currentRing.sellValue || Math.floor(currentRing.price * 0.6)}</div>` : ''}
                            </div>
                            <!-- Arrow -->
                            <div style="display: flex; align-items: center; font-size: 2em; color: #f39c12;">➡️</div>
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
                                ✅ ${currentRing ? t('equipNewSellOld') : t('equip')}
                            </button>
                            <button class="loot-sell-btn-${idx}" style="padding: 10px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 0.9em;">
                                ${currentRing ? `❌ ${t('keepOldSellNew')}` : `💰 ${t('sell')} (${sellPrice})`}
                            </button>
                        </div>
                    </div>
                `;
            }

            return '';
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

            // Potion: Use Now button
            const useBtn = content.querySelector(`.loot-use-btn-${idx}`);
            if (useBtn) {
                useBtn.addEventListener('click', () => {
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
                    lootItems[idx] = null;
                    updateUI();
                    renderLootUI();
                });
            }

            // Potion: Add to Inventory button
            const keepBtn = content.querySelector(`.loot-keep-btn-${idx}`);
            if (keepBtn) {
                keepBtn.addEventListener('click', () => {
                    gameState.player.inventory.push(item);
                    logEvent(`${t('addedToInventory')} ${item.emoji} ${item.name}`);
                    lootItems[idx] = null;
                    updateInventoryUI();
                    renderLootUI();
                });
            }

            // Equipment: Equip button (weapon/armor/ring)
            const equipBtn = content.querySelector(`.loot-equip-btn-${idx}`);
            if (equipBtn) {
                equipBtn.addEventListener('click', () => {
                    if (item.type === 'weapon') {
                        if (gameState.player.equippedWeapon) {
                            const oldItem = gameState.player.equippedWeapon;
                            const oldSellPrice = oldItem.sellValue || Math.floor(oldItem.price * 0.6);
                            gameState.player.gainMoney(oldSellPrice);
                            logEvent(`${t('sold')} ${oldItem.emoji} ${oldItem.name} ${t('for')} ${oldSellPrice} ${t('coins')}`);
                        }
                        gameState.player.equippedWeapon = item;
                        logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
                    } else if (item.type === 'armor') {
                        if (gameState.player.equippedArmor) {
                            const oldItem = gameState.player.equippedArmor;
                            const oldSellPrice = oldItem.sellValue || Math.floor(oldItem.price * 0.6);
                            gameState.player.gainMoney(oldSellPrice);
                            logEvent(`${t('sold')} ${oldItem.emoji} ${oldItem.name} ${t('for')} ${oldSellPrice} ${t('coins')}`);
                        }
                        gameState.player.equippedArmor = item;
                        logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
                    } else if (item.type === 'ring') {
                        if (gameState.player.equippedRing) {
                            const oldItem = gameState.player.equippedRing;
                            const oldSellPrice = oldItem.sellValue || Math.floor(oldItem.price * 0.6);
                            gameState.player.gainMoney(oldSellPrice);
                            logEvent(`${t('sold')} ${oldItem.emoji} ${oldItem.name} ${t('for')} ${oldSellPrice} ${t('coins')}`);
                        }
                        gameState.player.equippedRing = item;
                        logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
                    }
                    lootItems[idx] = null;
                    updateUI();
                    updateInventoryUI();
                    renderLootUI();
                });
            }

            // Equipment: Sell button (keep current, sell new)
            const sellBtn = content.querySelector(`.loot-sell-btn-${idx}`);
            if (sellBtn) {
                sellBtn.addEventListener('click', () => {
                    const sellPrice = item.sellValue || Math.floor(item.price * 0.6);
                    gameState.player.gainMoney(sellPrice);
                    logEvent(`${t('sold')} ${item.emoji} ${item.name} ${t('for')} ${sellPrice} ${t('coins')}`);
                    lootItems[idx] = null;
                    updateUI();
                    renderLootUI();
                });
            }

        });

        // Add event listener for close button
        const closeBtn = content.querySelector('#close-loot-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                // Add any remaining POTIONS to inventory (equipment must be decided)
                lootItems.forEach(item => {
                    if (item && item.type === 'potion') {
                        gameState.player.inventory.push(item);
                        logEvent(`${t('addedToInventory')} ${item.emoji} ${item.name}`);
                    } else if (item) {
                        // Auto-sell unclaimed equipment
                        const sellPrice = item.sellValue || Math.floor(item.price * 0.6);
                        gameState.player.gainMoney(sellPrice);
                        logEvent(`${t('sold')} ${item.emoji} ${item.name} ${t('for')} ${sellPrice} ${t('coins')}`);
                    }
                });
                updateInventoryUI();
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

    // Generate 3 random items
    const itemTypes = ['weapons', 'armor', 'potions', 'rings'];
    gameState.shopItems = [];
    for (let i = 0; i < 3; i++) {
        const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        gameState.shopItems.push(createRandomItem(randomType, 1 + gameState.level * 0.3));
    }

    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    function formatItemStats(item) {
        const parts = [];
        if (item.stats.atk) parts.push(`⚔️ ATK +${item.stats.atk}`);
        if (item.stats.def) parts.push(`🛡️ DEF +${item.stats.def}`);
        if (item.stats.hp) parts.push(`❤️ HP +${item.stats.hp}`);
        if (item.stats.sp) parts.push(`💙 SP +${item.stats.sp}`);
        if (item.stats.crit) parts.push(`⚡ CRIT +${item.stats.crit}`);
        if (item.special) parts.push(`✨ ${item.special.effect}`);
        return parts.join(' | ');
    }

    function getCurrentEquipped(type) {
        if (type === 'weapon') return gameState.player.equippedWeapon;
        if (type === 'armor') return gameState.player.equippedArmor;
        if (type === 'ring') return gameState.player.equippedRing;
        return null;
    }

    function renderShop() {
        const playerMoney = gameState.player.stats.money;

        let itemsHTML = gameState.shopItems.map((item, idx) => {
            if (!item) return ''; // Item was bought

            const canAfford = playerMoney >= item.price;
            const currentEquipped = getCurrentEquipped(item.type);

            // For potions - simple card
            if (item.type === 'potion') {
                return `
                    <div class="shop-item-${idx}" style="display: inline-block; margin: 10px; padding: 15px; border: 3px solid #2ecc71; border-radius: 10px; min-width: 180px; background: #f8f9fa;">
                        <div style="font-size: 3em; margin-bottom: 5px;">${item.emoji}</div>
                        <div style="font-weight: bold; margin-bottom: 5px; color: #2c3e50;">${item.name}</div>
                        <div style="color: #666; font-size: 0.85em; margin-bottom: 10px;">${formatItemStats(item)}</div>
                        <div style="color: #f39c12; font-weight: bold; margin-bottom: 10px;">💰 ${item.price}</div>
                        <button class="shop-buy-btn-${idx}" style="padding: 8px 15px; background: ${canAfford ? '#2ecc71' : '#ccc'}; color: white; border: none; border-radius: 5px; cursor: ${canAfford ? 'pointer' : 'not-allowed'}; font-weight: bold;" ${canAfford ? '' : 'disabled'}>
                            🛒 ${t('buy')}
                        </button>
                    </div>
                `;
            }

            // For equipment - comparison card
            const borderColor = item.type === 'weapon' ? '#e74c3c' : item.type === 'armor' ? '#3498db' : '#f39c12';
            return `
                <div class="shop-item-${idx}" style="display: inline-block; margin: 10px; padding: 15px; border: 3px solid ${borderColor}; border-radius: 10px; min-width: 300px; background: #f8f9fa;">
                    <h4 style="text-align: center; color: ${borderColor}; margin-bottom: 10px;">📊 ${t('comparison')}</h4>
                    <div style="display: flex; gap: 15px; margin-bottom: 10px;">
                        <!-- Current Equipped -->
                        <div style="flex: 1; text-align: center; background: ${currentEquipped ? '#fff3cd' : '#f5f5f5'}; padding: 10px; border-radius: 8px; border: 2px solid ${currentEquipped ? '#ffc107' : '#ddd'};">
                            <div style="font-size: 0.75em; color: ${currentEquipped ? '#856404' : '#999'}; font-weight: bold; margin-bottom: 5px;">${t('currentEquipped')}</div>
                            <div style="font-size: 2em; margin-bottom: 5px;">${currentEquipped ? currentEquipped.emoji : '❌'}</div>
                            <div style="font-weight: bold; font-size: 0.85em; color: #2c3e50;">${currentEquipped ? currentEquipped.name : t('none')}</div>
                            ${currentEquipped ? `<div style="color: #666; font-size: 0.75em; margin-top: 5px;">${formatItemStats(currentEquipped)}</div>` : ''}
                            ${currentEquipped ? `<div style="color: #f39c12; font-weight: bold; font-size: 0.85em; margin-top: 5px;">💰 ${currentEquipped.sellValue || Math.floor(currentEquipped.price * 0.6)}</div>` : ''}
                        </div>
                        <!-- Arrow -->
                        <div style="display: flex; align-items: center; font-size: 2em; color: ${borderColor};">➡️</div>
                        <!-- New Item -->
                        <div style="flex: 1; text-align: center; background: #d1ecf1; padding: 10px; border-radius: 8px; border: 2px solid #17a2b8;">
                            <div style="font-size: 0.75em; color: #0c5460; font-weight: bold; margin-bottom: 5px;">${t('shopItem')}</div>
                            <div style="font-size: 2em; margin-bottom: 5px;">${item.emoji}</div>
                            <div style="font-weight: bold; font-size: 0.85em; color: #2c3e50;">${item.name}</div>
                            <div style="color: #666; font-size: 0.75em; margin-top: 5px;">${formatItemStats(item)}</div>
                            <div style="color: #e74c3c; font-weight: bold; font-size: 0.85em; margin-top: 5px;">💰 ${item.price}</div>
                        </div>
                    </div>
                    <button class="shop-buy-btn-${idx}" style="width: 100%; padding: 10px; background: ${canAfford ? '#28a745' : '#ccc'}; color: white; border: none; border-radius: 5px; cursor: ${canAfford ? 'pointer' : 'not-allowed'}; font-weight: bold; font-size: 0.9em;" ${canAfford ? '' : 'disabled'}>
                        ${canAfford ? `🛒 ${currentEquipped ? t('buyAndReplace') : t('buy')}` : t('notEnoughMoney')}
                    </button>
                </div>
            `;
        }).join('');

        content.innerHTML = `
            <h2>🏪 ${t('shop')}</h2>
            <div style="text-align: center; margin-bottom: 20px;">
                <strong style="font-size: 1.2em;">${t('yourMoney')}: 💰 <span id="shop-money">${playerMoney}</span></strong>
            </div>
            <div style="text-align: center; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                ${itemsHTML}
            </div>
            <div class="modal-buttons">
                <button id="leave-shop-btn" class="modal-btn secondary">${t('leaveShop')}</button>
            </div>
        `;

        // Add event listeners for buy buttons
        gameState.shopItems.forEach((item, idx) => {
            if (!item) return;
            const buyBtn = content.querySelector(`.shop-buy-btn-${idx}`);
            if (buyBtn && !buyBtn.disabled) {
                buyBtn.addEventListener('click', () => {
                    buyItem(idx);
                    renderShop(); // Re-render to update money and remove bought item
                });
            }
        });

        // Add event listener for leave button
        document.getElementById('leave-shop-btn').addEventListener('click', () => {
            closeModal();
            gameState.currentPhase = 'playing';
        });
    }

    modal.classList.remove('hidden');
    renderShop();
}

function buyItem(index) {
    const item = gameState.shopItems[index];
    if (!item) return;

    if (!gameState.player.spendMoney(item.price)) {
        return;
    }

    logEvent(`${t('bought')} ${item.emoji} ${item.name} ${t('for')} ${item.price} ${t('coins')}!`);

    // Handle based on item type
    if (item.type === 'potion') {
        gameState.player.inventory.push(item);
        logEvent(`${t('addedToInventory')} ${item.emoji} ${item.name}`);
    } else if (item.type === 'weapon') {
        if (gameState.player.equippedWeapon) {
            const oldItem = gameState.player.equippedWeapon;
            const oldSellPrice = oldItem.sellValue || Math.floor(oldItem.price * 0.6);
            gameState.player.gainMoney(oldSellPrice);
            logEvent(`${t('sold')} ${oldItem.emoji} ${oldItem.name} ${t('for')} ${oldSellPrice} ${t('coins')}`);
        }
        gameState.player.equippedWeapon = item;
        logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
    } else if (item.type === 'armor') {
        if (gameState.player.equippedArmor) {
            const oldItem = gameState.player.equippedArmor;
            const oldSellPrice = oldItem.sellValue || Math.floor(oldItem.price * 0.6);
            gameState.player.gainMoney(oldSellPrice);
            logEvent(`${t('sold')} ${oldItem.emoji} ${oldItem.name} ${t('for')} ${oldSellPrice} ${t('coins')}`);
        }
        gameState.player.equippedArmor = item;
        logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
    } else if (item.type === 'ring') {
        if (gameState.player.equippedRing) {
            const oldRing = gameState.player.equippedRing;
            const oldSellPrice = oldRing.sellValue || Math.floor(oldRing.price * 0.6);
            gameState.player.gainMoney(oldSellPrice);
            logEvent(`${t('sold')} ${oldRing.emoji} ${oldRing.name} ${t('for')} ${oldSellPrice} ${t('coins')}`);
        }
        gameState.player.equippedRing = item;
        logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
    }

    // Mark item as bought
    gameState.shopItems[index] = null;
    updateUI();
    updateInventoryUI();
}

// ========================================
// TREASURE & SKILL TRAINER
// ========================================

function openTreasure() {
    const coins = Math.floor((30 + Math.random() * 50) * gameState.level);
    gameState.player.gainMoney(coins);
    logEvent(`💎 ${t('treasure')}: 💰 ${coins} ${t('coins')}`);
    updateUI();

    // 50% chance for item
    if (Math.random() < 0.5) {
        const itemType = ['weapons', 'armor', 'potions', 'rings'][Math.floor(Math.random() * 4)];
        const item = createRandomItem(itemType, 1 + gameState.level * 0.3);
        // Show loot modal for the item
        showLootModal([item]);
    }
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

    // Inventory only contains potions now
    if (item.type === 'potion') {
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
