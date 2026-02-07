// ========================================
// SKILL TRAINER SYSTEM
// ========================================

import { SKILL_CONFIG, SKILL_TRAINER_PRICE } from './config.js';
import { playSound } from './sound.js';
import { gameState } from './state.js';
import { t } from './translations.js';
import { SKILL_TRANSLATION_KEY, SKILL_DESC_KEY } from './items.js';
import { updateUI, closeModal, logEvent } from './ui.js';

// ========================================
// SKILL TRAINER
// ========================================

export function openSkillTrainer() {
    gameState.currentPhase = 'skillTrainer';

    // Pick a random skill to offer
    const skillTypes = Object.keys(SKILL_CONFIG);
    const randomSkillType = skillTypes[Math.floor(Math.random() * skillTypes.length)];
    const skillConfig = SKILL_CONFIG[randomSkillType];
    const newSkillName = t(SKILL_TRANSLATION_KEY[randomSkillType]);
    const isPassive = skillConfig.passive === true;

    // Calculate price (increases with level)
    // For passive skills, check passiveSkill; for active skills, check equippedSkill
    const currentSkill = isPassive ? gameState.player.passiveSkill : gameState.player.equippedSkill;
    const isUpgrade = currentSkill && currentSkill.type === randomSkillType;
    // Check max level for skills that have it
    const maxLevel = skillConfig.maxLevel || 99;
    const currentLevel = isUpgrade ? currentSkill.level : 0;
    const atMaxLevel = currentLevel >= maxLevel;
    const newLevel = isUpgrade ? currentSkill.level + 1 : 1;
    const skillScale = 1 + (gameState.round - 1) * 0.2 + (gameState.set - 1) * 0.3;
    const price = Math.floor(SKILL_TRAINER_PRICE * newLevel * skillScale);

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
        case 'REVIVE':
            const reviveCooldown = Math.max(2, skillConfig.baseCooldown - (newLevel - 1) * skillConfig.upgradeBonus);
            skillValue = `${skillConfig.baseHealPercent}% HP, ${reviveCooldown} ${t('rounds')} CD`;
            break;
    }

    let currentSkillHTML = '';
    if (currentSkill) {
        const currentConfig = SKILL_CONFIG[currentSkill.type];
        const currentSkillName = t(SKILL_TRANSLATION_KEY[currentSkill.type]);
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
            case 'REVIVE':
                const currentReviveCooldown = Math.max(2, currentConfig.baseCooldown - (currentSkill.level - 1) * currentConfig.upgradeBonus);
                currentSkillValue = `${currentConfig.baseHealPercent}% HP, ${currentReviveCooldown} ${t('rounds')} CD`;
                break;
        }
        currentSkillHTML = `
            <div style="flex: 1; text-align: center; background: #fff3cd; padding: 15px; border-radius: 8px; border: 2px solid #ffc107;">
                <div style="font-size: 0.8em; color: #856404; font-weight: bold; margin-bottom: 5px;">${t('currentSkill')}</div>
                <div style="font-size: 3em; margin-bottom: 5px;">${currentConfig.emoji}</div>
                <div style="font-weight: bold; color: #2c3e50;">${currentSkillName} - ${currentSkillValue}</div>
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
                <div style="font-weight: bold; color: #2c3e50;">${newSkillName} - ${skillValue}</div>
                <div style="color: #666; font-size: 0.85em;">${t('skillLevel')}${newLevel}</div>
                <div style="color: #e74c3c; font-weight: bold; margin-top: 5px;">💰 ${price}</div>
            </div>
        </div>

        <p style="text-align: center; color: #666; font-size: 0.85em; margin-bottom: 20px;">
            ${t(SKILL_DESC_KEY[randomSkillType])}<br>
            ${isPassive ? `<span style="color: #9b59b6;">Passive (auto-trigger)</span>` : 'SP: 15'}
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px; max-width: 300px; margin: 0 auto;">
            <button id="learn-skill-btn" style="padding: 12px; background: ${gameState.player.stats.money >= price && !atMaxLevel ? '#28a745' : '#ccc'}; color: white; border: none; border-radius: 8px; cursor: ${gameState.player.stats.money >= price && !atMaxLevel ? 'pointer' : 'not-allowed'}; font-weight: bold; font-size: 1em;" ${gameState.player.stats.money < price || atMaxLevel ? 'disabled' : ''}>
                ${atMaxLevel ? '✓ Max Level' : (isUpgrade ? `⬆️ ${t('upgradeSkill')}` : `📚 ${t('learnSkill')}`)} ${!atMaxLevel ? `(💰${price})` : ''}
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
        if (gameState.player.stats.money >= price && !atMaxLevel) {
            gameState.player.stats.money -= price;

            // Assign to correct skill slot based on type
            if (isPassive) {
                gameState.player.passiveSkill = { type: randomSkillType, level: newLevel };
                // Reset cooldown when first learning the skill
                if (!isUpgrade) {
                    gameState.reviveCooldown = 0;
                }
            } else {
                gameState.player.equippedSkill = { type: randomSkillType, level: newLevel };
            }

            playSound('skill'); // Play skill sound when learning/upgrading skills
            logEvent(`⭐ ${isUpgrade ? t('upgradeSkill') : t('learnSkill')}: ${skillConfig.emoji} ${newSkillName} ${t('skillLevel')}${newLevel}`);
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

// Boss fight placeholder
export function startBossFight() {
    logEvent(`👹 ${t('bossFight')}`);
    // TODO: Implement boss fight
}
