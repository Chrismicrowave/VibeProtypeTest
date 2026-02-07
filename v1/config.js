// ========================================
// GAME CONFIGURATION & CONSTANTS
// ========================================

export const VERSION = 'v0.2.0-2229';

// Difficulty Scaling - affects enemies, items, and buffs
// 1.0 = normal, 1.5 = 50% harder, 2.0 = double difficulty
export const DIFFICULTY = 1.0;

// Timing Configuration (in milliseconds)
// Adjust these values to change game speed
export const TIMING = {
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
    victoryDelay: 1200,         // Delay after victory before loot
    defeatDelay: 1000,          // Delay after defeat before game over
    skillEmojiDisplay: 500,     // Duration to show skill emoji over enemy
};

// Combat Configuration
export const CRIT_MULTIPLIER = 2.0;
export const DAMAGE_VARIANCE = { min: 0.8, range: 0.4 }; // 80-120% damage

// Round/Difficulty Scaling Configuration
export const ROUND_SCALING = {
    1: { hp: 1.0, atk: 1.0, def: 1.0, gold: 1.0 },
    2: { hp: 1.15, atk: 1.1, def: 1.1, gold: 1.1 },
    3: { hp: 1.35, atk: 1.2, def: 1.2, gold: 1.2 },
    4: { hp: 1.55, atk: 1.35, def: 1.35, gold: 1.35 },
    5: { hp: 1.75, atk: 1.5, def: 1.5, gold: 1.5 }
};

// Get set multiplier: 1 + (set - 1) * 0.5
export function getSetMultiplier(set) {
    return 1 + (set - 1) * 0.5;
}

// Buff Configuration - values scale with progression
// Early game gets ~20-30% of max, late game reaches full values
export const BUFF_CONFIG = {
    LIFESTEAL: { type: 'attack', emoji: '🧛', minValue: 3, maxValue: 20 },
    FREEZE: { type: 'attack', emoji: '❄️', minValue: 5, maxValue: 25, duration: 1 },
    POISON: { type: 'attack', emoji: '🦠', minValue: 3, maxValue: 20, duration: 3 },
    AUTO_BLOCK: { type: 'defense', emoji: '🛡️', minValue: 3, maxValue: 15 },
    REFLECT: { type: 'defense', emoji: '↩️', minValue: 5, maxValue: 35 }
};

// Buff scaling by round (percentage of max value available)
export const BUFF_ROUND_SCALING = {
    1: 0.25,  // Round 1: 25% of max buff values
    2: 0.40,  // Round 2: 40%
    3: 0.55,  // Round 3: 55%
    4: 0.70,  // Round 4: 70%
    5: 0.85   // Round 5: 85%
};
// Set adds +15% per set (Set 2 = +15%, Set 3 = +30%, etc.)

// Item buff rules: which buffs allowed per item type
export const ITEM_BUFF_RULES = {
    weapon: { allowed: ['LIFESTEAL', 'FREEZE', 'POISON'], maxBuffs: 3 },
    armor: { allowed: ['AUTO_BLOCK', 'REFLECT'], maxBuffs: 3 },
    ring: { allowed: ['LIFESTEAL'], maxBuffs: 3 },
    potion: { allowed: [], maxBuffs: 0 }
};

// Skill Configuration
export const SKILL_CONFIG = {
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
    },
    REVIVE: {
        name: 'Revive',
        emoji: '💫',
        type: 'passive',
        spCost: 0,
        passive: true,
        baseHealPercent: 30,    // 30% of max HP on revive
        baseCooldown: 5,        // 5 rounds cooldown at level 1
        upgradeBonus: 1,        // -1 round cooldown per level (min 2)
        maxLevel: 4,            // Max level 4 (2 rounds CD)
        description: 'Auto-revive on death'
    }
};

export const SKILL_TRAINER_PRICE = 100; // Base price to learn skill
export const MAX_POTIONS = 3; // Max HP potions and SP potions each

// Test Mode Configuration
export const TEST_MODE = {
    enabled: false,             // Set to false for normal gameplay
    tileTypes: ['skillTrainer', 'combat'] // Only these tile types in test mode
};
