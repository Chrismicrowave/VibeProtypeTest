// ========================================
// SOUND SYSTEM
// ========================================

// Sound Effects Configuration (jsfxr presets)
export const SFX = {
    // Coin/gold pickup - short cheerful blip
    coin: [0,,0.0736,,0.2701,0.4643,,0.3433,,,,,,0.2277,,,,,1,,,0.1,,0.5],
    // Dice roll - quick rattle
    diceRoll: [1,,0.1701,,0.1,0.18,,-0.02,,,,,,,,,,,1,,,,,0.5],
    // Player move/step
    step: [0,,0.0478,,0.1307,0.2832,,-0.5765,,,,,,,,,,,1,,,,,0.5],
    // Player attack hit
    hit: [0,,0.1419,,0.1862,0.5765,,0.2727,,,,,,0.4799,,,,,1,,,,,0.5],
    // Player hurt
    hurt: [3,,0.1928,0.6476,0.2827,0.066,,,,,,,,,,,,,1,,,,,0.5],
    // Victory fanfare
    victory: [0,,0.1633,0.4592,0.4276,0.4262,,,,,,0.3892,0.6073,,,,,,1,,,,,0.5],
    // Defeat/death
    defeat: [3,,0.3582,0.5765,0.3474,0.0734,,,,,,,,,,0.6411,,,1,,,,,0.5],
    // Item pickup/equip
    equip: [0,,0.1419,,0.2855,0.6321,,,,,0.3219,0.5973,,,,,,,,1,,,,,0.5],
    // Button click
    click: [0,,0.0224,,0.1199,0.3546,,,,,,,,,,,,,1,,,,,0.5],
    // Level up / loop complete
    levelUp: [0,,0.2267,,0.3923,0.4714,,0.1949,,0.3428,0.4951,,,,,,,0.4096,1,,,,,0.5],
    // Error/blocked
    error: [3,,0.0849,,0.2102,0.2545,,0.3078,,,,,,,,,,,,1,,,,,0.5],
    // Heal
    heal: [0,,0.2041,0.4429,0.3061,0.157,,,,,0.2939,0.6341,,,,,,,,1,,,,,0.5],
    // Skill use
    skill: [0,,0.2621,0.3877,0.4228,0.1633,,0.3694,,,,0.5417,0.6073,,,,,,1,,,,,0.5],
    // Item/reward pickup - bright cheerful tone
    pickup: [0,,0.15,,0.35,0.45,,0.15,,0.25,0.4,,0.5,0.3,,,,,,1,,,,,0.5],
};

export let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

export function playSound(sfxName, pitch = 1.0) {
    if (!soundEnabled || !window.jsfxr) return;
    try {
        // Use Web Audio API for pitch control
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audio = new Audio();
        audio.src = jsfxr(SFX[sfxName]);

        // Set volume - lower for dice roll
        audio.volume = sfxName === 'diceRoll' ? 0.15 : 0.3;

        // If pitch is not 1.0, use Web Audio API for playback rate
        if (pitch !== 1.0) {
            const source = audioContext.createMediaElementSource(audio);
            const gainNode = audioContext.createGain();
            gainNode.gain.value = audio.volume;
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            audio.preservesPitch = false;
            audio.playbackRate = pitch;
        }

        audio.play().catch(() => {}); // Ignore autoplay errors
    } catch (e) {}
}

export function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    updateSoundButton();
}

export function updateSoundButton() {
    const btn = document.getElementById('sound-toggle-btn');
    if (btn) {
        btn.innerHTML = soundEnabled ? '🔊' : '🔇';
        btn.style.background = soundEnabled ? '#28a745' : '#6c757d';
        btn.title = soundEnabled ? 'Sound on' : 'Sound off';
    }
}

// Attach to window for onclick handlers
window.toggleSound = toggleSound;
