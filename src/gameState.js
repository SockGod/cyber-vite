// ==================== ESTADO GLOBAL ====================

export const gameState = { 
    cyberSpace: 0, 
    shields: 5, 
    level: 1, 
    bombs: 2,
    highScore: parseInt(localStorage.getItem("spaceDelta_highScore")) || 1,
    isVerified: false, 
    isPaused: false,
    bossActive: false, 
    bossHP: 100, 
    enemiesDefeated: 0,
    isInvincible: false, 
    superShot: false,
    dualShot: false,
    screenShake: 0,
    isPlaying: false,

    // NOVOS POWERUPS
    slowMotion: false,
    magnetActive: false,
    megaShot: false,

    // MINI DRONES (temporários)
    miniDronesActive: false,
    miniDronesTimer: 0,
    miniDronesOffset: 60,

    // REVIVES (permanente)
    revives: 0,

    // INVENTORY PERMANENTE
    skinOwned: false,
    xpboost: 0,

    // REFERRAL CODE
    referralCode:
        localStorage.getItem("delta_myReferral") ||
        "DELTA-" + Math.random().toString(36).substring(2, 7).toUpperCase()
};

// Guardar referral code se ainda não existir
if (!localStorage.getItem("delta_myReferral")) {
    localStorage.setItem("delta_myReferral", gameState.referralCode);
}

// ==================== FUNÇÕES PARA A LOJA ====================

export function addShields(amount) {
    gameState.shields += amount;
}

export function addBombs(amount) {
    gameState.bombs += amount;
}

export function addRevive() {
    gameState.revives += 1;
}

export function buySkin() {
    gameState.skinOwned = true;
}

export function addXPBoost(amount) {
    gameState.xpboost += amount;
}

// ==================== LEVEL CONFIG ====================

export function getLevelConfig(lvl) {
    const baseReq = 20;
    const baseHP = 150;
    const colors = ["#ff00ff", "#00ff00", "#ffffff", "#00ffff", "#ffff00", "#ff0000"];

    return {
        enemyColor: colors[(lvl - 1) % colors.length],
        bossColor: colors[lvl % colors.length],
        bossHP: baseHP + lvl * 250,
        req: baseReq + lvl * 10,
        speed: Math.min(2 + lvl * 0.5, 7),
        fireRate: Math.min(0.005 + lvl * 0.006, 0.05)
    };
}

// ==================== FRASES E EFEITOS ====================

export const blockchainPhrases = [
    "MINING BLOCK...",
    "FIREWALL ACTIVE",
    "LIQUIDITY FOUND",
    "ENCRYPTING DATA...",
    "HACK ATTEMPT BLOCK!",
    "MAINNET SECURED",
    "PROOF OF WORK"
];

export let activePhrase = { text: "", alpha: 0 };
export let stars = [];
export let particles = [];

export function setActivePhrase(text, alpha = 2.0) {
    activePhrase.text = text;
    activePhrase.alpha = alpha;
}

// ==================== INVENTÁRIO PERMANENTE ====================

export function saveInventory() {
    localStorage.setItem("inventory", JSON.stringify({
        skinOwned: gameState.skinOwned,
        xpboost: gameState.xpboost,
        revives: gameState.revives
    }));
}
