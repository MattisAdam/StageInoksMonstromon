
// Liste des monstres
const monsters = [
    { name: "Feuro", img: "/Img/feuro.png", type: "Feu", level: 0 },
    { name: "Plantu", img: "/Img/plantu.png", type: "Plante", level: 0 },
    { name: "Aquano", img: "/Img/aquano.png", type: "Eau", level: 0 },
    { name: "Flamib", img: "/Img/flamib.png", type: "Feu", level: 0 },
    { name: "Bouisou", img: "/Img/bouisou.png", type: "Plante", level: 0 },
    { name: "Goutti", img: "/Img/goutti.png", type: "Eau", level: 0 }
];

const levelThresholds = [100, 250, 350, 450];


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomMonster() {
    return monsters[Math.floor(Math.random() * monsters.length)];
}

function updateLevel(monster) {
    let level = 0;
    for (let i = 0; i < levelThresholds.length; i++) {
        if (monster.hp > levelThresholds[i]) level = i + 1;
    }
    monster.level = level;
}

// Choisir les monstres
let player = getRandomMonster();
let enemy = getRandomMonster();
while (enemy.name === player.name) enemy = getRandomMonster();

// Ajouter PV
player.hp = player.maxHp = randomInt(50, 500);
enemy.hp = enemy.maxHp = randomInt(50, 500);
updateLevel(player);
updateLevel(enemy);
let turn = 'player';

// Mettre à jour le DOM
function updateDOM() {
    document.getElementById("playerImg").src = player.img;
    document.getElementById("playerName").textContent = player.name;
    document.getElementById("playerType").textContent = "Type: " + player.type;
    document.getElementById("playerLevel").textContent = "Level: " + player.level;

    document.getElementById("enemyImg").src = enemy.img;
    document.getElementById("enemyName").textContent = enemy.name;
    document.getElementById("enemyType").textContent = "Type: " + enemy.type;
    document.getElementById("enemyLevel").textContent = "Level: " + enemy.level;


    updateHP();
}

// Mise à jour des PV
function updateHP() {
    const pPct = (player.hp / player.maxHp) * 100;
    const ePct = (enemy.hp / enemy.maxHp) * 100;

    document.getElementById("playerHpBar").style.width = pPct + "%";
    document.getElementById("enemyHpBar").style.width = ePct + "%";

    document.getElementById("playerHpText").textContent = `HP: ${player.hp} / ${player.maxHp}`;
    document.getElementById("enemyHpText").textContent = `HP: ${enemy.hp} / ${enemy.maxHp}`;

    document.getElementById("playerHpBar").style.background = pPct > 50 ? "#34d399" : pPct > 25 ? "#facc15" : "#ef4444";
    document.getElementById("enemyHpBar").style.background = ePct > 50 ? "#34d399" : ePct > 25 ? "#facc15" : "#ef4444";
}

// Calcul type avantage
function typeEffectiveness(attackerType, defenderType) {
    if (attackerType === defenderType) return 1;
    if (attackerType === "Feu" && defenderType === "Plante") return 1.4;
    if (attackerType === "Plante" && defenderType === "Eau") return 1.4;
    if (attackerType === "Eau" && defenderType === "Feu") return 1.4;
    if (attackerType === "Feu" && defenderType === "Eau") return 0.7;
    if (attackerType === "Plante" && defenderType === "Feu") return 0.7;
    if (attackerType === "Eau" && defenderType === "Plante") return 0.7;
    return 1;
}

// Attaque du joueur
function attack(type) {
    if (turn !== 'player' || player.hp <= 0 || enemy.hp <= 0) return;
    let base = type === 'weak' ? randomInt(5, 12) : randomInt(12, 25);
    let dmg = Math.round(base * typeEffectiveness(player.type, enemy.type));

    if (player.level != 0)
        enemy.hp = Math.max(0, enemy.hp - dmg * player.level);
    else {
        enemy.hp = Math.max(0, enemy.hp - dmg);
    }
    updateHP();

    if (enemy.hp <= 0) {
        alert("🎉 Victoire ! " + player.name + " a tué " + enemy.name);
        return;
    }

    turn = 'enemy';
    setTimeout(enemyAttack, 700);
}

// Attaque de l’ennemi
function enemyAttack() {
    if (player.hp <= 0 || enemy.hp <= 0) return;

    const type = Math.random() < 0.5 ? 'weak' : 'strong';
    let dmg = type === 'weak' ? randomInt(4, 10) : randomInt(10, 20);
    dmg = Math.round(dmg * typeEffectiveness(enemy.type, player.type));
    if (enemy.level != 0)
        player.hp = Math.max(0, player.hp - dmg * enemy.level);
    else {
        player.hp = Math.max(0, player.hp - dmg);
    }
    updateHP();

    if (player.hp <= 0) {
        alert("💀 Défaite...");
        return;
    }

    turn = 'player';
}



// Initialisation
updateDOM();
