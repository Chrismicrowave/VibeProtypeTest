// ========================================
// GAME STATE & CONSTANTS
// ========================================

const VERSION = 'v0.1.0';

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
    combatTurnInterval: 1050,   // Time between turns (75%)
    firstTurnDelay: 280,        // Delay before first turn (20% of interval)
    attackAnimation: 300,       // Attack animation duration
    hurtAnimation: 300,         // Hurt animation duration
    enemyHurtDelay: 200,        // Delay before enemy takes damage
    enemyTurnDelay: 400,        // Delay before enemy attacks
    playerHurtDelay: 200,       // Delay before player takes damage
    victoryDelay: 1000,         // Delay after victory before loot
    defeatDelay: 1000,          // Delay after defeat before game over
    skillEmojiDisplay: 500,     // Duration to show skill emoji over enemy
};

// Test Mode Configuration
const TEST_MODE = {
    enabled: false,             // Set to false for normal gameplay
    tileTypes: ['skillTrainer', 'combat'] // Only these tile types in test mode
};

// Combat Configuration
const CRIT_MULTIPLIER = 2.0;

// Round/Difficulty Scaling Configuration
const ROUND_SCALING = {
    1: { hp: 1.0, atk: 1.0, def: 1.0, gold: 1.0 },
    2: { hp: 1.15, atk: 1.1, def: 1.1, gold: 1.1 },
    3: { hp: 1.35, atk: 1.2, def: 1.2, gold: 1.2 },
    4: { hp: 1.55, atk: 1.35, def: 1.35, gold: 1.35 },
    5: { hp: 1.75, atk: 1.5, def: 1.5, gold: 1.5 }
};

// Get set multiplier: 1 + (set - 1) * 0.5
function getSetMultiplier(set) {
    return 1 + (set - 1) * 0.5;
}

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

// Skill Configuration
const SKILL_CONFIG = {
    HEALING: {
        name: 'Healing',
        emoji: '💚',
        type: 'instant',
        spCost: 15,
        baseValue: 50,          // 50% of max HP
        upgradeBonus: 10,       // +10% per level
        description: 'Heal % of max HP'
    },
    CLONE: {
        name: 'Clone',
        emoji: '👥',
        type: 'buff',
        spCost: 15,
        baseDuration: 3,        // 3 rounds
        upgradeBonus: 1,        // +1 round per level
        description: 'Summon clone to attack'
    },
    EXPLOSION: {
        name: 'Explosion',
        emoji: '💥',
        type: 'attack',
        spCost: 15,
        baseDamage: 50,         // Base damage
        upgradeBonus: 15,       // +15 damage per level
        description: 'Deal fixed damage'
    },
    SHELVES: {
        name: 'Shelves',
        emoji: '🛡️',
        type: 'buff',
        spCost: 15,
        baseDuration: 5,        // 5 rounds
        baseAbsorb: 75,         // Absorb up to 75 damage
        upgradeBonus: 20,       // +20 absorb per level
        description: 'Block all damage'
    }
};

const SKILL_TRAINER_PRICE = 100; // Base price to learn skill

// Language System
let currentLanguage = localStorage.getItem('gameLanguage') || 'en';

const TRANSLATIONS = {
    en: {
        title: 'VibingDiceGame',
        level: 'Level',
        bossesDefeated: 'Bosses Defeated',
        loop: 'Loop',
        round: 'Round',
        set: 'Set',
        supplyRound: 'Supply Round',
        supplyRoundMessage: 'Supply Round! Full HP/SP restored. Shop and treasure only!',
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
        criticalHit: 'Critical Hit!',
        lifeSteal: 'Life Steal',
        freeze: 'Freeze',
        poison: 'Poison',
        autoBlock: 'Auto Block',
        reflect: 'Reflect',
        frozen: 'is frozen!',
        frozenSkip: 'Enemy is frozen and skips turn!',
        poisoned: 'is poisoned!',
        poisonDamage: 'Poison deals',
        blocked: 'Blocked all damage!',
        reflected: 'Reflected',
        // Skills
        skillHealing: 'Healing',
        skillClone: 'Clone',
        skillExplosion: 'Explosion',
        skillShelves: 'Shelves',
        useSkill: 'Use Skill',
        notEnoughSP: 'Not enough SP!',
        noSkillEquipped: 'No skill equipped!',
        healedHP: 'Healed',
        cloneActivated: 'Clone summoned!',
        cloneAttacks: 'Clone attacks for',
        explosionDamage: 'Explosion deals',
        shelvesActivated: 'Shelves activated!',
        shelvesAbsorbed: 'Shelves absorbed',
        shelvesExpired: 'Shelves expired!',
        learnSkill: 'Learn Skill',
        upgradeSkill: 'Upgrade Skill',
        currentSkill: 'Current Skill',
        newSkill: 'New Skill',
        keepCurrent: 'Keep Current',
        skillLevel: 'Lv.',
        turns: 'turns',
        shop: 'Shop',
        yourMoney: 'Your Money',
        leaveShop: 'Leave Shop',
        treasure: 'Treasure',
        skillTrainer: 'Skill Trainer',
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
        title: 'Vibing骰子游戏',
        level: '等级',
        bossesDefeated: '已击败Boss',
        loop: '回合',
        round: '轮次',
        set: '阶段',
        supplyRound: '补给轮',
        supplyRoundMessage: '补给轮！生命和法力全部恢复。只有商店和宝箱！',
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
        criticalHit: '暴击！',
        lifeSteal: '吸血',
        freeze: '冰冻',
        poison: '中毒',
        autoBlock: '格挡',
        reflect: '反伤',
        frozen: '被冰冻了！',
        frozenSkip: '敌人冰冻，跳过回合！',
        poisoned: '中毒了！',
        poisonDamage: '毒素造成',
        blocked: '格挡了所有伤害！',
        reflected: '反弹了',
        // Skills
        skillHealing: '治愈',
        skillClone: '分身',
        skillExplosion: '爆炸',
        skillShelves: '护盾',
        useSkill: '使用技能',
        notEnoughSP: 'SP不足！',
        noSkillEquipped: '未装备技能！',
        healedHP: '恢复了',
        cloneActivated: '召唤分身！',
        cloneAttacks: '分身攻击造成',
        explosionDamage: '爆炸造成',
        shelvesActivated: '护盾激活！',
        shelvesAbsorbed: '护盾吸收了',
        shelvesExpired: '护盾消失！',
        learnSkill: '学习技能',
        upgradeSkill: '升级技能',
        currentSkill: '当前技能',
        newSkill: '新技能',
        keepCurrent: '保持当前',
        skillLevel: '等级',
        turns: '回合',
        shop: '商店',
        yourMoney: '你的金币',
        leaveShop: '离开商店',
        treasure: '宝箱',
        skillTrainer: '技能训练师',
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
    document.querySelector('header h1').textContent = `🎲 ${t('title')} ${VERSION}`;
    const roundDisplay = gameState.isSupplyRound ? t('supplyRound') : `${t('round')} ${gameState.round} / ${t('set')} ${gameState.set}`;
    document.getElementById('game-info').innerHTML = `
        <span>${t('level')}: <span id="level-display">${gameState.level}</span></span>
        <span>${t('bossesDefeated')}: <span id="bosses-display">${gameState.bossesDefeated}/3</span></span>
        <span><span id="round-display">${roundDisplay}</span></span>
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
    round: 1,  // Current round (1-5)
    set: 1,    // Current set (1+, increases after Supply Round)
    isSupplyRound: false, // True during Supply Round
    currentPhase: 'playing', // 'playing', 'combat', 'shop', 'gameOver', 'boss', 'supply'
    isRolling: false,
    currentEnemy: null, // Store current enemy for combat
    shopItems: [], // Store current shop items
    combatState: {
        enemyFrozen: false,
        enemyPoison: { active: false, percent: 0, turnsLeft: 0 },
        // Skill effects
        cloneActive: { active: false, turnsLeft: 0 },
        shelvesActive: { active: false, turnsLeft: 0, absorbLeft: 0 }
    }
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
        this.equippedSkill = null;  // { type: 'HEALING', level: 1 }
        this.passiveBuffs = [];
        this.persistedItem = null; // Item carried over from previous game
    }

    move(steps) {
        const oldPosition = this.position;
        this.position = (this.position + steps) % 32;

        // Note: Loop completion logic is now handled in movePlayer() function
        // This method is kept for position tracking only

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
        { name: 'Plate Armor', emoji: '🛡️', stats: { def: 10 }, price: 150 },
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
    const roundDisplayEl = document.getElementById('round-display');
    if (roundDisplayEl) {
        roundDisplayEl.textContent = gameState.isSupplyRound ? t('supplyRound') : `${t('round')} ${gameState.round} / ${t('set')} ${gameState.set}`;
    }

    // Update equipped skill display
    const activeSkillsList = document.getElementById('active-skills-list');
    if (activeSkillsList) {
        if (p.equippedSkill) {
            const config = SKILL_CONFIG[p.equippedSkill.type];
            activeSkillsList.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: linear-gradient(135deg, #667eea22, #764ba222); border-radius: 8px;">
                    <span style="font-size: 1.5em;">${config.emoji}</span>
                    <div>
                        <div style="font-weight: bold;">${config.name}</div>
                        <div style="font-size: 0.8em; color: #666;">${t('skillLevel')}${p.equippedSkill.level} | 15 SP</div>
                    </div>
                </div>
            `;
        } else {
            activeSkillsList.innerHTML = `<p class="empty-text">${t('noActiveSkills')}</p>`;
        }
    }
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
            weaponSlot.title = `${gameState.player.equippedWeapon.name}\n${formatItemStats(gameState.player.equippedWeapon)}`;
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
            armorSlot.title = `${gameState.player.equippedArmor.name}\n${formatItemStats(gameState.player.equippedArmor)}`;
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
            ringSlot.title = `${gameState.player.equippedRing.name}\n${formatItemStats(gameState.player.equippedRing)}`;
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

            // Check if completed a loop (32 tiles)
            if (startPosition + steps >= 32) {
                gameState.player.loops++;
                gameState.player.gainMoney(50);

                // Recover 30% of max HP and SP on loop completion
                const healAmount = Math.floor(gameState.player.stats.maxHp * 0.3);
                const spAmount = Math.floor(gameState.player.stats.maxSp * 0.3);
                gameState.player.heal(healAmount);
                gameState.player.stats.sp = Math.min(gameState.player.stats.sp + spAmount, gameState.player.stats.maxSp);

                // Check if this is a Supply Round loop completion
                if (gameState.isSupplyRound) {
                    // Supply Round completed - go to next set
                    gameState.isSupplyRound = false;
                    gameState.set++;
                    gameState.round = 1;
                    gameState.player.loops = 0;
                    gameState.board = generateBoard(); // Generate normal board
                    renderBoard();
                    logEvent(`🎉 ${t('set')} ${gameState.set} ${t('round')} 1!`);
                } else {
                    // Normal round progression
                    logEvent(`🎉 ${t('loopCompleted')} +${healAmount} HP, +${spAmount} SP! (${t('round')} ${gameState.round}/5)`);

                    // Check for round 5 -> Supply Round
                    if (gameState.round >= 5) {
                        gameState.player.loops = 0;
                        setTimeout(() => startSupplyRound(), TIMING.bossFightDelay);
                    } else {
                        // Increment round
                        gameState.round++;
                        gameState.player.loops = 0;
                        logEvent(`📈 ${t('round')} ${gameState.round} / ${t('set')} ${gameState.set}`);
                    }
                }
                updateUI();
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
            // Use round/set scaling for empty tile gold
            const roundScale = ROUND_SCALING[gameState.round] || ROUND_SCALING[5];
            const setMult = getSetMultiplier(gameState.set);
            const coins = Math.floor((8 + Math.random() * 16) * roundScale.gold * setMult);
            gameState.player.gainMoney(coins);
            logEvent(`${t('foundCoins')} ${coins} ${t('coins')}! 💰`);
            break;
    }
}

// ========================================
// ITEM STAT FORMATTING
// ========================================

function formatItemStats(item) {
    const parts = [];

    // Existing stat display
    if (item.stats.atk) parts.push(`⚔️ ${t('ATK')} +${item.stats.atk}`);
    if (item.stats.def) parts.push(`🛡️ ${t('DEF')} +${item.stats.def}`);
    if (item.stats.hp) parts.push(`❤️ ${t('HP')} +${item.stats.hp}`);
    if (item.stats.sp) parts.push(`💙 ${t('SP')} +${item.stats.sp}`);
    if (item.stats.crit) parts.push(`⚡ ${t('CRIT')} +${item.stats.crit}%`);
    if (item.special) parts.push(`✨ ${item.special.effect}`);

    // Add buff display
    if (item.buffs && item.buffs.length > 0) {
        item.buffs.forEach(buff => {
            let text = `${buff.emoji} ${buff.type} ${buff.value}%`;
            if (buff.duration) text += ` (${buff.duration}t)`;
            parts.push(text);
        });
    }

    return parts.join('<br>');
}

function formatBuffsOnly(item) {
    if (!item.buffs || item.buffs.length === 0) return '';

    const buffTexts = item.buffs.map(buff => {
        let text = `${buff.emoji} ${buff.value}%`;
        if (buff.duration) text += ` (${buff.duration}t)`;
        return text;
    });

    return buffTexts.join('<br>');
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

    // Use round/set scaling instead of level
    const roundScale = ROUND_SCALING[gameState.round] || ROUND_SCALING[5];
    const setMult = getSetMultiplier(gameState.set);

    return {
        name: type.name,
        emoji: type.emoji,
        hp: Math.floor(60 * type.hpMult * roundScale.hp * setMult),
        maxHp: Math.floor(60 * type.hpMult * roundScale.hp * setMult),
        atk: Math.floor(20 * type.atkMult * roundScale.atk * setMult),
        def: Math.floor(5 * roundScale.def * setMult)
    };
}

function getPlayerAttackBuffs() {
    const buffs = [];
    if (gameState.player.equippedWeapon?.buffs) {
        buffs.push(...gameState.player.equippedWeapon.buffs);
    }
    if (gameState.player.equippedRing?.buffs) {
        buffs.push(...gameState.player.equippedRing.buffs.filter(b =>
            BUFF_CONFIG[b.type]?.type === 'attack'
        ));
    }
    return buffs;
}

function getPlayerDefenseBuffs() {
    const buffs = [];
    if (gameState.player.equippedArmor?.buffs) {
        buffs.push(...gameState.player.equippedArmor.buffs);
    }
    return buffs;
}

function resetCombatState() {
    gameState.combatState = {
        enemyFrozen: false,
        enemyPoison: { active: false, percent: 0, turnsLeft: 0 },
        cloneActive: { active: false, turnsLeft: 0 },
        shelvesActive: { active: false, turnsLeft: 0, absorbLeft: 0 }
    };
}

function showCombatModal(enemy) {
    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    const skill = gameState.player.equippedSkill;
    const skillConfig = skill ? SKILL_CONFIG[skill.type] : null;
    const spCost = skillConfig ? skillConfig.spCost : 0;
    const skillBtnText = skill ? `${skillConfig.emoji} ${skillConfig.name} (${t('skillLevel')}${skill.level}) - ${spCost} SP` : t('noSkillEquipped');
    const skillBtnDisabled = !skill || gameState.player.stats.sp < spCost;

    content.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 10px;">⚔️ ${t('battleStart')} ⚔️</h2>

        <!-- Skill Button -->
        <div style="text-align: center; margin-bottom: 15px;">
            <button id="use-skill-btn" style="padding: 10px 20px; background: ${skillBtnDisabled ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)'}; color: white; border: none; border-radius: 8px; cursor: ${skillBtnDisabled ? 'not-allowed' : 'pointer'}; font-weight: bold; font-size: 1em;" ${skillBtnDisabled ? 'disabled' : ''}>
                ${skillBtnText}
            </button>
            <div style="font-size: 0.8em; color: #666; margin-top: 5px;">SP: ${gameState.player.stats.sp}/${gameState.player.stats.maxSp}</div>
        </div>

        <div class="combat-arena">
            <!-- Player Side -->
            <div class="combatant combatant-left" id="player-combatant">
                <div id="player-buffs" style="font-size: 1.2em; margin-bottom: 5px; min-height: 1.5em;"></div>
                <div class="combatant-name">${t('you')}</div>
                <div class="combatant-emoji" id="player-emoji">🤺</div>
                <div class="combatant-hp-container">
                    <div style="position: relative;">
                        <div id="combat-player-hp-bar" class="combatant-hp-bar" style="width: ${(gameState.player.stats.hp / gameState.player.stats.maxHp) * 100}%"></div>
                        <span id="combat-player-hp-text" class="combatant-hp-text">${gameState.player.stats.hp}/${gameState.player.stats.maxHp}</span>
                    </div>
                </div>
            </div>

            <!-- Enemy Side -->
            <div class="combatant combatant-right" id="enemy-combatant">
                <div id="enemy-debuffs" style="font-size: 1.2em; margin-bottom: 5px; min-height: 1.5em;"></div>
                <div class="combatant-name">${enemy.name}</div>
                <div class="combatant-emoji" id="enemy-emoji">${enemy.emoji}</div>
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

    function updateEnemyHpBar() {
        const enemyHpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
        document.getElementById('enemy-hp-bar').style.width = `${enemyHpPercent}%`;
        document.getElementById('enemy-hp-text').textContent = `${Math.max(0, enemy.hp)}/${enemy.maxHp}`;
    }

    function updatePlayerHpBar() {
        const playerHpPercent = (gameState.player.stats.hp / gameState.player.stats.maxHp) * 100;
        document.getElementById('combat-player-hp-bar').style.width = `${playerHpPercent}%`;
        document.getElementById('combat-player-hp-text').textContent =
            `${gameState.player.stats.hp}/${gameState.player.stats.maxHp}`;
    }

    function updateBuffDisplay() {
        const playerBuffs = document.getElementById('player-buffs');
        const enemyDebuffs = document.getElementById('enemy-debuffs');

        // Player buffs
        let playerBuffText = '';
        if (gameState.combatState.cloneActive.active) {
            playerBuffText += `👥${gameState.combatState.cloneActive.turnsLeft} `;
        }
        if (gameState.combatState.shelvesActive.active) {
            playerBuffText += `🛡️${gameState.combatState.shelvesActive.turnsLeft} `;
        }
        if (playerBuffs) playerBuffs.textContent = playerBuffText;

        // Enemy debuffs
        let enemyDebuffText = '';
        if (gameState.combatState.enemyFrozen) {
            enemyDebuffText += '❄️ ';
        }
        if (gameState.combatState.enemyPoison.active) {
            enemyDebuffText += `☠️${gameState.combatState.enemyPoison.turnsLeft} `;
        }
        if (enemyDebuffs) enemyDebuffs.textContent = enemyDebuffText;
    }

    function updateSkillButton() {
        const btn = document.getElementById('use-skill-btn');
        if (!btn) return;
        const skill = gameState.player.equippedSkill;
        const spCost = skill ? SKILL_CONFIG[skill.type].spCost : 0;
        const canUse = skill && gameState.player.stats.sp >= spCost;
        btn.disabled = !canUse;
        btn.style.background = canUse ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#ccc';
        btn.style.cursor = canUse ? 'pointer' : 'not-allowed';

        // Update SP display
        const spDisplay = btn.nextElementSibling;
        if (spDisplay) {
            spDisplay.textContent = `SP: ${gameState.player.stats.sp}/${gameState.player.stats.maxSp}`;
        }
    }

    function showSkillEmoji(emoji, target = 'enemy') {
        const emojiId = target === 'player' ? 'player-emoji' : 'enemy-emoji';
        const emojiEl = document.getElementById(emojiId);
        if (emojiEl) {
            const originalEmoji = emojiEl.textContent;
            emojiEl.textContent = emoji;
            setTimeout(() => {
                emojiEl.textContent = originalEmoji;
            }, TIMING.skillEmojiDisplay);
        }
    }

    function useSkill() {
        const skill = gameState.player.equippedSkill;
        const config = skill ? SKILL_CONFIG[skill.type] : null;
        if (!skill || !config || gameState.player.stats.sp < config.spCost) return;

        // Show skill emoji on correct target (attack=enemy, buff/heal=player)
        const target = config.type === 'attack' ? 'enemy' : 'player';
        showSkillEmoji(config.emoji, target);

        gameState.player.stats.sp -= config.spCost;

        switch (skill.type) {
            case 'HEALING':
                const healPercent = config.baseValue + (skill.level - 1) * config.upgradeBonus;
                const healAmount = Math.floor(gameState.player.stats.maxHp * healPercent / 100);
                gameState.player.heal(healAmount);
                addLog(`💚 ${t('healedHP')} ${healAmount} HP!`);
                updatePlayerHpBar();
                break;

            case 'CLONE':
                const cloneDuration = config.baseDuration + (skill.level - 1) * config.upgradeBonus;
                gameState.combatState.cloneActive = { active: true, turnsLeft: cloneDuration };
                addLog(`👥 ${t('cloneActivated')} (${cloneDuration} ${t('turns')})`);
                break;

            case 'EXPLOSION':
                const explosionDmg = config.baseDamage + (skill.level - 1) * config.upgradeBonus;
                enemy.hp -= explosionDmg;
                addLog(`💥 ${t('explosionDamage')} ${explosionDmg} ${t('damage')}!`);
                updateEnemyHpBar();
                if (enemy.hp <= 0) {
                    handleVictory();
                }
                break;

            case 'SHELVES':
                const shelvesDuration = config.baseDuration;
                const shelvesAbsorb = config.baseAbsorb + (skill.level - 1) * config.upgradeBonus;
                gameState.combatState.shelvesActive = { active: true, turnsLeft: shelvesDuration, absorbLeft: shelvesAbsorb };
                addLog(`🛡️ ${t('shelvesActivated')} (${shelvesAbsorb} HP, ${shelvesDuration} ${t('turns')})`);
                break;
        }

        updateSkillButton();
        updateBuffDisplay();
    }

    // Add skill button event listener
    const skillBtn = document.getElementById('use-skill-btn');
    if (skillBtn) {
        skillBtn.addEventListener('click', useSkill);
    }

    function handleVictory() {
        addLog(`🎉 ${t('victoryMsg')} ${t('defeatedEnemy')} ${enemy.name}!`);

        // Use round/set scaling for gold rewards
        const roundScale = ROUND_SCALING[gameState.round] || ROUND_SCALING[5];
        const setMult = getSetMultiplier(gameState.set);
        const reward = Math.floor((16 + Math.random() * 24) * roundScale.gold * setMult);
        gameState.player.gainMoney(reward);
        addLog(`💰 ${t('gained')} ${reward} ${t('coins')}!`);

        resetCombatState();

        setTimeout(() => {
            showLootModal();
        }, TIMING.victoryDelay);
    }

    function handleDefeat() {
        addLog(`💀 ${t('defeated')}`);

        resetCombatState();

        setTimeout(() => {
            closeModal();
            gameOver();
        }, TIMING.defeatDelay);
    }

    let turn = 0;
    let combatInterval = null;

    function executeTurn() {
        turn++;

        // ========== PLAYER TURN ==========
        // Player turn - Attack animation
        playerCombatant.classList.add('attacking-left');
        setTimeout(() => {
            playerCombatant.classList.remove('attacking-left');
        }, TIMING.attackAnimation);

        // Calculate base damage
        let playerDmg = Math.max(1, Math.floor(
            (gameState.player.getTotalAtk() - enemy.def) * (0.8 + Math.random() * 0.4)
        ));

        // Check for critical hit
        let isCrit = false;
        if (Math.random() * 100 < gameState.player.stats.crit) {
            playerDmg = Math.floor(playerDmg * CRIT_MULTIPLIER);
            isCrit = true;
        }

        // Enemy hurt animation
        setTimeout(() => {
            enemyCombatant.classList.add('hurt');
            enemy.hp -= playerDmg;

            if (isCrit) {
                addLog(`⚡ ${t('criticalHit')}`);
            }
            addLog(`🤺 ${t('dealtDamage')} ${playerDmg} ${t('damage')}!`);

            updateEnemyHpBar();

            setTimeout(() => {
                enemyCombatant.classList.remove('hurt');
            }, TIMING.hurtAnimation);

            // Process attack buffs
            const attackBuffs = getPlayerAttackBuffs();
            for (const buff of attackBuffs) {
                if (buff.type === 'LIFESTEAL') {
                    const heal = Math.floor(playerDmg * buff.value / 100);
                    gameState.player.heal(heal);
                    addLog(`🧛 ${t('lifeSteal')} +${heal} HP!`);
                    updatePlayerHpBar();
                } else if (buff.type === 'FREEZE') {
                    if (!gameState.combatState.enemyFrozen && Math.random() * 100 < buff.value) {
                        gameState.combatState.enemyFrozen = true;
                        addLog(`❄️ ${enemy.name} ${t('frozen')}`);
                    }
                } else if (buff.type === 'POISON') {
                    if (!gameState.combatState.enemyPoison.active && Math.random() * 100 < buff.value) {
                        gameState.combatState.enemyPoison = {
                            active: true,
                            percent: buff.value,
                            turnsLeft: 3
                        };
                        addLog(`☠️ ${enemy.name} ${t('poisoned')}`);
                    }
                }
            }

            // Clone attack (if active)
            if (gameState.combatState.cloneActive.active) {
                const cloneDmg = Math.max(1, Math.floor(
                    (gameState.player.getTotalAtk() - enemy.def) * (0.8 + Math.random() * 0.4)
                ));
                enemy.hp -= cloneDmg;
                addLog(`👥 ${t('cloneAttacks')} ${cloneDmg} ${t('damage')}!`);
                updateEnemyHpBar();

                // Decrement clone duration
                gameState.combatState.cloneActive.turnsLeft--;
                if (gameState.combatState.cloneActive.turnsLeft <= 0) {
                    gameState.combatState.cloneActive = { active: false, turnsLeft: 0 };
                }
                updateBuffDisplay();
            }

            // Check for enemy death after player attack
            if (enemy.hp <= 0) {
                clearInterval(combatInterval);
                handleVictory();
                return;
            }

            // ========== ENEMY TURN ==========
            setTimeout(() => {
                // Check if enemy is frozen
                if (gameState.combatState.enemyFrozen) {
                    addLog(`❄️ ${t('frozenSkip')}`);
                    gameState.combatState.enemyFrozen = false;
                    return; // Skip enemy turn
                }

                // Apply poison damage first
                if (gameState.combatState.enemyPoison.active) {
                    const poisonDmg = Math.floor(enemy.maxHp * gameState.combatState.enemyPoison.percent / 100);
                    enemy.hp -= poisonDmg;
                    gameState.combatState.enemyPoison.turnsLeft--;
                    addLog(`☠️ ${t('poisonDamage')} ${poisonDmg} ${t('damage')}!`);
                    updateEnemyHpBar();

                    // Check if poison expired
                    if (gameState.combatState.enemyPoison.turnsLeft <= 0) {
                        gameState.combatState.enemyPoison = { active: false, percent: 0, turnsLeft: 0 };
                    }

                    // Check for enemy death after poison
                    if (enemy.hp <= 0) {
                        clearInterval(combatInterval);
                        handleVictory();
                        return;
                    }
                }

                // Enemy attack animation
                enemyCombatant.classList.add('attacking-right');
                setTimeout(() => {
                    enemyCombatant.classList.remove('attacking-right');
                }, TIMING.attackAnimation);

                // Calculate enemy damage
                let enemyDmg = Math.max(1, Math.floor(
                    (enemy.atk - gameState.player.getTotalDef()) * (0.8 + Math.random() * 0.4)
                ));

                // Check player defense buffs
                const defenseBuffs = getPlayerDefenseBuffs();
                let blocked = false;
                let reflectDmg = 0;

                for (const buff of defenseBuffs) {
                    if (buff.type === 'AUTO_BLOCK') {
                        if (Math.random() * 100 < buff.value) {
                            blocked = true;
                            addLog(`🛡️ ${t('blocked')}`);
                            break;
                        }
                    } else if (buff.type === 'REFLECT') {
                        reflectDmg = Math.floor(enemyDmg * buff.value / 100);
                    }
                }

                // Player hurt animation
                setTimeout(() => {
                    if (!blocked) {
                        // Check shelves absorption first
                        if (gameState.combatState.shelvesActive.active) {
                            const absorbed = Math.min(enemyDmg, gameState.combatState.shelvesActive.absorbLeft);
                            gameState.combatState.shelvesActive.absorbLeft -= absorbed;
                            enemyDmg -= absorbed;
                            addLog(`🛡️ ${t('shelvesAbsorbed')} ${absorbed} ${t('damage')}!`);

                            // Decrement shelves duration
                            gameState.combatState.shelvesActive.turnsLeft--;
                            if (gameState.combatState.shelvesActive.turnsLeft <= 0 || gameState.combatState.shelvesActive.absorbLeft <= 0) {
                                gameState.combatState.shelvesActive = { active: false, turnsLeft: 0, absorbLeft: 0 };
                                addLog(`🛡️ ${t('shelvesExpired')}`);
                            }
                            updateBuffDisplay();
                        }

                        if (enemyDmg > 0) {
                            playerCombatant.classList.add('hurt');
                            gameState.player.takeDamage(enemyDmg);
                            addLog(`${enemy.emoji} ${enemy.name} ${t('enemyDealt')} ${enemyDmg} ${t('damage')}!`);

                            updatePlayerHpBar();

                            // Apply reflect damage to enemy
                            if (reflectDmg > 0) {
                                enemy.hp -= reflectDmg;
                                addLog(`↩️ ${t('reflected')} ${reflectDmg} ${t('damage')}!`);
                                updateEnemyHpBar();

                                // Check for enemy death after reflect
                                if (enemy.hp <= 0) {
                                    clearInterval(combatInterval);
                                    handleVictory();
                                    return;
                                }
                            }

                            setTimeout(() => {
                                playerCombatant.classList.remove('hurt');
                            }, TIMING.hurtAnimation);

                            if (gameState.player.stats.hp <= 0) {
                                clearInterval(combatInterval);
                                handleDefeat();
                            }
                        }
                    }
                }, TIMING.playerHurtDelay);
            }, TIMING.enemyTurnDelay);
        }, TIMING.enemyHurtDelay);
    }

    // First turn after short delay, then regular interval
    setTimeout(() => {
        executeTurn();
        combatInterval = setInterval(executeTurn, TIMING.combatTurnInterval);
    }, TIMING.firstTurnDelay);
}

function showLootModal(providedItems = null) {
    // Use provided items or generate random loot
    let lootItems;
    if (providedItems) {
        lootItems = providedItems;
    } else {
        // Generate 1-3 random items for combat - use round/set scaling
        const numItems = Math.floor(Math.random() * 3) + 1;
        const levelScale = 1 + (gameState.round - 1) * 0.2 + (gameState.set - 1) * 0.3;
        lootItems = [];
        for (let i = 0; i < numItems; i++) {
            const itemType = ['weapons', 'armor', 'potions', 'rings'][Math.floor(Math.random() * 4)];
            const item = createRandomItem(itemType, levelScale);
            lootItems.push(item);
        }
    }

    gameState.currentPhase = 'loot';

    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

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

    modal.classList.remove('hidden');
    renderLootUI();
}

// ========================================
// SHOP SYSTEM
// ========================================

function openShop() {
    gameState.currentPhase = 'shop';

    // Generate 3 random items - use round/set scaling
    const itemTypes = ['weapons', 'armor', 'potions', 'rings'];
    const levelScale = 1 + (gameState.round - 1) * 0.2 + (gameState.set - 1) * 0.3;
    gameState.shopItems = [];
    for (let i = 0; i < 3; i++) {
        const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        gameState.shopItems.push(createRandomItem(randomType, levelScale));
    }

    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

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
    // Use round/set scaling for treasure gold
    const roundScale = ROUND_SCALING[gameState.round] || ROUND_SCALING[5];
    const setMult = getSetMultiplier(gameState.set);
    const coins = Math.floor((24 + Math.random() * 40) * roundScale.gold * setMult);
    gameState.player.gainMoney(coins);
    logEvent(`💎 ${t('treasure')}: 💰 ${coins} ${t('coins')}`);
    updateUI();

    // 50% chance for item
    if (Math.random() < 0.5) {
        const itemType = ['weapons', 'armor', 'potions', 'rings'][Math.floor(Math.random() * 4)];
        const levelScale = 1 + (gameState.round - 1) * 0.2 + (gameState.set - 1) * 0.3;
        const item = createRandomItem(itemType, levelScale);
        // Show loot modal for the item
        showLootModal([item]);
    }
}

function openSkillTrainer() {
    gameState.currentPhase = 'skillTrainer';

    // Pick a random skill to offer
    const skillTypes = Object.keys(SKILL_CONFIG);
    const randomSkillType = skillTypes[Math.floor(Math.random() * skillTypes.length)];
    const skillConfig = SKILL_CONFIG[randomSkillType];

    // Calculate price (increases with level)
    const currentSkill = gameState.player.equippedSkill;
    const isUpgrade = currentSkill && currentSkill.type === randomSkillType;
    const newLevel = isUpgrade ? currentSkill.level + 1 : 1;
    const price = SKILL_TRAINER_PRICE * newLevel;

    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    // Build skill description with level info
    let skillValue = '';
    switch (randomSkillType) {
        case 'HEALING':
            skillValue = `${skillConfig.baseValue + (newLevel - 1) * skillConfig.upgradeBonus}% HP`;
            break;
        case 'CLONE':
            skillValue = `${skillConfig.baseDuration + (newLevel - 1) * skillConfig.upgradeBonus} turns`;
            break;
        case 'EXPLOSION':
            skillValue = `${skillConfig.baseDamage + (newLevel - 1) * skillConfig.upgradeBonus} damage`;
            break;
        case 'SHELVES':
            skillValue = `${skillConfig.baseAbsorb + (newLevel - 1) * skillConfig.upgradeBonus} absorb, ${skillConfig.baseDuration} turns`;
            break;
    }

    let currentSkillHTML = '';
    if (currentSkill) {
        const currentConfig = SKILL_CONFIG[currentSkill.type];
        // Calculate current skill value
        let currentSkillValue = '';
        switch (currentSkill.type) {
            case 'HEALING':
                currentSkillValue = `${currentConfig.baseValue + (currentSkill.level - 1) * currentConfig.upgradeBonus}% HP`;
                break;
            case 'CLONE':
                currentSkillValue = `${currentConfig.baseDuration + (currentSkill.level - 1) * currentConfig.upgradeBonus} turns`;
                break;
            case 'EXPLOSION':
                currentSkillValue = `${currentConfig.baseDamage + (currentSkill.level - 1) * currentConfig.upgradeBonus} damage`;
                break;
            case 'SHELVES':
                currentSkillValue = `${currentConfig.baseAbsorb + (currentSkill.level - 1) * currentConfig.upgradeBonus} absorb`;
                break;
        }
        currentSkillHTML = `
            <div style="flex: 1; text-align: center; background: #fff3cd; padding: 15px; border-radius: 8px; border: 2px solid #ffc107;">
                <div style="font-size: 0.8em; color: #856404; font-weight: bold; margin-bottom: 5px;">${t('currentSkill')}</div>
                <div style="font-size: 3em; margin-bottom: 5px;">${currentConfig.emoji}</div>
                <div style="font-weight: bold; color: #2c3e50;">${currentConfig.name} - ${currentSkillValue}</div>
                <div style="color: #666; font-size: 0.85em;">${t('skillLevel')}${currentSkill.level}</div>
            </div>
            <div style="display: flex; align-items: center; font-size: 2em; color: #667eea;">➡️</div>
        `;
    }

    content.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 20px;">⭐ ${t('skillTrainer')} ⭐</h2>
        <p style="text-align: center; color: #666; margin-bottom: 15px;">💰 ${t('yourMoney')}: ${gameState.player.stats.money}</p>

        <div style="display: flex; gap: 15px; justify-content: center; align-items: center; margin-bottom: 20px;">
            ${currentSkillHTML}
            <div style="flex: 1; text-align: center; background: #d1ecf1; padding: 15px; border-radius: 8px; border: 2px solid #17a2b8; max-width: 200px;">
                <div style="font-size: 0.8em; color: #0c5460; font-weight: bold; margin-bottom: 5px;">${isUpgrade ? t('upgradeSkill') : t('newSkill')}</div>
                <div style="font-size: 3em; margin-bottom: 5px;">${skillConfig.emoji}</div>
                <div style="font-weight: bold; color: #2c3e50;">${skillConfig.name} - ${skillValue}</div>
                <div style="color: #666; font-size: 0.85em;">${t('skillLevel')}${newLevel}</div>
                <div style="color: #e74c3c; font-weight: bold; margin-top: 5px;">💰 ${price}</div>
            </div>
        </div>

        <p style="text-align: center; color: #666; font-size: 0.85em; margin-bottom: 20px;">
            ${skillConfig.description}<br>
            SP Cost: 15
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px; max-width: 300px; margin: 0 auto;">
            <button id="learn-skill-btn" style="padding: 12px; background: ${gameState.player.stats.money >= price ? '#28a745' : '#ccc'}; color: white; border: none; border-radius: 8px; cursor: ${gameState.player.stats.money >= price ? 'pointer' : 'not-allowed'}; font-weight: bold; font-size: 1em;" ${gameState.player.stats.money < price ? 'disabled' : ''}>
                ${isUpgrade ? `⬆️ ${t('upgradeSkill')}` : `📚 ${t('learnSkill')}`} (💰${price})
            </button>
            ${currentSkill && !isUpgrade ? `
                <button id="keep-skill-btn" style="padding: 12px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 1em;">
                    ❌ ${t('keepCurrent')}
                </button>
            ` : ''}
            <button id="leave-trainer-btn" style="padding: 12px; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 1em;">
                🚪 ${t('leaveShop')}
            </button>
        </div>
    `;

    modal.classList.remove('hidden');

    // Event listeners
    document.getElementById('learn-skill-btn')?.addEventListener('click', () => {
        if (gameState.player.stats.money >= price) {
            gameState.player.stats.money -= price;
            gameState.player.equippedSkill = { type: randomSkillType, level: newLevel };
            logEvent(`⭐ ${isUpgrade ? t('upgradeSkill') : t('learnSkill')}: ${skillConfig.emoji} ${skillConfig.name} ${t('skillLevel')}${newLevel}`);
            updateUI();
            closeModal();
            gameState.currentPhase = 'playing';
        }
    });

    document.getElementById('keep-skill-btn')?.addEventListener('click', () => {
        closeModal();
        gameState.currentPhase = 'playing';
    });

    document.getElementById('leave-trainer-btn')?.addEventListener('click', () => {
        closeModal();
        gameState.currentPhase = 'playing';
    });
}

function startBossFight() {
    logEvent(`👹 ${t('bossFight')}`);
    // TODO: Implement boss fight
}

// ========================================
// SUPPLY ROUND SYSTEM
// ========================================

function generateSupplyBoard() {
    // Special board with only shop and treasure tiles
    const board = [];
    const supplyDistribution = [
        'shop', 'treasure', 'shop', 'treasure', 'shop', 'treasure', 'shop', 'treasure',
        'shop', 'treasure', 'shop', 'treasure', 'shop', 'treasure', 'shop', 'treasure',
        'shop', 'treasure', 'shop', 'treasure', 'shop', 'treasure', 'shop', 'treasure',
        'shop', 'treasure', 'shop', 'treasure', 'shop', 'treasure', 'shop', 'treasure'
    ];

    for (let i = 0; i < 32; i++) {
        const type = supplyDistribution[i];
        board.push({
            id: i,
            type: type,
            emoji: TILE_EMOJIS[type]
        });
    }

    return board;
}

function startSupplyRound() {
    gameState.isSupplyRound = true;
    gameState.currentPhase = 'playing';

    // Full HP and SP heal
    gameState.player.stats.hp = gameState.player.stats.maxHp;
    gameState.player.stats.sp = gameState.player.stats.maxSp;

    // Generate special supply board
    gameState.board = generateSupplyBoard();

    // Reset player position for the supply round
    gameState.player.position = 0;
    gameState.player.loops = 0;

    // Show supply round message
    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 20px;">🎁 ${t('supplyRound')} 🎁</h2>
        <div style="text-align: center; font-size: 4em; margin: 20px 0;">🏪💎🏪💎</div>
        <p style="text-align: center; font-size: 1.2em; margin: 20px 0; color: #28a745;">
            ${t('supplyRoundMessage')}
        </p>
        <div style="text-align: center; margin: 20px 0;">
            <div style="font-size: 1.1em; color: #667eea;">
                ❤️ HP: ${gameState.player.stats.hp}/${gameState.player.stats.maxHp} (Full!)<br>
                💙 SP: ${gameState.player.stats.sp}/${gameState.player.stats.maxSp} (Full!)
            </div>
        </div>
        <div class="modal-buttons">
            <button id="start-supply-btn" class="modal-btn primary">🎲 ${t('continueAdventure')}</button>
        </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('start-supply-btn').addEventListener('click', () => {
        closeModal();
        renderBoard();
        updateUI();

        // Re-attach event listener to center button after re-render
        const centerRollBtn = document.getElementById('center-roll-btn');
        if (centerRollBtn) {
            centerRollBtn.addEventListener('click', rollDice);
        }

        logEvent(`🎁 ${t('supplyRound')} - ${t('set')} ${gameState.set}`);
    });
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

// unequipRing removed - single ring slot, equipment only replaced via loot/shop

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
    gameState.round = 1;
    gameState.set = 1;
    gameState.isSupplyRound = false;
    gameState.isRolling = false;
    gameState.currentEnemy = null;
    gameState.shopItems = [];
    gameState.combatState = {
        enemyFrozen: false,
        enemyPoison: { active: false, percent: 0, turnsLeft: 0 },
        cloneActive: { active: false, turnsLeft: 0 },
        shelvesActive: { active: false, turnsLeft: 0, absorbLeft: 0 }
    };
    gameState.currentPhase = 'playing';
    gameState.board = generateBoard();

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

    // Re-attach event listener to center button after re-render
    const centerRollBtn = document.getElementById('center-roll-btn');
    if (centerRollBtn) {
        centerRollBtn.addEventListener('click', rollDice);
    }

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
