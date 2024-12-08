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
let clickCount = 0;
let eventActive = false;
let clicksDuringEvent = 0;
const requiredClicks = 30;
const eventDuration = 10000; // 10 segundos
let autoClickers = 0; // Número de Auto Clickers comprados
let autoClickerPrice = 500; // Preço inicial
let autoClickerInterval = 5000; // Intervalo inicial (ms)
let upgradesPurchased = 0; // Contador de upgrades comprados
let milkshakeFactoryCount = 0; // Contador de Milkshake Factorys
let milkshakeFactoryPrice = 1000; // Preço inicial da Milkshake Factory
let milkshakeFactoryMultiplier = 1.2; // Multiplicador de aumento na produção por cada fábrica
let rebirthBonus = 100; // Bônus inicial de moedas para o rebirth

// Variáveis específicas para o evento Banana Vermelha
let redBananaActive = false; // Define se o evento está ativo
let redBananaClickCount = 0; // Contador de cliques para ativar o evento
let redBananaEventClicks = 0; // Contador de cliques durante o evento
const redBananaRequiredClicks = 45; // Número de cliques necessários durante o evento
const redBananaTriggerClicks = 325; // Número de cliques para disparar o evento
const redBananaReward = 525; // Recompensa do evento

// Variáveis exclusivas do evento
let redCEO4Cooldown = false; // Controle de cooldown
const redCEO4CooldownTime = 125000; // 120 segundos em milissegundos
const redCEO4WinChance = 0.4; // 40% de chance de vitória
const redCEO4RewardMultiplier = 2; // Dobra as moedas ao vencer
const redCEO4Penalty = 0.5; // Perde metade das moedas ao perder
let redCEO4CooldownTimer; // Armazena o intervalo do cooldown

// Variáveis específicas para o progresso e evento
let clickCountForProgress = 0;  // Contador de cliques para a barra de progresso
const totalClicksForCompletion = 125; // Número de cliques necessários para completar a barra de progresso
const rewardAmount = 225;  // Recompensa para o jogador
let progressBarActive = false;  // Flag para controlar o estado da barra de progresso

let shieldActive = false; // Shield ativo
let speedBoostActive = false; // Aumentar a velocidade de recompensa por clique
let rainOfCoinsActive = false;

// Variáveis Globais
let slotPrice = 200; // Custo inicial para girar a máquina
let slotJackpot = 10000; // Valor fixo do Jackpot
let slotActive = false; // Controle para evitar várias aberturas
let slotCooldown = false; // Controle para cooldown dos giros

let presentCooldown = false; // Variável para controle do cooldown
const cooldownTime = 40000; // 40 segundos em milissegundos


// Lógica do clique na banana
function clickBanana() {
  money += turboActive ? milkshakeIncome * 2 : milkshakeIncome;
  money = parseFloat(money.toFixed(2));
  updateInfo();
  trackMission("Click on the banana 100 times");

  // Controla eventos de forma independente
  if (!eventActive) handleRedBananaEvent(); // Evento da Banana Vermelha
  if (!redCEO4Active) handleRedCEO4Event(); // Evento do Red_CEO4
  // Controla eventos de forma independente
  if (!redCEO4Active) handleRedCEO4Event(); // Evento do Red_CEO4
}

// Atualiza as informações na tela
function updateInfo() {
  document.getElementById('money').textContent = money.toFixed(2);
  document.getElementById('milkshakes').textContent = milkshakes;
  document.getElementById('rebirths').textContent = rebirths;
}

// Lógica do clique na banana
function clickBanana() {
  money += turboActive ? milkshakeIncome * 2 : milkshakeIncome;
  money = parseFloat(money.toFixed(2));
  updateInfo();
  trackMission("Click on the banana 100 times");
  handleRedBananaEvent();
  handleRedCEO4Event();
}

// Função para comprar Milkshake
function buyMilkshake() {
  if (money >= milkshakePrice) {
    money -= milkshakePrice; // Deduz o preço
    milkshakes++;

    // Incremento dinâmico no rendimento
    const milkshakeBonus = milkshakes % 10 === 0 ? 0.1 : 0.05; // Bônus a cada 10 milkshakes
    milkshakeIncome += milkshakeBonus;

    // Progressão ajustada: Aumentar preço em 30 moedas fixas, em vez de multiplicar
    milkshakePrice += 30;

    updateInfo();
    updatePrices(); // Atualiza a interface com o novo preço

    // Notificação detalhada
    showNotification(
      `You bought a Milkshake! Income per click: ${milkshakeIncome.toFixed(2)}`,
      'success'
    );

    animateMilkshakeButton();
  } else {
    const coinsNeeded = milkshakePrice - money; // Calcula as moedas necessárias
    showNotification(
      `Not enough coins to buy a milkshake! You need ${coinsNeeded.toFixed(2)} more coins.`,
      'error'
    );
  }
}

// Função para animar o botão de compra
function animateMilkshakeButton() {
  const button = document.getElementById('buy-shake');
  button.style.transform = 'scale(1.2)';
  button.style.boxShadow = '0 0 15px #FFD700'; // Brilho dourado

  setTimeout(() => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = ''; // Remove o brilho após a animação
  }, 300);
}


// Função para comprar Upgrade
function buyUpgrade() {
  if (money >= upgradePrice) {
    money -= upgradePrice; // Deduz o preço

    // Bônus adicional baseado no número de rebirths
    const bonusMultiplier = 1 + (rebirths * 0.05); // 5% a mais por rebirth
    milkshakeIncome *= 1.03 * bonusMultiplier;

    // Aumentando o preço de forma linear de 100 em 100
    upgradePrice += 125;

    upgradesPurchased++; // Incrementa o contador de upgrades comprados

    updateInfo();
    updatePrices(); // Atualiza os preços na interface

    // Notificação com o impacto do upgrade
    showNotification(
      `Upgrade purchased! Milkshake income increased by ${(0.03 * bonusMultiplier * 100).toFixed(2)}%. Total upgrades: ${upgradesPurchased}`,
      'success'
    );

    animateUpgradeButton();

    // Recompensa progressiva a cada 10 upgrades
    if (upgradesPurchased % 10 === 0) {
      money += 500; // Bônus de 500 moedas a cada 10 upgrades
      showNotification('Milestone reached: Bonus 500 coins!', 'conquest');
    }
  } else {
    showNotification('Not enough coins to purchase the Upgrade!', 'error');
  }
}

// Função para exibir uma animação ao comprar um upgrade
function animateUpgradeButton() {
  const upgradeButton = document.getElementById('buy-upgrade');
  upgradeButton.style.transform = 'scale(1.2)';
  upgradeButton.style.boxShadow = '0 0 10px #FFD700'; // Brilho dourado

  setTimeout(() => {
    upgradeButton.style.transform = 'scale(1)';
    upgradeButton.style.boxShadow = ''; // Remove o brilho
  }, 300);
}


// Função para realizar Rebirth
function performRebirth() {
  if (money >= rebirthPrice) {
    // Deduz o custo e incrementa o número de rebirths
    money -= rebirthPrice;
    rebirths++;

    // Calcula o multiplicador baseado no número de rebirths
    const multiplier = 1 + rebirths * 0.1; // 10% a mais a cada rebirth

    // Redefine as estatísticas
    milkshakes = 0;
    milkshakeIncome = 0.05 * multiplier;
    milkshakePrice = 30.00; // Reinicia o preço do milkshake após rebirth
    rebirthPrice += 250; // Aumenta o preço linearmente em 250 moedas

    // Atualiza as informações na interface
    updateInfo();
    updatePrices();

    // Mensagem de feedback com sucesso
    showNotification(
      `Rebirth successful! Multiplier is now ${multiplier.toFixed(2)}x.`,
      'success'
    );

    // Concede um bônus ao jogador
    money += 100;
    updateInfo();

    // Gera a chuva de emojis
    startRebirthEmojiRain();
  } else {
    showNotification('Not enough coins to perform Rebirth!', 'error');
  }
}

// Função para iniciar a chuva de emojis 🔄
function startRebirthEmojiRain() {
  const maxEmojis = 15; // Máximo de emojis que cairão
  let emojiCount = 0;

  const interval = setInterval(() => {
    if (emojiCount >= maxEmojis) {
      clearInterval(interval);
      return;
    }

    const emoji = document.createElement('div');
    emoji.classList.add('rebirth-emoji');
    emoji.textContent = '🔄';

    // Configurações de estilo
    emoji.style.position = 'absolute';
    emoji.style.left = `${Math.random() * window.innerWidth}px`; // Posição horizontal aleatória
    emoji.style.top = '-30px'; // Começando fora da tela
    emoji.style.fontSize = '30px';
    emoji.style.transition = 'top 2s linear'; // Apenas animando a propriedade `top`

    document.body.appendChild(emoji);

    // Aguarda para fazer o emoji se mover até a parte inferior da tela
    setTimeout(() => {
      emoji.style.top = `${window.innerHeight}px`;
    }, 10);

    // Remove o emoji após ele sair da tela para evitar acúmulo de elementos
    setTimeout(() => {
      emoji.remove();
    }, 2500);

    emojiCount++;
  }, 100);
}

// Função para atualizar informações exibidas na interface
function updateInfo() {
  document.getElementById('money').textContent = money.toFixed(2);
  document.getElementById('milkshakes').textContent = milkshakes;
  document.getElementById('rebirths').textContent = rebirths;
}

// Função para atualizar os preços na interface
function updatePrices() {
  document.getElementById('current-milkshake-price').textContent = milkshakePrice.toFixed(2);
  document.getElementById('current-upgrade-price').textContent = upgradePrice.toFixed(2);
  document.getElementById('current-rebirth-price').textContent = rebirthPrice.toFixed(2);
}

// Função para ativar Auto Clicker
function buyAutoClicker() {
  if (money >= autoClickerPrice) {
    money -= autoClickerPrice;
    autoClickers++;
    autoClickerPrice = Math.ceil(autoClickerPrice * 1.5); // Aumenta o preço progressivamente
    autoClickerInterval = Math.max(500, autoClickerInterval - 200); // Reduz o intervalo até o limite de 500ms

    setInterval(() => clickBanana(), autoClickerInterval); // Auto Clicker com o intervalo ajustado

    updateInfo();
    updatePrices(); // Atualiza o preço na interface

    // Notificação informando o número e o impacto
    showNotification(
      `Auto Clicker purchased! Active Clickers: ${autoClickers}, Interval: ${autoClickerInterval / 1000}s`,
      'success'
    );

    // Animação para dar feedback visual
    animateAutoClicker();
  } else {
    showNotification('You don\'t have enough coins to buy Auto Clicker!', 'error');
  }
}

// Animação para indicar a compra do Auto Clicker
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

// Função para comprar Golden Banana
function buyGoldenBanana() {
  if (money >= 800) {
    money -= 800;
    const originalIncome = milkshakeIncome;
    milkshakeIncome *= 2; // Dobra a produção de cliques
    updateInfo();
    showNotification('Golden Banana activated!', 'success');
    setTimeout(() => {
      milkshakeIncome = originalIncome; // Volta a produção ao normal
      updateInfo();
    }, 30000); // Dura 30 segundos
  } else {
    showNotification('You dont have enough coins to buy Golden Banana!', 'error');
  }
}

// Função para comprar Milkshake Factory
function buyMilkshakeFactory() {
  if (money >= milkshakeFactoryPrice) {
    money -= milkshakeFactoryPrice;
    milkshakeFactoryCount++;

    // Aumenta a produção de milkshakes com base no número de fábricas
    milkshakeIncome *= milkshakeFactoryMultiplier;

    // Aumenta o preço da Milkshake Factory
    milkshakeFactoryPrice = Math.ceil(milkshakeFactoryPrice * 1.5);

    updateInfo();
    updatePrices(); // Atualiza o preço na interface

    showNotification(
      `Milkshake Factory purchased! Your milkshake income increased by ${(milkshakeFactoryMultiplier - 1) * 100}%! Total factories: ${milkshakeFactoryCount}`,
      'success'
    );

    animateMilkshakeFactoryButton();
  } else {
    showNotification('Not enough coins to buy a Milkshake Factory!', 'error');
  }
}

// Animação para o botão da Milkshake Factory
function animateMilkshakeFactoryButton() {
  const button = document.querySelector('.shop-item button');
  button.style.transform = 'scale(1.2)';
  button.style.backgroundColor = '#32CD32'; // Cor de sucesso (verde claro)

  setTimeout(() => {
    button.style.transform = 'scale(1)';
    button.style.backgroundColor = ''; // Restaura a cor original
  }, 300);
}

// Evento Especial: Banana Vermelha
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

  // Exibe uma notificação de aviso
  showNotification('RV has removed all your positions! Click quickly to recover them!', 'warning');

  const countdown = document.createElement('div');
  countdown.id = 'red-banana-countdown';
  document.body.appendChild(countdown);

  let timeLeft = 10;
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
    showNotification('You failed to recover positions!', 'error');
  }

  updateInfo();
}



// Função para verificar o impacto do Banana Shield no evento de falha
function handleFailedEvent() {
  if (bananaShieldActive) {
    showNotification('The Banana Shield protected you from losing coins!', 'success');
  } else {
    money = Math.max(0, money - 50); // Perde 20 moedas em evento falho sem o Banana Shield
    showNotification('You lost your positions and 50 coins!', 'error');
  }
  updateInfo();
}

// Função para comprar Time Extender
function buyTimeExtender() {
  if (money >= 1500) {
    money -= 1500;
    timeExtenderActive = true;
    showNotification('Time Extender activated! Special events will last 5 seconds longer', 'success');
    setTimeout(() => {
      timeExtenderActive = false; // Desativa o Time Extender após 30 segundos
    }, 30000); // Dura 30 segundos
    updateInfo();
  } else {
    showNotification('You dont have enough coins to buy Time Extender!', 'error');
  }
}

// Função para comprar Banana Shield
function buyBananaShield() {
  if (money >= 2000) {
    money -= 2000;
    bananaShieldActive = true;
    showNotification('Banana Shield activated! You are protected from losing coins in failed events', 'success');
    setTimeout(() => {
      bananaShieldActive = false; // Desativa o Banana Shield após 30 segundos
    }, 30000); // Dura 30 segundos
    updateInfo();
  } else {
    showNotification('You dont have enough coins to buy Banana Shield!', 'error');
  }
}

// Função para mostrar notificações de Conquista, Sucesso e Erro
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.classList.add('notification', type);

  // Configuração do emoji
  const emoji = document.createElement('span');
  emoji.classList.add('emoji');
  if (type === 'success') emoji.textContent = '✔️';
  else if (type === 'error') emoji.textContent = '❌️';
  else if (type === 'conquest') emoji.textContent = '🏆';
  else if (type === 'warning') emoji.textContent = '❗️';

  const text = document.createElement('span');
  text.textContent = message;

  // Adicionar ao DOM
  notification.appendChild(emoji);
  notification.appendChild(text);
  document.body.appendChild(notification);

  // Animação de entrada
  setTimeout(() => {
    notification.style.right = '20px';
  }, 10);

  // FadeOut após 3 segundos
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.5s ease-out forwards';
  }, 3000);

  // Remove após a conclusão da animação
  setTimeout(() => {
    notification.remove();
  }, 4000);
}

// Missões diárias
let dailyMissions = [
  { description: "Click on the banana 100 times", progress: 0, goal: 100, reward: 50 },
  { description: "Buy 5 upgrades", progress: 0, goal: 5, reward: 100 },
  { description: "Complete a Rebirth", progress: 0, goal: 1, reward: 200 }
];

// Função para rastrear o progresso das missões
function trackMission(missionType) {
  const mission = dailyMissions.find(m => m.description === missionType);
  if (mission) {
    mission.progress++;
    if (mission.progress >= mission.goal) {
      showNotification(`Mission Complete: ${mission.description}`, 'conquest');
      money += mission.reward;
      mission.progress = 0; // Reseta o progresso após a missão ser completada
    }
    updateInfo();
  }
}

// Exemplo de uso dentro do clique da banana
function clickBanana() {
  money += turboActive ? milkshakeIncome * 2 : milkshakeIncome;
  money = parseFloat(money.toFixed(2));
  updateInfo();

  // Rastreia a missão "Clique 100 vezes na banana"
  trackMission("Click on the banana 100 times");
  handleRedBananaEvent();
}

// Função para mostrar notificações de Conquista, Sucesso e Erro
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.classList.add('notification', type);

  // Configuração do emoji
  const emoji = document.createElement('span');
  emoji.classList.add('emoji');
  if (type === 'success') emoji.textContent = '✔️';
  else if (type === 'error') emoji.textContent = '❌️';
  else if (type === 'conquest') emoji.textContent = '🏆';
  else if (type === 'warning') emoji.textContent = '❗️';

  const text = document.createElement('span');
  text.textContent = message;

  // Adicionar ao DOM
  notification.appendChild(emoji);
  notification.appendChild(text);
  document.body.appendChild(notification);

  // Animação de entrada
  setTimeout(() => {
    notification.style.right = '20px';
  }, 10);

  // FadeOut após 3 segundos
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.5s ease-out forwards';
  }, 3000);

  // Remove após a conclusão da animação
  setTimeout(() => {
    notification.remove();
  }, 4000);
}

// Função para atualizar as informações na tela
function updateInfo() {
  document.getElementById('money').textContent = money.toFixed(2);
  document.getElementById('milkshakes').textContent = milkshakes;
  document.getElementById('rebirths').textContent = rebirths;
}

// Referências dos elementos
const shopButton = document.getElementById('shopButton'); // Botão para abrir a loja
const shopModal = document.getElementById('shopModal'); // Modal da loja
const closeShop = document.getElementById('closeShop'); // Botão para fechar a loja

// Função para abrir a loja
function openShop() {
  shopModal.style.display = 'block'; // Exibe o modal
  document.body.style.overflow = 'hidden'; // Desabilita o scroll quando o modal está aberto
}

// Função para fechar a loja
function closeShopModal() {
  shopModal.style.display = 'none'; // Esconde o modal
  document.body.style.overflow = 'auto'; // Habilita o scroll novamente
}

// Evento para abrir a loja ao clicar no botão
shopButton.addEventListener('click', openShop);

// Evento para fechar a loja ao clicar no botão de fechar
closeShop.addEventListener('click', closeShopModal);

// Ajuste: Fechar modal ao clicar fora do conteúdo do modal
shopModal.addEventListener('click', (event) => {
  if (event.target === shopModal) {
    closeShopModal(); // Fecha a loja somente se o clique for fora do conteúdo do modal
  }
});

// Função que começa a chuva de bananas
function startBananaRain() {
  if (bananaRainActive) return;

  bananaRainActive = true;
  
  const interval = setInterval(() => {
    if (rainCount >= maxBananas) {
      clearInterval(interval); // Para a chuva se atingir o máximo de bananas
      bananaRainActive = false;
    }

    // Cria um novo emoji de banana
    const bananaEmoji = document.createElement('div');
    bananaEmoji.classList.add('banana-emoji');
    bananaEmoji.textContent = '🍌';

    // Define a posição inicial aleatória do emoji na parte superior
    const randomX = Math.random() * window.innerWidth;
    bananaEmoji.style.left = `${randomX}px`;

    // Adiciona o emoji à tela
    bananaContainer.appendChild(bananaEmoji);

    // Incrementa o contador de bananas
    rainCount++;

    // Remove o emoji da tela após ele terminar a animação
    setTimeout(() => {
      bananaEmoji.remove();
      rainCount--; // Decrementa o contador
    }, 3000); // 3 segundos depois que o emoji termina sua animação
  }, 100); // Dispara a cada 100ms para criar a animação
}

// Função de clique na banana
function clickBanana() {
  money += milkshakeIncome;
  money = parseFloat(money.toFixed(2));
  updateInfo();
  trackMission("Click on the banana 100 times");
  handleRedBananaEvent();

  // Inicia a chuva de bananas quando o jogador clicar
  startBananaRain();
}





// Função para atualizar a barra de progresso
function updateProgressBar() {
  const progressBar = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');

  // Calculando o percentual do progresso
  const progressPercentage = (clickCountForProgress / totalClicksForCompletion) * 100;

  // Atualiza a largura da barra de progresso
  progressBar.style.width = `${progressPercentage}%`;

  // Atualiza o texto dentro da barra
  progressText.textContent = `${Math.floor(progressPercentage)}%`;

  // Quando o progresso chega a 100%, exibe a mensagem de sucesso
  if (clickCountForProgress >= totalClicksForCompletion) {
    showNotification("Santa Claus (Batata) gave you 225 coins!", 'success');
    clickCountForProgress = 0;  // Reseta o contador de cliques após a recompensa
    progressBarActive = false;  // Desativa a barra de progresso até o próximo ciclo
  }
}

// Função para adicionar progressos ao clicar na banana
function clickBananaForProgress() {
  if (progressBarActive) {
    clickCountForProgress++; // Aumenta o contador de cliques

    if (clickCountForProgress > totalClicksForCompletion) {
      clickCountForProgress = totalClicksForCompletion; // Limita o máximo de cliques
    }

    updateProgressBar(); // Atualiza a barra de progresso a cada clique
  }
}

// Função para iniciar a barra de progresso
function startProgressBar() {
  if (!progressBarActive) {
    progressBarActive = true;  // Ativa a barra de progresso quando o jogador começa a clicar
    clickCountForProgress = 0; // Reseta o contador de cliques
    updateProgressBar();  // Atualiza a barra para 0% no começo
  }
}

// Inicializar a barra de progresso
function initializeProgressBar() {
  const progressBarContainer = document.getElementById('progress-bar');

  // Adicionando o texto dentro da barra
  const progressText = document.createElement('span');
  progressText.id = 'progress-text';
  progressBarContainer.appendChild(progressText);

  // Atualizando a barra para 0% no começo
  updateProgressBar();
}

// Chama a função de inicialização
initializeProgressBar();

// Exemplo de como iniciar o progresso com o clique
document.getElementById('banana').addEventListener('click', () => {
  startProgressBar(); // Inicia o progresso ao clicar na banana
  clickBananaForProgress(); // Adiciona o progresso ao clicar
});



// Função para lidar com o clique no botão do evento
function handleRedCEO4Duel() {
  if (redCEO4Cooldown) return; // Se em cooldown, impede a ativação

  // Ativa o overlay do evento
  triggerRedCEO4Event();

  // Inicia o cooldown
  startRedCEO4Cooldown();
}

// Função para iniciar o cooldown
function startRedCEO4Cooldown() {
  const button = document.getElementById("red-ceo4-button");
  redCEO4Cooldown = true;
  button.classList.add("disabled"); // Desativa o botão visualmente

  let remainingTime = redCEO4CooldownTime / 1000; // Tempo em segundos

  // Atualiza o texto do botão com a contagem regressiva
  redCEO4CooldownTimer = setInterval(() => {
    remainingTime--;
    button.textContent = `Cooldown: ${remainingTime}s`;

    if (remainingTime <= 0) {
      clearInterval(redCEO4CooldownTimer); // Para o timer ao final do cooldown
      redCEO4Cooldown = false; // Permite a reativação do botão
      button.classList.remove("disabled");
      button.textContent = "Red_CEO4 Duel"; // Restaura o texto original
    }
  }, 1000);
}

// Função para exibir o modal do evento
function triggerRedCEO4Event() {
  const overlay = document.createElement("div");
  overlay.id = "red-ceo4-overlay";

  overlay.innerHTML = `
    <h1>Red_CEO4 Duel Challenge!</h1>
    <p>
       "Red_CEO4 comes with an unexpected challenge. He invites you to a duel for the top of the rankings. The offer is tempting: double your coins in case of victory. But be careful, a defeat could cost you half your fortune. Will you have the courage to accept this confrontation or will you choose safety? The decision is yours." 
    </p>
    <div>
      <button class="accept" onclick="handleRedCEO4Choice(true)">Accept</button>
      <button class="decline" onclick="handleRedCEO4Choice(false)">Decline</button>
    </div>
  `;

  document.body.appendChild(overlay);
}

// Função para processar a escolha do jogador
function handleRedCEO4Choice(isAccepted) {
  const overlay = document.getElementById("red-ceo4-overlay");
  overlay.remove(); // Remove o overlay após a escolha

  if (isAccepted) {
    // Calcula vitória ou derrota
    const result = Math.random() < redCEO4WinChance ? "win" : "lose";

    if (result === "win") {
      money *= redCEO4RewardMultiplier; // Dobra as moedas
      showNotification("You won the duel! Your coins have doubled!", "success");
    } else {
      money *= redCEO4Penalty; // Perde metade das moedas
      money = parseFloat(money.toFixed(2)); // Corrige para 2 casas decimais
      showNotification("You lost the duel! Half of your coins are gone.", "error");
    }
  } else {
    // Declinação
    showNotification("You declined the duel. Red_CEO4 called you a coward.", "warning");
  }

  updateInfo(); // Atualiza as informações na tela
}



// Golden Click 🍌✨
function buyGoldenClick() {
  if (money >= 1000) {
    money -= 1000;
    showNotification('Golden Click activated! Clicks give random coins for 60 seconds.', 'success');
    
    let goldenClickTimer = setTimeout(() => {
      showNotification('Golden Click effect ended.', 'error');
    }, 15000); // Efeito por 60 segundos
    
    // Manipula o clique
    function goldenClickEffect() {
      const randomCoins = Math.floor(Math.random() * 6) + 5;
      money += randomCoins;
      showNotification(`You collected ${randomCoins} coins!`, 'success');
      updateInfo();
    }

    document.getElementById('banana').addEventListener('click', goldenClickEffect);
    
    setTimeout(() => {
      document.getElementById('banana').removeEventListener('click', goldenClickEffect);
      clearTimeout(goldenClickTimer);
    }, 60000);
  } else {
    showNotification('Not enough coins for Golden Click!', 'error');
  }
}

// Rain of Coins 🌧️
function buyRainOfCoins() {
  if (money >= 1500 && !rainOfCoinsActive) {
    money -= 1500;
    rainOfCoinsActive = true;
    showNotification('Rain of Coins activated! Collect as many coins as you can for 15 seconds.', 'success');
    
    let interval = setInterval(() => {
      const randomX = Math.random() * window.innerWidth;
      const coin = document.createElement('div');
      coin.textContent = '🪙';
      coin.style.position = 'absolute';
      coin.style.left = `${randomX}px`;
      coin.style.top = '0px';
      coin.style.fontSize = '20px';
      coin.style.transition = 'top 1s ease-in-out';

      document.body.appendChild(coin);

      setTimeout(() => {
        coin.style.top = `${window.innerHeight}px`;
      }, 10);

      setTimeout(() => {
        coin.remove();
      }, 1000);
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



// Função para abrir a Máquina Caça-níqueis
function openSlotMachine() {
  if (slotActive) return;
  slotActive = true;

  const overlay = document.createElement('div');
  overlay.id = 'slot-machine-overlay';

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

// Função para fechar a Máquina Caça-níqueis
function closeSlotMachine() {
  const overlay = document.getElementById('slot-machine-overlay');
  if (overlay) {
    overlay.remove();
    slotActive = false;
  }
}

// Função para girar a Máquina Caça-níqueis
function spinSlotMachine() {
  if (slotCooldown) {
    showNotification('Please wait before spinning again!', 'warning');
    return;
  }

  if (money < slotPrice) {
    showNotification('Not enough coins to spin!', 'error');
    return;
  }

  // Inicia cooldown com contador
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

  const emojis = ['🍟', '🧋', '🥛', '🍌']; // Emojis disponíveis
  const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3'),
  ];

  // Inicia a animação dos rolos
  reels.forEach((reel, index) => {
    let spins = 15 + index * 5; // Número de giros por rolo
    const interval = setInterval(() => {
      reel.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      spins--;

      if (spins <= 0) clearInterval(interval); // Para a rotação individual
    }, 100);
  });

  // Aguarda o término da animação antes de calcular o resultado
  setTimeout(() => {
    const result = reels.map(reel => reel.textContent); // Captura o resultado final dos rolos

    // Verifica combinações
    if (result.every(e => e === '🍟')) {
      const jackpotWin = 10000; // Valor fixo para Jackpot
      money += jackpotWin;
      showNotification(`🎉 JACKPOT! You won ${jackpotWin} coins!`, 'conquest');
    } else if (new Set(result).size === 1) {
      const tripleWin = 1000; // Valor fixo para 3 iguais (exceto Batata)
      money += tripleWin;
      showNotification(`Amazing! You won ${tripleWin} coins!`, 'success');
    } else if (result[0] === result[1] || result[0] === result[2] || result[1] === result[2]) {
      const partialWin = 200; // Valor fixo para dois iguais
      money += partialWin;
      showNotification(`Great! You won ${partialWin} coins!`, 'success');
    } else {
      showNotification('Better luck next time!', 'error');
    }

    updateInfo(); // Atualiza os dados na tela
  }, 2500); // Espera um pouco mais que o tempo total da animação
}


// Função para iniciar o evento "Caça aos Presentes"
function startPresentHunt() {
  if (presentCooldown) {
    showNotification('⏳ Please wait before starting the event again!', 'warning');
    return;
  }

  if (money < 350) {
    showNotification('❌ Not enough coins to start the Present Hunt!', 'error');
    return;
  }

  // Deduz o custo para iniciar o evento
  money -= 350;
  updateInfo();
  presentCooldown = true;
  toggleButtonCooldown();

  showNotification('🎄 Moon dropped Santa\'s presents, help her pick them up  🎁', 'warning');

  let presentInterval = setInterval(() => {
  const present = document.createElement('div');
  
  const presentTypes = [
    { type: 'small', emoji: '🎁', reward: 25, chance: 60 }, // 60%
    { type: 'medium', emoji: '🎁', reward: 75, chance: 30 }, // 30%
    { type: 'large', emoji: '🎁', reward: 450, chance: 7 }, // 7%
    { type: 'rare', emoji: '🎁', reward: 750, chance: 3 } // 3%
  ];

  // Função para selecionar um presente com base nas probabilidades
  const randomChoice = () => {
    const rand = Math.random() * 100; // Gera um número entre 0 e 100
    let cumulativeChance = 0;

    for (let i = 0; i < presentTypes.length; i++) {
      cumulativeChance += presentTypes[i].chance;
      if (rand <= cumulativeChance) {
        return presentTypes[i];
      }
    }
    return presentTypes[presentTypes.length - 1]; // Caso algo dê errado, devolve o último
  };

  const randomPresent = randomChoice();

  // Configurar o elemento presente na tela
  present.classList.add('present', randomPresent.type);
  present.textContent = randomPresent.emoji;
  present.style.position = 'absolute';
  present.style.left = `${Math.random() * 90}vw`;
  present.style.top = `${Math.random() * 80}vh`;
  present.dataset.reward = randomPresent.reward;

  document.body.appendChild(present);

  // Remove o presente após 5 segundos
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
    showNotification('🎄 You helped Moon get the presents, now you\'re on the good boy list  🎁', 'success');
    presentCooldown = false;
    toggleButtonCooldown();
  }, 20000); // O evento dura apenas 20 segundos
}

// Função para desabilitar e reabilitar o botão durante o cooldown
function toggleButtonCooldown() {
  const button = document.getElementById('present-hunt-button');
  if (presentCooldown) {
    button.classList.add('disabled');
    button.disabled = true;
  } else {
    button.classList.remove('disabled');
    button.disabled = false;
  }

  // Retorna após 40 segundos
  setTimeout(() => {
    presentCooldown = false;
    toggleButtonCooldown();
  }, cooldownTime);
}
