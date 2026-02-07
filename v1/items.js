// ========================================
// ITEM SYSTEM
// ========================================

import { DIFFICULTY, BUFF_CONFIG, BUFF_ROUND_SCALING, ITEM_BUFF_RULES } from './config.js';
import { gameState } from './state.js';
import { t } from './translations.js';

// ========================================
// ITEM CLASS
// ========================================

export class Item {
    constructor(type, name, emoji, stats, special = null, price = 0) {
        this.id = Date.now() + Math.random();
        this.type = type; // 'weapon', 'armor', 'potion', 'ring'
        this.name = name;
        this.emoji = emoji;
        this.stats = stats;
        this.special = special;
        this.buffs = [];  // Array for combat buffs
        this.price = price;
        this.sellValue = Math.floor(price * 0.1);
    }
}

// ========================================
// ITEM GENERATION
// ========================================

export function generateItemBuffs(itemType, levelScale = 1) {
    const rules = ITEM_BUFF_RULES[itemType];
    if (!rules || rules.maxBuffs === 0) return [];

    const buffs = [];
    const availableBuffs = [...rules.allowed];

    // Calculate progression-based buff cap
    const roundScale = BUFF_ROUND_SCALING[gameState.round] || BUFF_ROUND_SCALING[5];
    const setBonus = (gameState.set - 1) * 0.15; // +15% per set after first
    const progressionCap = Math.min(1.0, roundScale + setBonus); // Cap at 100%

    // Scale max buffs with progression: R1=0-1, R2-3=0-2, R4-5+=0-3
    const maxBuffsForRound = gameState.round <= 1 ? 1 : (gameState.round <= 3 ? 2 : rules.maxBuffs);
    const numBuffs = Math.floor(Math.random() * (maxBuffsForRound + 1));

    for (let i = 0; i < numBuffs && availableBuffs.length > 0; i++) {
        const buffIndex = Math.floor(Math.random() * availableBuffs.length);
        const buffType = availableBuffs.splice(buffIndex, 1)[0];
        const config = BUFF_CONFIG[buffType];

        // Calculate max available value for current progression
        const maxAvailable = config.minValue + (config.maxValue - config.minValue) * progressionCap;

        // Random value between min and max available
        const baseValue = config.minValue + Math.random() * (maxAvailable - config.minValue);
        const scaledValue = Math.floor(baseValue * DIFFICULTY);

        buffs.push({
            type: buffType,
            emoji: config.emoji,
            value: scaledValue,
            duration: config.duration || 0
        });
    }

    return buffs;
}

export const ITEM_TEMPLATES = {
    weapons: [
        { name: 'Iron Sword', emoji: '🗡️', stats: { atk: 5 }, price: 50 },
        { name: 'Steel Sword', emoji: '⚔️', stats: { atk: 10 }, price: 100 },
        { name: 'Magic Staff', emoji: '🪄', stats: { atk: 8 }, price: 90 },
        { name: 'Bow', emoji: '🏹', stats: { atk: 7 }, price: 80 },
    ],
    armors: [
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
        { name: 'Vampire Ring', emoji: '🧛', stats: { atk: 2 }, price: 120 },
    ]
};

export function createRandomItem(category, levelScale = 1) {
    const templates = ITEM_TEMPLATES[category];
    const template = templates[Math.floor(Math.random() * templates.length)];

    const scaledStats = {};
    for (let stat in template.stats) {
        scaledStats[stat] = Math.floor(template.stats[stat] * levelScale * DIFFICULTY);
    }

    // Price scales at 80% of stat scaling to keep items more affordable as game progresses
    const priceScale = 1 + (levelScale - 1) * 0.8;
    const item = new Item(
        category.slice(0, -1), // Remove 's' from category name
        template.name,
        template.emoji,
        scaledStats,
        template.special,
        Math.floor(template.price * priceScale)
    );

    // Generate buffs for the item based on its type
    item.buffs = generateItemBuffs(item.type, levelScale);

    return item;
}

// ========================================
// ITEM STAT FORMATTING
// ========================================

// Fixed buff display order for easier comparison
export const BUFF_DISPLAY_ORDER = ['LIFESTEAL', 'FREEZE', 'POISON', 'AUTO_BLOCK', 'REFLECT'];

// Map buff type to translation key
export const BUFF_TRANSLATION_KEY = {
    'LIFESTEAL': 'lifeSteal',
    'FREEZE': 'freeze',
    'POISON': 'poison',
    'AUTO_BLOCK': 'autoBlock',
    'REFLECT': 'reflect'
};

// Map skill type to translation key
export const SKILL_TRANSLATION_KEY = {
    'HEALING': 'skillHealing',
    'CLONE': 'skillClone',
    'EXPLOSION': 'skillExplosion',
    'SHELVES': 'skillShelves',
    'REVIVE': 'skillRevive'
};

// Map skill type to description translation key
export const SKILL_DESC_KEY = {
    'HEALING': 'skillDescHealing',
    'CLONE': 'skillDescClone',
    'EXPLOSION': 'skillDescExplosion',
    'SHELVES': 'skillDescShelves',
    'REVIVE': 'skillDescRevive'
};

export function formatItemStats(item) {
    const parts = [];

    // Existing stat display
    if (item.stats.atk) parts.push(`⚔️ ${t('ATK')} +${item.stats.atk}`);
    if (item.stats.def) parts.push(`🛡️ ${t('DEF')} +${item.stats.def}`);
    if (item.stats.hp) parts.push(`❤️ ${t('HP')} +${item.stats.hp}`);
    if (item.stats.sp) parts.push(`💙 ${t('SP')} +${item.stats.sp}`);
    if (item.stats.crit) parts.push(`⚡ ${t('CRIT')} +${item.stats.crit}%`);
    // Special effects removed - using buff system instead

    // Add buff display in fixed order
    if (item.buffs && item.buffs.length > 0) {
        const sortedBuffs = [...item.buffs].sort((a, b) => {
            return BUFF_DISPLAY_ORDER.indexOf(a.type) - BUFF_DISPLAY_ORDER.indexOf(b.type);
        });
        sortedBuffs.forEach(buff => {
            const buffName = t(BUFF_TRANSLATION_KEY[buff.type]) || buff.type;
            let text = `${buff.emoji} ${buffName} ${buff.value}%`;
            if (buff.duration) text += ` (${buff.duration}t)`;
            parts.push(text);
        });
    }

    return parts.join('<br>');
}

export function formatBuffsOnly(item) {
    if (!item.buffs || item.buffs.length === 0) return '';

    // Sort buffs using BUFF_DISPLAY_ORDER for consistent display
    const sortedBuffs = [...item.buffs].sort((a, b) => {
        return BUFF_DISPLAY_ORDER.indexOf(a.type) - BUFF_DISPLAY_ORDER.indexOf(b.type);
    });

    const buffTexts = sortedBuffs.map(buff => {
        let text = `${buff.emoji} ${buff.value}%`;
        if (buff.duration) text += ` (${buff.duration}t)`;
        return text;
    });

    return buffTexts.join('<br>');
}
