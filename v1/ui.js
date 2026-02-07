// ========================================
// UI FUNCTIONS
// ========================================

import { TIMING, SKILL_CONFIG, ROUND_SCALING, getSetMultiplier } from './config.js';
import { playSound } from './sound.js';
import { gameState } from './state.js';
import { t } from './translations.js';
import { Item, createRandomItem, formatItemStats, BUFF_DISPLAY_ORDER, BUFF_TRANSLATION_KEY, SKILL_TRANSLATION_KEY } from './items.js';

// ========================================
// UI UPDATE FUNCTIONS
// ========================================

export function updateUI() {
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
            const skillName = t(SKILL_TRANSLATION_KEY[p.equippedSkill.type]);
            activeSkillsList.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: linear-gradient(135deg, #667eea22, #764ba222); border-radius: 8px;">
                    <span style="font-size: 1.5em;">${config.emoji}</span>
                    <div>
                        <div style="font-weight: bold;">${skillName}</div>
                        <div style="font-size: 0.8em; color: #666;">${t('skillLevel')}${p.equippedSkill.level} | 15 SP</div>
                    </div>
                </div>
            `;
        } else {
            activeSkillsList.innerHTML = `<p class="empty-text">${t('noActiveSkills')}</p>`;
        }
    }

    // Update passive skills display
    updatePassiveSkillsUI();
}

export function updatePassiveSkillsUI() {
    const passiveSkillsList = document.getElementById('passive-skills-list');
    if (passiveSkillsList) {
        const passiveSkill = gameState.player.passiveSkill;
        if (passiveSkill) {
            const config = SKILL_CONFIG[passiveSkill.type];
            const skillName = t(SKILL_TRANSLATION_KEY[passiveSkill.type]);
            const cooldown = gameState.reviveCooldown;

            let cooldownText = '';
            if (passiveSkill.type === 'REVIVE') {
                if (cooldown > 0) {
                    cooldownText = `<span style="color: #e74c3c;">⏳ ${cooldown} ${t('rounds')}</span>`;
                } else {
                    cooldownText = `<span style="color: #27ae60;">✓ Ready</span>`;
                }
            }

            // Calculate cooldown info for display
            const baseCooldown = config.baseCooldown;
            const levelReduction = (passiveSkill.level - 1) * config.upgradeBonus;
            const effectiveCooldown = Math.max(2, baseCooldown - levelReduction);

            passiveSkillsList.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: linear-gradient(135deg, #f39c1222, #e74c3c22); border-radius: 8px;">
                    <span style="font-size: 1.5em;">${config.emoji}</span>
                    <div style="flex: 1;">
                        <div style="font-weight: bold;">${skillName}</div>
                        <div style="font-size: 0.8em; color: #666;">${t('skillLevel')}${passiveSkill.level} | CD: ${effectiveCooldown} ${t('rounds')}</div>
                    </div>
                    <div style="text-align: right;">
                        ${cooldownText}
                    </div>
                </div>
            `;
        } else {
            passiveSkillsList.innerHTML = `<p class="empty-text">${t('noPassiveSkills')}</p>`;
        }
    }
}

export function updateInventoryUI() {
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

    // Update active buffs display
    const activeBuffsDiv = document.getElementById('active-buffs');
    if (activeBuffsDiv) {
        const allBuffs = [];

        // Collect buffs from all equipped items
        [gameState.player.equippedWeapon, gameState.player.equippedArmor, gameState.player.equippedRing].forEach(item => {
            if (item && item.buffs) {
                item.buffs.forEach(buff => {
                    allBuffs.push(buff);
                });
            }
        });

        if (allBuffs.length > 0) {
            // Sort by display order
            allBuffs.sort((a, b) => BUFF_DISPLAY_ORDER.indexOf(a.type) - BUFF_DISPLAY_ORDER.indexOf(b.type));

            const buffTexts = allBuffs.map(buff => {
                const buffName = t(BUFF_TRANSLATION_KEY[buff.type]) || buff.type;
                return `${buff.emoji} ${buffName} ${buff.value}%`;
            });
            activeBuffsDiv.innerHTML = buffTexts.join('<br>');
            activeBuffsDiv.style.display = 'block';
        } else {
            activeBuffsDiv.style.display = 'none';
        }
    }
}

// ========================================
// EVENT LOG
// ========================================

function applyEventLogOpacity() {
    const logDiv = document.getElementById('event-log');
    if (logDiv) {
        Array.from(logDiv.children).forEach((entry, index) => {
            const opacity = Math.max(0.2, Math.pow(0.8, index));
            entry.style.opacity = opacity;
        });
    }
}

export function logEvent(message) {
    // Store message for re-render
    gameState.eventLogMessages.unshift(message);
    if (gameState.eventLogMessages.length > 8) {
        gameState.eventLogMessages.pop();
    }

    // Add to DOM
    const logDiv = document.getElementById('event-log');
    if (logDiv) {
        // Remove highlight from previous first message
        if (logDiv.firstChild) {
            logDiv.firstChild.style.background = 'transparent';
            logDiv.firstChild.style.fontWeight = 'normal';
        }

        const p = document.createElement('p');
        p.textContent = message;
        p.style.marginBottom = '5px';
        p.style.paddingLeft = '5px';
        p.style.borderLeft = '3px solid #667eea';
        p.style.background = 'linear-gradient(90deg, #667eea22, transparent)';
        p.style.fontWeight = 'bold';
        p.style.borderRadius = '4px';
        logDiv.insertBefore(p, logDiv.firstChild);

        // Keep only last 8 messages in DOM
        while (logDiv.children.length > 8) {
            logDiv.removeChild(logDiv.lastChild);
        }

        // Apply progressive opacity fade
        applyEventLogOpacity();
    }
}

export function restoreEventLog() {
    const logDiv = document.getElementById('event-log');
    if (logDiv && gameState.eventLogMessages.length > 0) {
        logDiv.innerHTML = '';
        gameState.eventLogMessages.forEach((msg, index) => {
            const p = document.createElement('p');
            p.textContent = msg;
            p.style.marginBottom = '5px';
            p.style.paddingLeft = '5px';
            p.style.borderLeft = '3px solid #667eea';
            // Highlight first (most recent) message
            if (index === 0) {
                p.style.background = 'linear-gradient(90deg, #667eea22, transparent)';
                p.style.fontWeight = 'bold';
                p.style.borderRadius = '4px';
            }
            logDiv.appendChild(p);
        });
        // Apply progressive opacity fade
        applyEventLogOpacity();
    }
}

// Show result in event log with highlight
export function showCenterResult(text, duration = 1500) {
    // Just log to event log
    logEvent(text);
}

// ========================================
// LOOT MODAL
// ========================================

export function showLootModal(providedItems = null) {
    // Play pickup sound when loot is shown
    playSound('pickup');

    // Use provided items or generate random loot
    let lootItems;
    if (providedItems) {
        lootItems = providedItems;
    } else {
        // Generate 1-3 random items for combat - use round/set scaling
        const numItems = Math.floor(Math.random() * 3) + 1;
        const levelScale = 1 + (gameState.round - 1) * 0.2 + (gameState.set - 1) * 0.3;
        lootItems = [];
        // Weighted item pool: weapons 30%, armors 30%, potions 15%, rings 25%
        const itemPool = ['weapons', 'weapons', 'weapons', 'armors', 'armors', 'armors', 'potions', 'rings', 'rings', 'rings'];
        for (let i = 0; i < numItems; i++) {
            const itemType = itemPool[Math.floor(Math.random() * itemPool.length)];
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
        if (itemType === 'ring') return gameState.player.equippedRing;
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

            const sellPrice = item.sellValue || Math.floor(item.price * 0.1);
            const currentEquipped = getCurrentEquippedItem(item.type);

            // For potions - Use now or Add to inventory
            if (item.type === 'potion') {
                const canAddPotion = gameState.player.canAddPotion(item);
                return `
                    <div class="loot-item-${idx}" style="display: inline-block; margin: 10px; padding: 15px; border: 3px solid #2ecc71; border-radius: 10px; min-width: 180px; background: #f8f9fa;">
                        <div style="font-size: 3em; margin-bottom: 5px;">${item.emoji}</div>
                        <div style="font-weight: bold; margin-bottom: 5px; color: #2c3e50;">${item.name}</div>
                        <div style="color: #666; font-size: 0.85em; margin-bottom: 10px;">${formatItemStats(item)}</div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <button class="loot-use-btn-${idx}" style="padding: 8px; background: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                                🧪 ${t('useNow')}
                            </button>
                            <button class="loot-keep-btn-${idx}" style="padding: 8px; background: ${canAddPotion ? '#667eea' : '#ccc'}; color: white; border: none; border-radius: 5px; cursor: ${canAddPotion ? 'pointer' : 'not-allowed'}; font-weight: bold;" ${canAddPotion ? '' : 'disabled'}>
                                ${canAddPotion ? `🎒 ${t('addToInventory')}` : `🚫 ${t('maxPotionsReached')}`}
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
                                ${hasEquipped ? `<div style="color: #f39c12; font-weight: bold; font-size: 0.85em; margin-top: 5px;">💰 ${currentEquipped.sellValue || Math.floor(currentEquipped.price * 0.1)}</div>` : ''}
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
                                ${currentRing ? `<div style="color: #f39c12; font-weight: bold; font-size: 0.85em; margin-top: 5px;">💰 ${currentRing.sellValue || Math.floor(currentRing.price * 0.1)}</div>` : ''}
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

        // Check if there are equipment items (non-potion) remaining
        const hasEquipment = remainingItems.some(item => item && item.type !== 'potion');
        const buttonText = hasEquipment ? t('continueAdventure') : t('continueOnly');

        content.innerHTML = `
            <h2 style="text-align: center; margin-bottom: 20px;">🎁 ${t('victoryLoot')} 🎁</h2>
            <p style="text-align: center; margin-bottom: 20px; color: #666;">
                ${t('chooseItems')}
            </p>
            <div style="text-align: center; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 20px;">
                ${itemsHTML}
            </div>
            <div class="modal-buttons">
                <button id="close-loot-btn" class="modal-btn primary">${buttonText}</button>
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
            if (keepBtn && !keepBtn.disabled) {
                keepBtn.addEventListener('click', () => {
                    if (gameState.player.canAddPotion(item)) {
                        gameState.player.inventory.push(item);
                        logEvent(`${t('addedToInventory')} ${item.emoji} ${item.name}`);
                        lootItems[idx] = null;
                        updateInventoryUI();
                        renderLootUI();
                    }
                });
            }

            // Equipment: Equip button (weapon/armor/ring)
            const equipBtn = content.querySelector(`.loot-equip-btn-${idx}`);
            if (equipBtn) {
                equipBtn.addEventListener('click', () => {
                    if (item.type === 'weapon') {
                        if (gameState.player.equippedWeapon) {
                            const oldItem = gameState.player.equippedWeapon;
                            const oldSellPrice = oldItem.sellValue || Math.floor(oldItem.price * 0.1);
                            gameState.player.gainMoney(oldSellPrice);
                            logEvent(`${t('sold')} ${oldItem.emoji} ${oldItem.name} ${t('for')} ${oldSellPrice} ${t('coins')}`);
                        }
                        gameState.player.equippedWeapon = item;
                        playSound('equip', 0.8);
                        logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
                    } else if (item.type === 'armor') {
                        if (gameState.player.equippedArmor) {
                            const oldItem = gameState.player.equippedArmor;
                            const oldSellPrice = oldItem.sellValue || Math.floor(oldItem.price * 0.1);
                            gameState.player.gainMoney(oldSellPrice);
                            logEvent(`${t('sold')} ${oldItem.emoji} ${oldItem.name} ${t('for')} ${oldSellPrice} ${t('coins')}`);
                        }
                        gameState.player.equippedArmor = item;
                        playSound('equip', 0.8);
                        logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
                    } else if (item.type === 'ring') {
                        if (gameState.player.equippedRing) {
                            const oldItem = gameState.player.equippedRing;
                            const oldSellPrice = oldItem.sellValue || Math.floor(oldItem.price * 0.1);
                            gameState.player.gainMoney(oldSellPrice);
                            logEvent(`${t('sold')} ${oldItem.emoji} ${oldItem.name} ${t('for')} ${oldSellPrice} ${t('coins')}`);
                        }
                        gameState.player.equippedRing = item;
                        playSound('equip', 0.8);
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
                    const sellPrice = item.sellValue || Math.floor(item.price * 0.1);
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
                        if (gameState.player.canAddPotion(item)) {
                            gameState.player.inventory.push(item);
                            logEvent(`${t('addedToInventory')} ${item.emoji} ${item.name}`);
                        } else {
                            // Auto-sell if potion limit reached
                            const sellPrice = item.sellValue || Math.floor(item.price * 0.1);
                            gameState.player.gainMoney(sellPrice);
                            logEvent(`${t('potionFullSold')} ${sellPrice} ${t('coins')}`);
                        }
                    } else if (item) {
                        // Auto-sell unclaimed equipment
                        const sellPrice = item.sellValue || Math.floor(item.price * 0.1);
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

export function openShop() {
    gameState.currentPhase = 'shop';

    // Generate 3 random items - use round/set scaling
    const itemTypes = ['weapons', 'armors', 'potions', 'rings'];
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
                            ${currentEquipped ? `<div style="color: #f39c12; font-weight: bold; font-size: 0.85em; margin-top: 5px;">💰 ${currentEquipped.sellValue || Math.floor(currentEquipped.price * 0.1)}</div>` : ''}
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
            // Check if supply round should start after this shop
            if (gameState.pendingSupplyRound) {
                gameState.pendingSupplyRound = false;
                // Import dynamically to avoid circular dependency
                import('./game.js').then(module => {
                    setTimeout(() => module.startSupplyRound(), TIMING.bossFightDelay);
                });
            }
        });
    }

    modal.classList.remove('hidden');
    renderShop();
}

export function buyItem(index) {
    const item = gameState.shopItems[index];
    if (!item) return;

    // Check if potion and limit reached - prevent purchase
    if (item.type === 'potion' && !gameState.player.canAddPotion(item)) {
        logEvent(`${t('potionFullSold')} 0 ${t('coins')}`);
        return;
    }

    if (!gameState.player.spendMoney(item.price)) {
        return;
    }

    // Note: coin sound already plays from spendMoney()
    logEvent(`${t('bought')} ${item.emoji} ${item.name} ${t('for')} ${item.price} ${t('coins')}!`);

    // Handle based on item type
    if (item.type === 'potion') {
        gameState.player.inventory.push(item);
        logEvent(`${t('addedToInventory')} ${item.emoji} ${item.name}`);
    } else if (item.type === 'weapon') {
        if (gameState.player.equippedWeapon) {
            const oldItem = gameState.player.equippedWeapon;
            const oldSellPrice = oldItem.sellValue || Math.floor(oldItem.price * 0.1);
            gameState.player.gainMoney(oldSellPrice);
            logEvent(`${t('sold')} ${oldItem.emoji} ${oldItem.name} ${t('for')} ${oldSellPrice} ${t('coins')}`);
        }
        gameState.player.equippedWeapon = item;
        playSound('equip', 0.8);
        logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
    } else if (item.type === 'armor') {
        if (gameState.player.equippedArmor) {
            const oldItem = gameState.player.equippedArmor;
            const oldSellPrice = oldItem.sellValue || Math.floor(oldItem.price * 0.1);
            gameState.player.gainMoney(oldSellPrice);
            logEvent(`${t('sold')} ${oldItem.emoji} ${oldItem.name} ${t('for')} ${oldSellPrice} ${t('coins')}`);
        }
        gameState.player.equippedArmor = item;
        playSound('equip', 0.8);
        logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
    } else if (item.type === 'ring') {
        if (gameState.player.equippedRing) {
            const oldRing = gameState.player.equippedRing;
            const oldSellPrice = oldRing.sellValue || Math.floor(oldRing.price * 0.1);
            gameState.player.gainMoney(oldSellPrice);
            logEvent(`${t('sold')} ${oldRing.emoji} ${oldRing.name} ${t('for')} ${oldSellPrice} ${t('coins')}`);
        }
        gameState.player.equippedRing = item;
        playSound('equip', 0.8);
        logEvent(`${t('equipped')} ${item.emoji} ${item.name}`);
    }

    // Mark item as bought
    gameState.shopItems[index] = null;
    updateUI();
    updateInventoryUI();
}

// ========================================
// TREASURE
// ========================================

export function openTreasure() {
    // Use round/set scaling for treasure gold
    const roundScale = ROUND_SCALING[gameState.round] || ROUND_SCALING[5];
    const setMult = getSetMultiplier(gameState.set);
    const coins = Math.floor((12 + Math.random() * 18) * roundScale.gold * setMult);
    gameState.player.gainMoney(coins);
    logEvent(`💎 ${t('treasure')}: 💰 ${coins} ${t('coins')}`);
    updateUI();

    // 50% chance for item
    if (Math.random() < 0.5) {
        // Weighted item pool: weapons 30%, armors 30%, potions 15%, rings 25%
        const itemPool = ['weapons', 'weapons', 'weapons', 'armors', 'armors', 'armors', 'potions', 'rings', 'rings', 'rings'];
        const itemType = itemPool[Math.floor(Math.random() * itemPool.length)];
        const levelScale = 1 + (gameState.round - 1) * 0.2 + (gameState.set - 1) * 0.3;
        const item = createRandomItem(itemType, levelScale);
        // Show loot modal for the item
        showLootModal([item]);
    }
}

// ========================================
// ITEM USAGE
// ========================================

export function useItem(index) {
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

export function sellItem(index) {
    const item = gameState.player.inventory[index];
    if (!item) return;

    const sellPrice = item.sellValue || Math.floor(item.price * 0.1);
    gameState.player.gainMoney(sellPrice);
    gameState.player.inventory.splice(index, 1);
    logEvent(`${t('sold')} ${item.emoji} ${item.name} ${t('for')} ${sellPrice} ${t('coins')}!`);
    updateInventoryUI();
}

// ========================================
// GAME OVER
// ========================================

export function gameOver() {
    gameState.currentPhase = 'gameOver';

    // Select random equipped item to keep (weapon, armor, or ring)
    let keptItem = null;
    const equippedItems = [
        gameState.player.equippedWeapon,
        gameState.player.equippedArmor,
        gameState.player.equippedRing
    ].filter(item => item !== null);

    if (equippedItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * equippedItems.length);
        keptItem = equippedItems[randomIndex];
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

    // Add event listener for restart button - import dynamically to avoid circular dependency
    document.getElementById('restart-btn').addEventListener('click', () => {
        import('./game.js').then(module => {
            module.restartGame();
        });
    });
}

// ========================================
// MODAL HELPERS
// ========================================

export function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('modal-content').classList.remove('combat-modal');
}

// ========================================
// PANEL COLLAPSE
// ========================================

export function togglePanel(panelId) {
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

// Attach to window for onclick handlers
window.togglePanel = togglePanel;
