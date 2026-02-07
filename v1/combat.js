// ========================================
// COMBAT SYSTEM
// ========================================

import { TIMING, SKILL_CONFIG, BUFF_CONFIG, CRIT_MULTIPLIER, DAMAGE_VARIANCE, ROUND_SCALING, getSetMultiplier, DIFFICULTY } from './config.js';
import { playSound } from './sound.js';
import { gameState } from './state.js';
import { t } from './translations.js';
import { SKILL_TRANSLATION_KEY } from './items.js';
import { updateUI, updatePassiveSkillsUI, updateInventoryUI, showLootModal, closeModal, gameOver, logEvent } from './ui.js';

// ========================================
// COMBAT INITIALIZATION
// ========================================

export function startCombat() {
    gameState.currentPhase = 'combat';

    gameState.currentEnemy = generateEnemy();
    logEvent(`⚔️ ${t('combatStart')} ${gameState.currentEnemy.name}!`);

    showCombatModal(gameState.currentEnemy);
}

export function generateEnemy() {
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
    // 2x multiplier for rounds 3-5 (harder late rounds)
    const lateRoundMult = gameState.round >= 3 ? 2.0 : 1.0;

    return {
        name: type.name,
        emoji: type.emoji,
        hp: Math.floor(60 * type.hpMult * roundScale.hp * setMult * lateRoundMult * DIFFICULTY),
        maxHp: Math.floor(60 * type.hpMult * roundScale.hp * setMult * lateRoundMult * DIFFICULTY),
        atk: Math.floor(20 * type.atkMult * roundScale.atk * setMult * lateRoundMult * DIFFICULTY),
        def: Math.floor(5 * roundScale.def * setMult * lateRoundMult * DIFFICULTY)
    };
}

// ========================================
// BUFF HELPERS
// ========================================

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

export function resetCombatState() {
    gameState.combatState = {
        enemyFrozen: false,
        enemyPoison: { active: false, percent: 0, turnsLeft: 0 },
        cloneActive: { active: false, turnsLeft: 0 },
        shelvesActive: { active: false, turnsLeft: 0, absorbLeft: 0 }
    };
}

// ========================================
// COMBAT UI HELPERS
// ========================================

function getCombatPotionButtonsHTML() {
    const hpCount = gameState.player.countPotionsByType('hp');
    const spCount = gameState.player.countPotionsByType('sp');
    let html = '';
    if (hpCount > 0) {
        html += `<button id="combat-hp-potion-btn" style="padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1em; font-weight: bold;">
            ❤️ ${t('hpPotion')} x${hpCount}
        </button>`;
    }
    if (spCount > 0) {
        html += `<button id="combat-sp-potion-btn" style="padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1em; font-weight: bold;">
            💙 ${t('spPotion')} x${spCount}
        </button>`;
    }
    return html;
}

// ========================================
// COMBAT MODAL
// ========================================

export function showCombatModal(enemy) {
    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    content.classList.add('combat-modal');

    const skill = gameState.player.equippedSkill;
    const skillConfig = skill ? SKILL_CONFIG[skill.type] : null;
    const spCost = skillConfig ? skillConfig.spCost : 0;
    const skillName = skill ? t(SKILL_TRANSLATION_KEY[skill.type]) : '';
    const skillBtnText = skill ? `${skillConfig.emoji} ${skillName} (${t('skillLevel')}${skill.level}) - ${spCost} SP` : t('noSkillEquipped');
    const skillBtnDisabled = !skill || gameState.player.stats.sp < spCost;

    content.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 10px;">⚔️ ${t('battleStart')} ⚔️</h2>

        <!-- Skill Button -->
        <div style="text-align: center; margin-bottom: 10px;">
            <button id="use-skill-btn" style="padding: 10px 20px; background: ${skillBtnDisabled ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)'}; color: white; border: none; border-radius: 8px; cursor: ${skillBtnDisabled ? 'not-allowed' : 'pointer'}; font-weight: bold; font-size: 1em;" ${skillBtnDisabled ? 'disabled' : ''}>
                ${skillBtnText}
            </button>
            <div style="font-size: 0.8em; color: #666; margin-top: 5px;">SP: ${gameState.player.stats.sp}/${gameState.player.stats.maxSp}</div>
        </div>

        <!-- Potions (count-based buttons) -->
        <div id="combat-potions" style="text-align: center; margin-bottom: 15px; display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
            ${getCombatPotionButtonsHTML()}
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

// ========================================
// COMBAT EXECUTION
// ========================================

export function executeCombat() {
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

        playSound('skill');

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

    // Add potion button event listeners (count-based)
    function usePotionByType(potionType) {
        // Find first potion of the given type (hp or sp)
        const potionIndex = gameState.player.inventory.findIndex(item =>
            item.type === 'potion' && item.stats[potionType]
        );
        if (potionIndex === -1) return;

        const item = gameState.player.inventory[potionIndex];

        // Apply potion effect
        if (item.stats.hp) {
            gameState.player.heal(item.stats.hp);
            addLog(`❤️ ${t('used')} ${t('hpPotion')}: +${item.stats.hp} HP!`);
            updatePlayerHpBar();
        }
        if (item.stats.sp) {
            gameState.player.stats.sp = Math.min(gameState.player.stats.sp + item.stats.sp, gameState.player.stats.maxSp);
            addLog(`💙 ${t('used')} ${t('spPotion')}: +${item.stats.sp} SP!`);
            updateSkillButton();
        }

        // Remove potion from inventory
        gameState.player.inventory.splice(potionIndex, 1);

        // Update potion buttons display (count-based)
        updateCombatPotionButtons();
        updateUI();
    }

    function updateCombatPotionButtons() {
        const potionsDiv = document.getElementById('combat-potions');
        if (potionsDiv) {
            potionsDiv.innerHTML = getCombatPotionButtonsHTML();
            // Re-add listeners
            const hpBtn = potionsDiv.querySelector('#combat-hp-potion-btn');
            const spBtn = potionsDiv.querySelector('#combat-sp-potion-btn');
            if (hpBtn) hpBtn.addEventListener('click', () => usePotionByType('hp'));
            if (spBtn) spBtn.addEventListener('click', () => usePotionByType('sp'));
        }
    }

    // Initial potion button listeners
    const hpPotionBtn = document.getElementById('combat-hp-potion-btn');
    const spPotionBtn = document.getElementById('combat-sp-potion-btn');
    if (hpPotionBtn) hpPotionBtn.addEventListener('click', () => usePotionByType('hp'));
    if (spPotionBtn) spPotionBtn.addEventListener('click', () => usePotionByType('sp'));

    function handleVictory() {
        playSound('victory');
        addLog(`🎉 ${t('victoryMsg')} ${t('defeatedEnemy')} ${enemy.name}!`);

        // Use round/set scaling for gold rewards
        const roundScale = ROUND_SCALING[gameState.round] || ROUND_SCALING[5];
        const setMult = getSetMultiplier(gameState.set);
        const reward = Math.floor((8 + Math.random() * 12) * roundScale.gold * setMult);
        gameState.player.gainMoney(reward);
        addLog(`💰 ${t('gained')} ${reward} ${t('coins')}!`);

        resetCombatState();

        setTimeout(() => {
            showLootModal();
        }, TIMING.victoryDelay);
    }

    function handleDefeat() {
        // Check for revive passive skill
        const passiveSkill = gameState.player.passiveSkill;
        if (passiveSkill && passiveSkill.type === 'REVIVE' && gameState.reviveCooldown === 0) {
            // Trigger revive!
            const config = SKILL_CONFIG.REVIVE;
            const healPercent = config.baseHealPercent;
            const healAmount = Math.floor(gameState.player.stats.maxHp * healPercent / 100);

            gameState.player.stats.hp = healAmount;

            // Calculate cooldown based on level (max level 4, min cooldown 2)
            const cooldown = Math.max(2, config.baseCooldown - (passiveSkill.level - 1) * config.upgradeBonus);
            gameState.reviveCooldown = cooldown;

            playSound('levelUp');
            addLog(`💫 ${t('reviveTriggered')} ${healAmount} HP!`);
            addLog(`⏳ ${t('reviveCooldown')}: ${cooldown} ${t('rounds')}`);

            updatePlayerHpBar();
            updateUI();
            updatePassiveSkillsUI();

            // Continue combat - don't end the game
            return;
        }

        playSound('defeat');
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
            (gameState.player.getTotalAtk() - enemy.def) * (DAMAGE_VARIANCE.min + Math.random() * DAMAGE_VARIANCE.range)
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
            playSound('hit', 1.0); // Player attacks = same as enemy
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
                        updateBuffDisplay();
                    }
                } else if (buff.type === 'POISON') {
                    if (!gameState.combatState.enemyPoison.active && Math.random() * 100 < buff.value) {
                        gameState.combatState.enemyPoison = {
                            active: true,
                            percent: buff.value,
                            turnsLeft: buff.duration || 3
                        };
                        addLog(`☠️ ${enemy.name} ${t('poisoned')}`);
                        updateBuffDisplay();
                    }
                }
            }

            // Clone attack (if active)
            if (gameState.combatState.cloneActive.active) {
                const cloneDmg = Math.max(1, Math.floor(
                    (gameState.player.getTotalAtk() - enemy.def) * (DAMAGE_VARIANCE.min + Math.random() * DAMAGE_VARIANCE.range)
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

                // Calculate enemy damage (DEF applied in takeDamage)
                let enemyDmg = Math.max(1, Math.floor(
                    enemy.atk * (DAMAGE_VARIANCE.min + Math.random() * DAMAGE_VARIANCE.range)
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
                            playSound('hit', 1.0); // Enemy attacks = normal pitch
                            const actualDmg = gameState.player.takeDamage(enemyDmg);
                            addLog(`${enemy.emoji} ${enemy.name} ${t('enemyDealt')} ${actualDmg} ${t('damage')}!`);

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
