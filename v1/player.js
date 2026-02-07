// ========================================
// PLAYER CLASS
// ========================================

import { MAX_POTIONS } from './config.js';
import { playSound } from './sound.js';

export class Player {
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
            money: 50
        };
        this.inventory = [];
        this.equippedWeapon = null;
        this.equippedArmor = null;
        this.equippedRing = null;
        this.equippedSkill = null;  // { type: 'HEALING', level: 1 }
        this.passiveSkill = null;   // { type: 'REVIVE', level: 1 }
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
        const actualDamage = Math.max(1, amount - this.getTotalDef());
        this.stats.hp = Math.max(0, this.stats.hp - actualDamage);
        playSound('hurt');
        // Note: updateUI() will be called by the caller
        return actualDamage;
    }

    heal(amount) {
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
        playSound('heal');
        // Note: updateUI() will be called by the caller
    }

    gainMoney(amount) {
        this.stats.money += amount;
        playSound('coin');
        // Note: updateUI() will be called by the caller
    }

    spendMoney(amount) {
        if (this.stats.money >= amount) {
            this.stats.money -= amount;
            playSound('coin');
            // Note: updateUI() will be called by the caller
            return true;
        }
        return false;
    }

    addItem(item) {
        this.inventory.push(item);
        // Note: updateInventoryUI() will be called by the caller
    }

    countPotionsByType(statType) {
        return this.inventory.filter(item =>
            item.type === 'potion' && item.stats[statType]
        ).length;
    }

    canAddPotion(item) {
        if (item.type !== 'potion') return true;
        if (item.stats.hp && this.countPotionsByType('hp') >= MAX_POTIONS) return false;
        if (item.stats.sp && this.countPotionsByType('sp') >= MAX_POTIONS) return false;
        return true;
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
