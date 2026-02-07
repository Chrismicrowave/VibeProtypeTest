// ========================================
// LANGUAGE & TRANSLATIONS SYSTEM
// ========================================

import { VERSION } from './config.js';
import { gameState } from './state.js';

export let currentLanguage = localStorage.getItem('gameLanguage') || 'en';

export const TRANSLATIONS = {
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
        loopCompleted: 'Loop completed! Bonus +25 coins',
        setBonus: 'Set Complete Bonus',
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
        skillRevive: 'Revive',
        skillDescHealing: 'Heal % of max HP',
        skillDescClone: 'Summon clone to attack',
        skillDescExplosion: 'Deal fixed damage',
        skillDescShelves: 'Block all damage',
        skillDescRevive: 'Auto-revive on death',
        reviveTriggered: 'Revive triggered! Restored',
        reviveCooldown: 'Revive cooldown',
        rounds: 'rounds',
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
        continueAdventure: 'Sell All Items & Continue',
        continueOnly: 'Continue Adventure',
        allItemsCollected: 'All items collected!',
        addedToInventory: 'Added',
        toInventory: 'to inventory',
        ringSlotsFull: 'ring slot full',
        leftClick: 'Left click: Equip/Use',
        rightClick: 'Right click: Sell for',
        clickToUnequip: 'Click to unequip',
        noWeapon: 'No weapon',
        noArmor: 'No armor',
        sellConfirm: 'Sell',
        ringsMax: 'You can only equip 1 ring!',
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
        buyAndReplace: 'Buy & Replace',
        hpPotion: 'HP Potion',
        spPotion: 'SP Potion',
        potionFullSold: 'Potion full, sold for',
        maxPotionsReached: 'Max Potions Reached'
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
        loopCompleted: '完成一圈！奖励 +25 金币',
        setBonus: '阶段完成奖励',
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
        skillRevive: '复活',
        skillDescHealing: '恢复最大生命值的百分比',
        skillDescClone: '召唤分身进行攻击',
        skillDescExplosion: '造成固定伤害',
        skillDescShelves: '格挡所有伤害',
        skillDescRevive: '死亡时自动复活',
        reviveTriggered: '复活触发！恢复了',
        reviveCooldown: '复活冷却',
        rounds: '轮',
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
        continueAdventure: '卖掉所有物品并继续',
        continueOnly: '继续冒险',
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
        ringsMax: '只能装备1个戒指！',
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
        buyAndReplace: '购买并替换',
        hpPotion: '生命药水',
        spPotion: '魔法药水',
        potionFullSold: '药水已满，卖出获得',
        maxPotionsReached: '药水已达上限'
    }
};

export function t(key) {
    return TRANSLATIONS[currentLanguage][key] || key;
}

export function switchLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    localStorage.setItem('gameLanguage', currentLanguage);

    // Update all static UI text
    updateLanguageUI();

    // Use dynamic import to avoid circular dependency with ui.js
    import('./ui.js').then(module => {
        module.updateUI();
        module.updateInventoryUI();
    });
}

export function updateLanguageUI() {
    document.querySelector('header h1').innerHTML = `🎲 ${t('title')} <span style="font-size: 0.5em; color: #999; font-weight: normal;">${VERSION}</span>`;
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
    const centerRollBtn = document.getElementById('roll-btn');
    if (centerRollBtn) centerRollBtn.innerHTML = `🎲 ${t('rollDice')}`;
}

// Attach to window for onclick handlers
window.switchLanguage = switchLanguage;
