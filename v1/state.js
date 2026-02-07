// ========================================
// GAME STATE
// ========================================

// Centralized game state object - solves circular dependency issues
export const gameState = {
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
    eventLogMessages: [], // Store event log messages for re-render
    pendingSupplyRound: false, // Flag to trigger supply round after shop
    combatState: {
        enemyFrozen: false,
        enemyPoison: { active: false, percent: 0, turnsLeft: 0 },
        // Skill effects
        cloneActive: { active: false, turnsLeft: 0 },
        shelvesActive: { active: false, turnsLeft: 0, absorbLeft: 0 }
    },
    reviveCooldown: 0  // Rounds until revive is available again (0 = ready)
};
