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
    slowMotion: false,   // abrandar inimigos e boss
    magnetActive: false, // atrair moedas/powerups
    megaShot: false,     // tiro gigante que atravessa tudo

    // MINI DRONES (TRI-FORMATION)
    miniDronesActive: false,
    miniDronesTimer: 0,
    miniDronesOffset: 60, // distância lateral (Formação A) 

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

export function activateSuperShot() {
    gameState.superShot = true;
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
