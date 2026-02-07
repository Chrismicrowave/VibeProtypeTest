// ========================================
// BOARD SYSTEM
// ========================================

import { TEST_MODE } from './config.js';
import { gameState } from './state.js';

// ========================================
// TILE TYPES
// ========================================

export const TILE_TYPES = {
    START: 'start',
    SHOP: 'shop',
    COMBAT: 'combat',
    TREASURE: 'treasure',
    SKILL_TRAINER: 'skillTrainer',
    EMPTY: 'empty'
};

export const TILE_EMOJIS = {
    start: '🏁',
    shop: '🏪',
    combat: '⚔️',
    treasure: '💎',
    skillTrainer: '⭐',
    empty: '🪙'
};

// ========================================
// BOARD GENERATION
// ========================================

export function generateBoard() {
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
        // NORMAL MODE: Random distribution with weighted tiles
        // Weights: combat 40%, empty 25%, shop 15%, treasure 12%, skillTrainer 8%
        const tileWeights = [
            { type: 'combat', weight: 40 },
            { type: 'empty', weight: 25 },
            { type: 'shop', weight: 15 },
            { type: 'treasure', weight: 12 },
            { type: 'skillTrainer', weight: 8 }
        ];
        const totalWeight = tileWeights.reduce((sum, t) => sum + t.weight, 0);

        function getRandomTile() {
            let rand = Math.random() * totalWeight;
            for (const tile of tileWeights) {
                rand -= tile.weight;
                if (rand <= 0) return tile.type;
            }
            return 'empty';
        }

        for (let i = 0; i < 32; i++) {
            // Tile 0 is always the start tile
            const type = i === 0 ? 'start' : getRandomTile();
            board.push({
                id: i,
                type: type,
                emoji: TILE_EMOJIS[type]
            });
        }
    }

    return board;
}

export function generateSupplyBoard() {
    // Special board with shop, treasure, and skill trainer tiles
    const board = [];
    const supplyDistribution = [
        'shop', 'treasure', 'skillTrainer', 'treasure', 'shop', 'treasure', 'skillTrainer', 'treasure',
        'shop', 'treasure', 'skillTrainer', 'treasure', 'shop', 'treasure', 'skillTrainer', 'treasure',
        'shop', 'treasure', 'skillTrainer', 'treasure', 'shop', 'treasure', 'skillTrainer', 'treasure',
        'shop', 'treasure', 'skillTrainer', 'treasure', 'shop', 'treasure', 'skillTrainer', 'treasure'
    ];

    for (let i = 0; i < 32; i++) {
        // Tile 0 is always the start tile
        const type = i === 0 ? 'start' : supplyDistribution[i];
        board.push({
            id: i,
            type: type,
            emoji: TILE_EMOJIS[type]
        });
    }

    return board;
}

// ========================================
// BOARD RENDERING
// ========================================

export function renderBoard() {
    const boardElement = document.getElementById('game-board');
    boardElement.innerHTML = '';

    // Add center panel (event log + dice display)
    const centerPanel = document.createElement('div');
    centerPanel.id = 'board-center';
    centerPanel.style.gridRow = '2 / 9';
    centerPanel.style.gridColumn = '2 / 9';
    centerPanel.style.display = 'flex';
    centerPanel.style.flexDirection = 'column';
    centerPanel.style.alignItems = 'center';
    centerPanel.style.justifyContent = 'center';
    centerPanel.style.padding = '15px';
    centerPanel.style.background = 'rgba(255, 255, 255, 0.95)';
    centerPanel.style.borderRadius = '15px';
    centerPanel.style.zIndex = '10';
    centerPanel.innerHTML = `
        <div id="event-log" style="background: #f8f9fa; padding: 10px; border-radius: 8px; width: 100%; max-height: 180px; overflow-y: auto; font-size: 0.85em;"></div>
    `;
    boardElement.appendChild(centerPanel);

    // Restore event log messages inline (avoid circular dependency with ui.js)
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
            // Apply progressive opacity fade
            const opacity = Math.max(0.2, Math.pow(0.8, index));
            p.style.opacity = opacity;
            logDiv.appendChild(p);
        });
    }

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

export function getTileGridPosition(tileIndex) {
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
