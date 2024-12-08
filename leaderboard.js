// Variáveis da leaderboard
let leaderboard = [];
let playerName = '';

// Função para salvar dados no Firebase
function addData(name, milkshakes, money) {
  const leaderboardRef = ref(db, 'leaderboard/' + name);
  set(leaderboardRef, { milkshakes, money })
    .then(() => console.log('Dados salvos no Firebase com sucesso!'))
    .catch((error) => console.error('Erro ao salvar no Firebase:', error));
}

// Função para buscar dados da leaderboard do Firebase
async function getLeaderboard() {
  const leaderboardRef = ref(db, 'leaderboard/');
  try {
    const snapshot = await get(leaderboardRef);
    if (snapshot.exists()) {
      leaderboard = Object.entries(snapshot.val()).map(([name, data]) => ({
        name,
        milkshakes: data.milkshakes,
        money: data.money,
      }));
      leaderboard.sort((a, b) => b.milkshakes - a.milkshakes || b.money - a.money);
      displayLeaderboardContent();
    }
  } catch (error) {
    console.error("Erro ao buscar dados no Firebase", error);
  }
}

// Garantindo que o botão seja criado e exibido corretamente
function initLeaderboard() {
  if (!document.getElementById('leaderboardButton')) {
    try {
      const leaderboardButton = document.createElement('button');
      leaderboardButton.id = 'leaderboardButton';
      leaderboardButton.textContent = 'Leaderboard';
      leaderboardButton.classList.add('leaderboard-btn');
      document.body.appendChild(leaderboardButton);

      leaderboardButton.addEventListener('click', handleLeaderboardClick);

      console.log('Botão da Leaderboard adicionado ao DOM!');
    } catch (error) {
      console.error('Erro ao criar botão da Leaderboard:', error);
    }
  }

  getLeaderboard();
}

// Tratamento de clique na leaderboard
function handleLeaderboardClick() {
  if (!playerName) {
    playerName = prompt('Por favor, insira seu nome para entrar na leaderboard:');
    if (!playerName) {
      alert('Você deve fornecer seu nome para participar da leaderboard.');
      return;
    }
  }
  showLeaderboard();
}

// Exibir modal da leaderboard
function showLeaderboard() {
  const modal = document.createElement('div');
  modal.id = 'leaderboardModal';
  modal.className = 'modal';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.innerHTML = `
    <span class="close" onclick="closeLeaderboardModal()">×</span>
    <h2>Leaderboard</h2>
    <div id="leaderboardContent"></div>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  displayLeaderboardContent();
}

// Fechar modal da leaderboard
function closeLeaderboardModal() {
  const modal = document.getElementById('leaderboardModal');
  if (modal) modal.remove();
}

// Exibir conteúdo da leaderboard no modal
function displayLeaderboardContent() {
  const leaderboardContent = document.getElementById('leaderboardContent');
  leaderboardContent.innerHTML = '';

  leaderboard.forEach((player, index) => {
    const entry = document.createElement('div');
    entry.className = 'leaderboard-entry';

    let medal = '';
    if (index === 0) medal = '🥇';
    else if (index === 1) medal = '🥈';
    else if (index === 2) medal = '🥉';

    entry.innerHTML = `
      <span class="rank">${medal} ${index + 1}.</span>
      <span class="player-name">${player.name}</span>
      <span class="stats">Milkshakes: ${player.milkshakes} | Money: $${player.money.toFixed(2)}</span>
    `;
    leaderboardContent.appendChild(entry);
  });
}

// Chamada inicial
initLeaderboard();