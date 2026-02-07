// ========================================
// MAIN GAME CONTROLLER
// ========================================

import { TIMING, ROUND_SCALING, getSetMultiplier } from './config.js';
import { playSound, updateSoundButton } from './sound.js';
import { gameState } from './state.js';
import { t, updateLanguageUI, switchLanguage } from './translations.js';
import { Player } from './player.js';
import { Item } from './items.js';
import { TILE_TYPES, generateBoard, generateSupplyBoard, renderBoard } from './board.js';
import { startCombat } from './combat.js';
import { openSkillTrainer } from './skills.js';
import {
    updateUI,
    updateInventoryUI,
    logEvent,
    showCenterResult,
    openShop,
    openTreasure,
    closeModal
} from './ui.js';

// ========================================
// DICE ROLL
// ========================================

function rollDice() {
    if (gameState.isRolling || gameState.currentPhase !== 'playing') return;

    gameState.isRolling = true;
    playSound('diceRoll', 1.1);

    const rollBtn = document.getElementById('roll-btn');
    if (rollBtn) rollBtn.disabled = true;

    const diceEmoji = document.getElementById('dice-emoji');
    const diceResult = document.getElementById('dice-result');

    // Animate dice roll
    let rolls = 0;
    const rollInterval = setInterval(() => {
        const tempRoll = Math.floor(Math.random() * 6) + 1;
        if (diceResult) diceResult.textContent = tempRoll;
        if (diceEmoji) diceEmoji.style.transform = `rotate(${rolls * 36}deg) scale(${1 + Math.sin(rolls) * 0.2})`;
        rolls++;

        if (rolls >= 15) {
            clearInterval(rollInterval);
            const finalRoll = Math.floor(Math.random() * 6) + 1;
            if (diceResult) diceResult.textContent = finalRoll;
            if (diceEmoji) diceEmoji.style.transform = 'rotate(0deg) scale(1.2)';

            logEvent(`${t('rolled')} ${finalRoll}!`);

            setTimeout(() => {
                if (diceEmoji) diceEmoji.style.transform = 'rotate(0deg) scale(1)';
                movePlayer(finalRoll);
            }, TIMING.diceResultDelay);
        }
    }, TIMING.diceRollInterval);
}

// ========================================
// PLAYER MOVEMENT
// ========================================

function movePlayer(steps) {
    let currentStep = 0;
    const startPosition = gameState.player.position;

    // Check if this move will cross the start tile (complete a loop)
    const willCrossStart = startPosition + steps >= 32;
    // If crossing, stop at tile 0 instead of continuing past
    const actualSteps = willCrossStart ? (32 - startPosition) : steps;

    // Animate step by step
    const moveInterval = setInterval(() => {
        if (currentStep < actualSteps) {
            currentStep++;
            gameState.player.position = (startPosition + currentStep) % 32;
            playSound('step');
            renderBoard();

            // Re-attach event listener to center button after re-render
            const centerRollBtn = document.getElementById('roll-btn');
            if (centerRollBtn) {
                centerRollBtn.replaceWith(centerRollBtn.cloneNode(true));
                document.getElementById('roll-btn').addEventListener('click', rollDice);
            }
        } else {
            clearInterval(moveInterval);

            // Check if completed a loop (stopped at start tile)
            if (willCrossStart) {
                playSound('levelUp');
                gameState.player.loops++;
                gameState.player.gainMoney(25);

                // Recover 30% of max HP and SP on loop completion
                const healAmount = Math.floor(gameState.player.stats.maxHp * 0.3);
                const spAmount = Math.floor(gameState.player.stats.maxSp * 0.3);
                gameState.player.heal(healAmount);
                gameState.player.stats.sp = Math.min(gameState.player.stats.sp + spAmount, gameState.player.stats.maxSp);

                // Check if this is a Supply Round loop completion
                if (gameState.isSupplyRound) {
                    // Supply Round completed - grant permanent stat boost (15%)
                    const boost = 0.15;
                    gameState.player.stats.maxHp = Math.floor(gameState.player.stats.maxHp * (1 + boost));
                    gameState.player.stats.maxSp = Math.floor(gameState.player.stats.maxSp * (1 + boost));
                    gameState.player.stats.atk = Math.floor(gameState.player.stats.atk * (1 + boost));
                    gameState.player.stats.def = Math.floor(gameState.player.stats.def * (1 + boost));
                    // Full heal with new max values
                    gameState.player.stats.hp = gameState.player.stats.maxHp;
                    gameState.player.stats.sp = gameState.player.stats.maxSp;

                    logEvent(`💪 ${t('setBonus')}: +15% ATK/DEF/HP/SP!`);

                    // Go to next set
                    gameState.isSupplyRound = false;
                    gameState.set++;
                    gameState.round = 1;
                    gameState.player.loops = 0;
                    gameState.board = generateBoard(); // Generate normal board

                    // Decrement revive cooldown if active (new round started)
                    if (gameState.reviveCooldown > 0) {
                        gameState.reviveCooldown--;
                        if (gameState.reviveCooldown === 0 && gameState.player.passiveSkill && gameState.player.passiveSkill.type === 'REVIVE') {
                            logEvent(`💫 ${t('skillRevive')} ready!`);
                        }
                    }

                    renderBoard();
                    logEvent(`🎉 ${t('set')} ${gameState.set} ${t('round')} 1!`);
                } else {
                    // Normal round progression
                    logEvent(`🎉 ${t('loopCompleted')} +${healAmount} HP, +${spAmount} SP! (${t('round')} ${gameState.round}/5)`);

                    // Round end rewards: R1=skill, R2=shop, R3=treasure, R4=skill, R5=shop then supply
                    const roundRewards = {
                        1: () => setTimeout(() => openSkillTrainer(), TIMING.bossFightDelay),
                        2: () => setTimeout(() => showShopModal(), TIMING.bossFightDelay),
                        3: () => setTimeout(() => openTreasure(), TIMING.bossFightDelay),
                        4: () => setTimeout(() => openSkillTrainer(), TIMING.bossFightDelay),
                        5: () => setTimeout(() => {
                            showShopModal();
                            // After shop closes, start supply round
                            gameState.pendingSupplyRound = true;
                        }, TIMING.bossFightDelay)
                    };

                    // Trigger round end reward
                    if (roundRewards[gameState.round]) {
                        roundRewards[gameState.round]();
                    }

                    // Check for round 5 -> Supply Round (handled after shop modal)
                    if (gameState.round >= 5) {
                        gameState.player.loops = 0;
                        // Supply round triggered after shop modal closes
                    } else {
                        // Increment round and regenerate map
                        gameState.round++;
                        gameState.player.loops = 0;
                        gameState.board = generateBoard();

                        // Decrement revive cooldown if active
                        if (gameState.reviveCooldown > 0) {
                            gameState.reviveCooldown--;
                            if (gameState.reviveCooldown === 0 && gameState.player.passiveSkill && gameState.player.passiveSkill.type === 'REVIVE') {
                                logEvent(`💫 ${t('skillRevive')} ready!`);
                            }
                        }

                        logEvent(`📈 ${t('round')} ${gameState.round} / ${t('set')} ${gameState.set}`);
                    }
                }
                // Render board with new map and player position
                renderBoard();
                updateUI();
            }

            const tile = gameState.board[gameState.player.position];
            logEvent(`${t('landedOn')} ${tile.emoji} ${tile.type} ${t('tile')}!`);

            // Reset center display
            const centerDice = document.getElementById('dice-emoji');
            if (centerDice) {
                centerDice.textContent = '🎲';
                centerDice.style.transform = 'scale(1)';
            }

            setTimeout(() => {
                handleTileLanding(tile);
                gameState.isRolling = false;

                const rollBtn = document.getElementById('roll-dice-btn');
                if (rollBtn) rollBtn.disabled = false;

                const centerRollBtn = document.getElementById('roll-btn');
                if (centerRollBtn) centerRollBtn.disabled = false;
            }, TIMING.tileLandingDelay);
        }
    }, TIMING.moveStepInterval);
}

// Helper function for shop modal (alias for openShop)
function showShopModal() {
    openShop();
}

// ========================================
// TILE LANDING
// ========================================

function handleTileLanding(tile) {
    switch(tile.type) {
        case TILE_TYPES.SHOP:
            showCenterResult('🏪 ' + t('shop'), 1000);
            setTimeout(() => openShop(), 800);
            break;
        case TILE_TYPES.COMBAT:
            showCenterResult('⚔️ ' + t('combatStart').split(' ')[0], 1000);
            setTimeout(() => startCombat(), 800);
            break;
        case TILE_TYPES.TREASURE:
            showCenterResult('🎁 ' + t('treasure'), 1000);
            setTimeout(() => openTreasure(), 800);
            break;
        case TILE_TYPES.SKILL_TRAINER:
            showCenterResult('⭐ ' + t('skillTrainer'), 1000);
            setTimeout(() => openSkillTrainer(), 800);
            break;
        case TILE_TYPES.EMPTY:
            // Use round/set scaling for empty tile gold
            const roundScale = ROUND_SCALING[gameState.round] || ROUND_SCALING[5];
            const setMult = getSetMultiplier(gameState.set);
            const coins = Math.floor((3 + Math.random() * 7) * roundScale.gold * setMult);
            gameState.player.gainMoney(coins);
            logEvent(`${t('foundCoins')} ${coins} ${t('coins')}! 💰`);
            showCenterResult(`💰 +${coins}`);
            break;
        case TILE_TYPES.START:
            // Start tile - round rewards already handled in movePlayer
            showCenterResult('🏁 ' + t('loopCompleted').split('!')[0] + '!');
            break;
    }
}

// ========================================
// SUPPLY ROUND
// ========================================

export function startSupplyRound() {
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
            <button id="start-supply-btn" class="modal-btn primary">🎲 ${t('continueOnly')}</button>
        </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('start-supply-btn').addEventListener('click', () => {
        closeModal();
        renderBoard();
        updateUI();

        // Re-attach event listener to center button after re-render
        const centerRollBtn = document.getElementById('roll-btn');
        if (centerRollBtn) {
            centerRollBtn.addEventListener('click', rollDice);
        }

        logEvent(`🎁 ${t('supplyRound')} - ${t('set')} ${gameState.set}`);
    });
}

// ========================================
// GAME RESTART
// ========================================

export function restartGame() {
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
    gameState.pendingSupplyRound = false;
    gameState.isRolling = false;
    gameState.currentEnemy = null;
    gameState.shopItems = [];
    gameState.combatState = {
        enemyFrozen: false,
        enemyPoison: { active: false, percent: 0, turnsLeft: 0 },
        cloneActive: { active: false, turnsLeft: 0 },
        shelvesActive: { active: false, turnsLeft: 0, absorbLeft: 0 }
    };
    gameState.reviveCooldown = 0;  // Reset revive cooldown
    gameState.currentPhase = 'playing';
    gameState.board = generateBoard();

    // Add persisted item (equip it based on type)
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
            // Restore buffs if present
            if (itemData.buffs) item.buffs = itemData.buffs;

            // Equip based on type
            if (item.type === 'weapon') {
                gameState.player.equippedWeapon = item;
            } else if (item.type === 'armor') {
                gameState.player.equippedArmor = item;
            } else if (item.type === 'ring') {
                gameState.player.equippedRing = item;
            } else {
                gameState.player.addItem(item);
            }
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
    const centerRollBtn = document.getElementById('roll-btn');
    if (centerRollBtn) {
        centerRollBtn.addEventListener('click', rollDice);
    }

    logEvent(`🎮 ${t('gameRestarted')}`);
}

// ========================================
// INITIALIZATION
// ========================================

function initGame() {
    gameState.player = new Player();
    gameState.board = generateBoard();

    updateLanguageUI();
    updateSoundButton();
    renderBoard();
    updateUI();
    updateInventoryUI();

    // Setup event listeners
    const rollBtn = document.getElementById('roll-dice-btn');
    if (rollBtn) rollBtn.addEventListener('click', rollDice);

    const centerRollBtn = document.getElementById('roll-btn');
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
