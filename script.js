// ============================================================
// BANANA TYCOON — lógica do jogo
// Consolidado: cada função agora existe uma única vez.
// ============================================================

// Variáveis do jogo
let money = 0.00;
let milkshakes = 0;
let milkshakeIncome = 0.05;
let rebirths = 0;
let bananaPowerActive = false;
let milkshakePrice = 30.00;
let upgradePrice = 100.00;
let rebirthPrice = 500.00;
let turboActive = false;
const turboDuration = 10000;
let timeExtenderActive = false; // Para o Time Extender
let bananaShieldActive = false; // Para o Banana Shield
let bananaRainActive = false;
const maxBananas = 20;  // Número máximo de bananas caindo na tela ao mesmo tempo
const bananaContainer = document.getElementById('banana-rain-container');
let rainCount = 0;
let autoClickers = 0; // Número de Auto Clickers comprados
let autoClickerPrice = 500; // Preço inicial
let autoClickerInterval = 5000; // Intervalo inicial (ms)
let upgradesPurchased = 0; // Contador de upgrades comprados
let milkshakeFactoryCount = 0; // Contador de Milkshake Factorys
let milkshakeFactoryPrice = 1000; // Preço inicial da Milkshake Factory
let milkshakeFactoryMultiplier = 1.2; // Multiplicador de aumento na produção por cada fábrica
let rebirthBonus = 100; // Bônus inicial de moedas para o rebirth

// Variáveis específicas para o evento Banana Vermelha
let redBananaActive = false;
let redBananaClickCount = 0;
let redBananaEventClicks = 0;
const redBananaRequiredClicks = 45;
const redBananaTriggerClicks = 325;
const redBananaReward = 525;

// Variáveis exclusivas do evento Red_CEO4
let redCEO4Cooldown = false;
const redCEO4CooldownTime = 125000; // ~125 segundos
const redCEO4WinChance = 0.4; // 40% de chance de vitória
const redCEO4RewardMultiplier = 2; // Dobra as moedas ao vencer
const redCEO4Penalty = 0.5; // Perde metade das moedas ao perder
let redCEO4CooldownTimer;

// Barra de progresso (evento do "Batata / Santa")
let clickCountForProgress = 0;
const totalClicksForCompletion = 125;
const rewardAmount = 225;
let progressBarActive = false;

let shieldActive = false;
let speedBoostActive = false;
let rainOfCoinsActive = false;

// Máquina caça-níqueis
let slotPrice = 200;
let slotJackpot = 10000;
let slotActive = false;
let slotCooldown = false;

// Present Hunt
let presentCooldown = false;
const cooldownTime = 40000; // 40 segundos

// ============================================================
// CLIQUE NA BANANA
// ============================================================
function clickBanana() {
  money += turboActive ? milkshakeIncome * 2 : milkshakeIncome;
  money = parseFloat(money.toFixed(2));
  updateInfo();

  trackMission("Click on the banana 100 times");
  handleRedBananaEvent();
  startBananaRain();
}

// ============================================================
// ATUALIZAÇÃO DE INTERFACE
// ============================================================
function updateInfo() {
  document.getElementById('money').textContent = money.toFixed(2);
  document.getElementById('milkshakes').textContent = milkshakes;
  document.getElementById('rebirths').textContent = rebirths;
}

function updatePrices() {
  document.getElementById('current-milkshake-price').textContent = milkshakePrice.toFixed(2);
  document.getElementById('current-upgrade-price').textContent = upgradePrice.toFixed(2);
  document.getElementById('current-rebirth-price').textContent = rebirthPrice.toFixed(2);
}

// ============================================================
// NOTIFICAÇÕES
// ============================================================
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.classList.add('notification', type);

  const emoji = document.createElement('span');
  emoji.classList.add('emoji');
  if (type === 'success') emoji.textContent = '✔️';
  else if (type === 'error') emoji.textContent = '❌️';
  else if (type === 'conquest') emoji.textContent = '🏆';
  else if (type === 'warning') emoji.textContent = '❗️';

  const text = document.createElement('span');
  text.textContent = message;

  notification.appendChild(emoji);
  notification.appendChild(text);
  document.body.appendChild(notification);

  setTimeout(() => { notification.style.right = '20px'; }, 10);
  setTimeout(() => { notification.style.animation = 'fadeOut 0.5s ease-out forwards'; }, 3000);
  setTimeout(() => { notification.remove(); }, 4000);
}

// ============================================================
// COMPRAS DA LOJA
// ============================================================
function buyMilkshake() {
  if (money >= milkshakePrice) {
    money -= milkshakePrice;
    milkshakes++;

    const milkshakeBonus = milkshakes % 10 === 0 ? 0.1 : 0.05;
    milkshakeIncome += milkshakeBonus;
    milkshakePrice += 30;

    updateInfo();
    updatePrices();

    showNotification(
      `You bought a Milkshake! Income per click: ${milkshakeIncome.toFixed(2)}`,
      'success'
    );

    animateMilkshakeButton();
  } else {
    const coinsNeeded = milkshakePrice - money;
    showNotification(
      `Not enough coins to buy a milkshake! You need ${coinsNeeded.toFixed(2)} more coins.`,
      'error'
    );
  }
}

function animateMilkshakeButton() {
  const button = document.getElementById('buy-shake');
  button.style.transform = 'scale(1.2)';
  button.style.boxShadow = '0 0 15px #FFD700';

  setTimeout(() => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '';
  }, 300);
}

function buyUpgrade() {
  if (money >= upgradePrice) {
    money -= upgradePrice;

    const bonusMultiplier = 1 + (rebirths * 0.05);
    milkshakeIncome *= 1.03 * bonusMultiplier;
    upgradePrice += 125;
    upgradesPurchased++;

    updateInfo();
    updatePrices();

    showNotification(
      `Upgrade purchased! Milkshake income increased by ${(0.03 * bonusMultiplier * 100).toFixed(2)}%. Total upgrades: ${upgradesPurchased}`,
      'success'
    );

    animateUpgradeButton();

    if (upgradesPurchased % 10 === 0) {
      money += 500;
      showNotification('Milestone reached: Bonus 500 coins!', 'conquest');
    }
  } else {
    showNotification('Not enough coins to purchase the Upgrade!', 'error');
  }
}

function animateUpgradeButton() {
  const upgradeButton = document.getElementById('buy-upgrade');
  upgradeButton.style.transform = 'scale(1.2)';
  upgradeButton.style.boxShadow = '0 0 10px #FFD700';

  setTimeout(() => {
    upgradeButton.style.transform = 'scale(1)';
    upgradeButton.style.boxShadow = '';
  }, 300);
}

// ============================================================
// REBIRTH
// ============================================================
function performRebirth() {
  if (money >= rebirthPrice) {
    money -= rebirthPrice;
    rebirths++;

    const multiplier = 1 + rebirths * 0.1;

    milkshakes = 0;
    milkshakeIncome = 0.05 * multiplier;
    milkshakePrice = 30.00;
    rebirthPrice += 250;

    updateInfo();
    updatePrices();

    showNotification(
      `Rebirth successful! Multiplier is now ${multiplier.toFixed(2)}x.`,
      'success'
    );

    money += rebirthBonus;
    updateInfo();

    startRebirthEmojiRain();
  } else {
    showNotification('Not enough coins to perform Rebirth!', 'error');
  }
}

function startRebirthEmojiRain() {
  const maxEmojis = 15;
  let emojiCount = 0;

  const interval = setInterval(() => {
    if (emojiCount >= maxEmojis) {
      clearInterval(interval);
      return;
    }

    const emoji = document.createElement('div');
    emoji.classList.add('rebirth-emoji');
    emoji.textContent = '🔄';

    emoji.style.position = 'absolute';
    emoji.style.left = `${Math.random() * window.innerWidth}px`;
    emoji.style.top = '-30px';
    emoji.style.fontSize = '30px';
    emoji.style.transition = 'top 2s linear';

    document.body.appendChild(emoji);

    setTimeout(() => { emoji.style.top = `${window.innerHeight}px`; }, 10);
    setTimeout(() => { emoji.remove(); }, 2500);

    emojiCount++;
  }, 100);
}

// ============================================================
// AUTO CLICKER
// ============================================================
function buyAutoClicker() {
  if (money >= autoClickerPrice) {
    money -= autoClickerPrice;
    autoClickers++;
    autoClickerPrice = Math.ceil(autoClickerPrice * 1.5);
    autoClickerInterval = Math.max(500, autoClickerInterval - 200);

    setInterval(() => clickBanana(), autoClickerInterval);

    updateInfo();
    updatePrices();

    showNotification(
      `Auto Clicker purchased! Active Clickers: ${autoClickers}, Interval: ${autoClickerInterval / 1000}s`,
      'success'
    );

    animateAutoClicker();
  } else {
    showNotification("You don't have enough coins to buy Auto Clicker!", 'error');
  }
}

function animateAutoClicker() {
  const autoClickerButton = document.getElementById('buy-auto-clicker');
  autoClickerButton.style.transform = 'scale(1.2)';
  autoClickerButton.style.backgroundColor = '#32CD32';

  setTimeout(() => {
    autoClickerButton.style.transform = 'scale(1)';
    autoClickerButton.style.backgroundColor = '';
  }, 300);
}

function updateAutoClickerDescription() {
  document.getElementById('auto-clicker-interval').textContent = (autoClickerInterval / 1000).toFixed(1);
  document.getElementById('auto-clicker-count').textContent = autoClickers;
  document.getElementById('buy-auto-clicker').textContent = `🔄 Auto Clicker - ${autoClickerPrice} 💰`;
}

// ============================================================
// GOLDEN BANANA / MILKSHAKE FACTORY
// ============================================================
function buyGoldenBanana() {
  if (money >= 800) {
    money -= 800;
    const originalIncome = milkshakeIncome;
    milkshakeIncome *= 2;
    updateInfo();
    showNotification('Golden Banana activated!', 'success');
    setTimeout(() => {
      milkshakeIncome = originalIncome;
      updateInfo();
    }, 30000);
  } else {
    showNotification("You don't have enough coins to buy Golden Banana!", 'error');
  }
}

function buyMilkshakeFactory() {
  if (money >= milkshakeFactoryPrice) {
    money -= milkshakeFactoryPrice;
    milkshakeFactoryCount++;

    milkshakeIncome *= milkshakeFactoryMultiplier;
    milkshakeFactoryPrice = Math.ceil(milkshakeFactoryPrice * 1.5);

    updateInfo();
    updatePrices();

    showNotification(
      `Milkshake Factory purchased! Your milkshake income increased by ${(milkshakeFactoryMultiplier - 1) * 100}%! Total factories: ${milkshakeFactoryCount}`,
      'success'
    );

    animateMilkshakeFactoryButton();
  } else {
    showNotification('Not enough coins to buy a Milkshake Factory!', 'error');
  }
}

function animateMilkshakeFactoryButton() {
  const button = document.querySelector('.shop-item button');
  button.style.transform = 'scale(1.2)';
  button.style.backgroundColor = '#32CD32';

  setTimeout(() => {
    button.style.transform = 'scale(1)';
    button.style.backgroundColor = '';
  }, 300);
}

// ============================================================
// EVENTO: BANANA VERMELHA
// ============================================================
function handleRedBananaEvent() {
  if (!redBananaActive) {
    redBananaClickCount++;
    if (redBananaClickCount >= redBananaTriggerClicks) {
      triggerRedBananaEvent();
    }
  } else {
    redBananaEventClicks++;
    if (redBananaEventClicks >= redBananaRequiredClicks) {
      resetRedBananaEvent(true);
    }
  }
}

function triggerRedBananaEvent() {
  redBananaActive = true;
  redBananaClickCount = 0;
  redBananaEventClicks = 0;

  const banana = document.getElementById('banana');
  showNotification('RV has removed all your positions! Click quickly to recover them!', 'warning');

  const countdown = document.createElement('div');
  countdown.id = 'red-banana-countdown';
  document.body.appendChild(countdown);

  let timeLeft = timeExtenderActive ? 15 : 10;
  countdown.textContent = timeLeft;

  const timer = setInterval(() => {
    timeLeft--;
    countdown.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      if (redBananaActive) {
        resetRedBananaEvent(false);
      }
    }
  }, 1000);

  banana.style.color = 'red';
}

function resetRedBananaEvent(success) {
  redBananaActive = false;

  const banana = document.getElementById('banana');
  const countdown = document.getElementById('red-banana-countdown');

  if (countdown) countdown.remove();
  banana.style.color = '';

  if (success) {
    showNotification(`You have recovered your positions and earned ${redBananaReward} coins!`, 'success');
    money += redBananaReward;
  } else {
    handleFailedEvent();
  }

  updateInfo();
}

function handleFailedEvent() {
  if (bananaShieldActive) {
    showNotification('The Banana Shield protected you from losing coins!', 'success');
  } else {
    money = Math.max(0, money - 50);
    showNotification('You lost your positions and 50 coins!', 'error');
  }
  updateInfo();
}

// ============================================================
// POWER-UPS TEMPORÁRIOS
// ============================================================
function buyTimeExtender() {
  if (money >= 1500) {
    money -= 1500;
    timeExtenderActive = true;
    showNotification('Time Extender activated! Special events will last 5 seconds longer', 'success');
    setTimeout(() => { timeExtenderActive = false; }, 30000);
    updateInfo();
  } else {
    showNotification("You don't have enough coins to buy Time Extender!", 'error');
  }
}

function buyBananaShield() {
  if (money >= 2000) {
    money -= 2000;
    bananaShieldActive = true;
    showNotification('Banana Shield activated! You are protected from losing coins in failed events', 'success');
    setTimeout(() => { bananaShieldActive = false; }, 30000);
    updateInfo();
  } else {
    showNotification("You don't have enough coins to buy Banana Shield!", 'error');
  }
}

// ============================================================
// MISSÕES DIÁRIAS
// ============================================================
let dailyMissions = [
  { description: "Click on the banana 100 times", progress: 0, goal: 100, reward: 50 },
  { description: "Buy 5 upgrades", progress: 0, goal: 5, reward: 100 },
  { description: "Complete a Rebirth", progress: 0, goal: 1, reward: 200 }
];

function trackMission(missionType) {
  const mission = dailyMissions.find(m => m.description === missionType);
  if (mission) {
    mission.progress++;
    if (mission.progress >= mission.goal) {
      showNotification(`Mission Complete: ${mission.description}`, 'conquest');
      money += mission.reward;
      mission.progress = 0;
    }
    updateInfo();
  }
}

// ============================================================
// LOJA (MODAL)
// ============================================================
const shopButton = document.getElementById('shopButton');
const shopModal = document.getElementById('shopModal');
const closeShop = document.getElementById('closeShop');

function openShop() {
  shopModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeShopModal() {
  shopModal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

shopButton.addEventListener('click', openShop);
closeShop.addEventListener('click', closeShopModal);
shopModal.addEventListener('click', (event) => {
  if (event.target === shopModal) {
    closeShopModal();
  }
});

// ============================================================
// CHUVA DE BANANAS
// ============================================================
function startBananaRain() {
  if (bananaRainActive) return;
  bananaRainActive = true;

  const interval = setInterval(() => {
    if (rainCount >= maxBananas) {
      clearInterval(interval);
      bananaRainActive = false;
      return;
    }

    const bananaEmoji = document.createElement('div');
    bananaEmoji.classList.add('banana-emoji');
    bananaEmoji.textContent = '🍌';

    const randomX = Math.random() * window.innerWidth;
    bananaEmoji.style.left = `${randomX}px`;

    bananaContainer.appendChild(bananaEmoji);
    rainCount++;

    setTimeout(() => {
      bananaEmoji.remove();
      rainCount--;
    }, 3000);
  }, 100);
}

// ============================================================
// BARRA DE PROGRESSO
// ============================================================
function updateProgressBar() {
  const progressBar = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');

  const progressPercentage = (clickCountForProgress / totalClicksForCompletion) * 100;

  progressBar.style.width = `${progressPercentage}%`;
  progressText.textContent = `${Math.floor(progressPercentage)}%`;

  if (clickCountForProgress >= totalClicksForCompletion) {
    money += rewardAmount;
    updateInfo();
    showNotification(`Santa Claus (Batata) gave you ${rewardAmount} coins!`, 'success');
    clickCountForProgress = 0;
    progressBarActive = false;
  }
}

function clickBananaForProgress() {
  if (progressBarActive) {
    clickCountForProgress++;

    if (clickCountForProgress > totalClicksForCompletion) {
      clickCountForProgress = totalClicksForCompletion;
    }

    updateProgressBar();
  }
}

function startProgressBar() {
  if (!progressBarActive) {
    progressBarActive = true;
    clickCountForProgress = 0;
    updateProgressBar();
  }
}

function initializeProgressBar() {
  const progressBarContainer = document.getElementById('progress-bar');

  const progressText = document.createElement('span');
  progressText.id = 'progress-text';
  progressBarContainer.appendChild(progressText);

  updateProgressBar();
}

initializeProgressBar();

document.getElementById('banana').addEventListener('click', () => {
  startProgressBar();
  clickBananaForProgress();
});

// ============================================================
// EVENTO: RED_CEO4 DUEL
// ============================================================
function handleRedCEO4Duel() {
  if (redCEO4Cooldown) return;

  triggerRedCEO4Event();
  startRedCEO4Cooldown();
}

function startRedCEO4Cooldown() {
  const button = document.getElementById("red-ceo4-button");
  redCEO4Cooldown = true;
  button.classList.add("cooldown");

  let remainingTime = redCEO4CooldownTime / 1000;
  button.dataset.cooldown = `${remainingTime}s`;

  redCEO4CooldownTimer = setInterval(() => {
    remainingTime--;
    button.dataset.cooldown = `${remainingTime}s`;

    if (remainingTime <= 0) {
      clearInterval(redCEO4CooldownTimer);
      redCEO4Cooldown = false;
      button.classList.remove("cooldown");
      button.textContent = "Red_CEO4 Duel";
    }
  }, 1000);
}

function triggerRedCEO4Event() {
  const overlay = document.createElement("div");
  overlay.id = "red-ceo4-overlay";

  overlay.innerHTML = `
    <h1>Red_CEO4 Duel Challenge!</h1>
    <p>
       "Red_CEO4 comes with an unexpected challenge. He invites you to a duel for the top of the rankings. The offer is tempting: double your coins in case of victory. But be careful, a defeat could cost you half your fortune. Will you have the courage to accept this confrontation or will you choose safety? The decision is yours."
    </p>
    <div>
      <button id="red-yes" onclick="handleRedCEO4Choice(true)">Accept</button>
      <button id="red-no" onclick="handleRedCEO4Choice(false)">Decline</button>
    </div>
  `;

  document.body.appendChild(overlay);
}

function handleRedCEO4Choice(isAccepted) {
  const overlay = document.getElementById("red-ceo4-overlay");
  overlay.remove();

  if (isAccepted) {
    const result = Math.random() < redCEO4WinChance ? "win" : "lose";

    if (result === "win") {
      money *= redCEO4RewardMultiplier;
      money = parseFloat(money.toFixed(2));
      showNotification("You won the duel! Your coins have doubled!", "success");
    } else {
      money *= redCEO4Penalty;
      money = parseFloat(money.toFixed(2));
      showNotification("You lost the duel! Half of your coins are gone.", "error");
    }
  } else {
    showNotification("You declined the duel. Red_CEO4 called you a coward.", "warning");
  }

  updateInfo();
}

// ============================================================
// GOLDEN CLICK
// ============================================================
function buyGoldenClick() {
  if (money >= 1000) {
    money -= 1000;
    showNotification('Golden Click activated! Clicks give random coins for 60 seconds.', 'success');

    function goldenClickEffect() {
      const randomCoins = Math.floor(Math.random() * 6) + 5;
      money += randomCoins;
      showNotification(`You collected ${randomCoins} coins!`, 'success');
      updateInfo();
    }

    document.getElementById('banana').addEventListener('click', goldenClickEffect);

    setTimeout(() => {
      document.getElementById('banana').removeEventListener('click', goldenClickEffect);
      showNotification('Golden Click effect ended.', 'error');
    }, 60000);
  } else {
    showNotification('Not enough coins for Golden Click!', 'error');
  }
}

// ============================================================
// RAIN OF COINS
// ============================================================
function buyRainOfCoins() {
  if (money >= 1500 && !rainOfCoinsActive) {
    money -= 1500;
    rainOfCoinsActive = true;
    showNotification('Rain of Coins activated! Collect as many coins as you can for 15 seconds.', 'success');

    let interval = setInterval(() => {
      const randomX = Math.random() * window.innerWidth;
      const coin = document.createElement('div');
      coin.textContent = '🪙';
      coin.classList.add('coin');
      coin.style.position = 'absolute';
      coin.style.left = `${randomX}px`;
      coin.style.top = '0px';
      coin.style.fontSize = '20px';
      coin.style.transition = 'top 1s ease-in-out';

      document.body.appendChild(coin);

      setTimeout(() => { coin.style.top = `${window.innerHeight}px`; }, 10);
      setTimeout(() => { coin.remove(); }, 1000);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      rainOfCoinsActive = false;
      showNotification('Rain of Coins effect has ended.', 'error');
    }, 15000);
  } else {
    showNotification('Not enough coins or Rain of Coins already active!', 'error');
  }
}

// ============================================================
// MÁQUINA CAÇA-NÍQUEIS
// ============================================================
function openSlotMachine() {
  if (slotActive) return;
  slotActive = true;

  const overlay = document.createElement('div');
  overlay.id = 'slot-machine-overlay';
  overlay.style.display = 'flex';

  overlay.innerHTML = `
    <div class="slot-machine">
      <h2>🎰 Batata Jackpot 🎰</h2>
      <div class="reels">
        <span id="reel1">🍟</span>
        <span id="reel2">🧋</span>
        <span id="reel3">🥛</span>
      </div>
      <button id="spin-button" onclick="spinSlotMachine()">Spin - ${slotPrice} 🪙</button>
      <button onclick="closeSlotMachine()">Close</button>
    </div>
  `;

  document.body.appendChild(overlay);
}

function closeSlotMachine() {
  const overlay = document.getElementById('slot-machine-overlay');
  if (overlay) {
    overlay.remove();
    slotActive = false;
  }
}

function spinSlotMachine() {
  if (slotCooldown) {
    showNotification('Please wait before spinning again!', 'warning');
    return;
  }

  if (money < slotPrice) {
    showNotification('Not enough coins to spin!', 'error');
    return;
  }

  slotCooldown = true;
  const spinButton = document.getElementById('spin-button');
  spinButton.disabled = true;
  spinButton.textContent = 'Spinning...';

  setTimeout(() => {
    slotCooldown = false;
    spinButton.disabled = false;
    spinButton.textContent = `Spin - ${slotPrice} 🪙`;
  }, 3000);

  money -= slotPrice;
  updateInfo();

  const emojis = ['🍟', '🧋', '🥛', '🍌'];
  const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3'),
  ];

  reels.forEach((reel, index) => {
    let spins = 15 + index * 5;
    const interval = setInterval(() => {
      reel.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      spins--;
      if (spins <= 0) clearInterval(interval);
    }, 100);
  });

  setTimeout(() => {
    const result = reels.map(reel => reel.textContent);

    if (result.every(e => e === '🍟')) {
      money += slotJackpot;
      showNotification(`🎉 JACKPOT! You won ${slotJackpot} coins!`, 'conquest');
    } else if (new Set(result).size === 1) {
      const tripleWin = 1000;
      money += tripleWin;
      showNotification(`Amazing! You won ${tripleWin} coins!`, 'success');
    } else if (result[0] === result[1] || result[0] === result[2] || result[1] === result[2]) {
      const partialWin = 200;
      money += partialWin;
      showNotification(`Great! You won ${partialWin} coins!`, 'success');
    } else {
      showNotification('Better luck next time!', 'error');
    }

    updateInfo();
  }, 2500);
}

// ============================================================
// PRESENT HUNT
// ============================================================
function startPresentHunt() {
  if (presentCooldown) {
    showNotification('⏳ Please wait before starting the event again!', 'warning');
    return;
  }

  if (money < 350) {
    showNotification('❌ Not enough coins to start the Present Hunt!', 'error');
    return;
  }

  money -= 350;
  updateInfo();
  presentCooldown = true;
  toggleButtonCooldown();

  showNotification("🎄 Moon dropped Santa's presents, help her pick them up 🎁", 'warning');

  let presentInterval = setInterval(() => {
    const present = document.createElement('div');

    // Recompensas corrigidas (o valor original do tipo "small" tinha um dígito
    // absurdo — 54 noves — que quebrava a economia do jogo em 60% dos casos).
    const presentTypes = [
      { type: 'small', emoji: '🎁', reward: 15, chance: 60 },
      { type: 'medium', emoji: '🎁', reward: 75, chance: 30 },
      { type: 'large', emoji: '🎁', reward: 450, chance: 7 },
      { type: 'rare', emoji: '🎁', reward: 750, chance: 3 }
    ];

    const randomChoice = () => {
      const rand = Math.random() * 100;
      let cumulativeChance = 0;

      for (let i = 0; i < presentTypes.length; i++) {
        cumulativeChance += presentTypes[i].chance;
        if (rand <= cumulativeChance) {
          return presentTypes[i];
        }
      }
      return presentTypes[presentTypes.length - 1];
    };

    const randomPresent = randomChoice();

    present.classList.add('present', randomPresent.type);
    present.textContent = randomPresent.emoji;
    present.style.position = 'absolute';
    present.style.left = `${Math.random() * 90}vw`;
    present.style.top = `${Math.random() * 80}vh`;
    present.dataset.reward = randomPresent.reward;

    document.body.appendChild(present);

    setTimeout(() => present.remove(), 5000);

    present.addEventListener('click', () => {
      money += Number(present.dataset.reward);
      updateInfo();
      showNotification(`🎁 You collected a present and earned ${present.dataset.reward} coins!`, 'success');
      present.remove();
    });
  }, 3000);

  setTimeout(() => {
    clearInterval(presentInterval);
    showNotification("🎄 You helped Moon get the presents, now you're on the good boy list 🎁", 'success');
    presentCooldown = false;
    toggleButtonCooldown();
  }, 20000);
}

function toggleButtonCooldown() {
  const button = document.getElementById('present-hunt-button');
  if (presentCooldown) {
    button.classList.add('disabled');
    button.disabled = true;
  } else {
    button.classList.remove('disabled');
    button.disabled = false;
  }
}
