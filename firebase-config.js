// Importando as funções necessárias do SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, get, child } from "firebase/database";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDaR0sc_Iy8K7MtuH-Wci96d-FeDn317Pw",
  authDomain: "leader-board-d5ffa.firebaseapp.com",
  databaseURL: "https://leader-board-d5ffa-default-rtdb.firebaseio.com",
  projectId: "leader-board-d5ffa",
  storageBucket: "leader-board-d5ffa.firebasestorage.app",
  messagingSenderId: "932824630059",
  appId: "1:932824630059:web:b855d5e34a8684d7c97b6e",
  measurementId: "G-92TW6BS4H8"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);  // Banco de dados

// Função para adicionar ou atualizar dados da leaderboard
export function addData(playerName, milkshakes, money) {
  const leaderboardRef = ref(db, 'leaderboard/' + playerName);

  // Salva ou atualiza os dados do jogador no Firebase
  set(leaderboardRef, {
    milkshakes: milkshakes,
    money: money
  }).then(() => {
    console.log("Dados salvos com sucesso!");
  }).catch((error) => {
    console.error("Erro ao salvar dados:", error);
  });
}

// Função para obter dados da leaderboard
export function getLeaderboard() {
  const leaderboardRef = ref(db, 'leaderboard/');
  return get(leaderboardRef)
    .then(snapshot => {
      if (snapshot.exists()) {
        return snapshot.val();  // Retorna os dados da leaderboard
      } else {
        console.log("Nenhum dado encontrado na leaderboard");
        return {};  // Retorna um objeto vazio se não houver dados
      }
    })
    .catch((error) => {
      console.error("Erro ao obter dados da leaderboard:", error);
      return {};  // Retorna um objeto vazio em caso de erro
    });
}

// Função para exibir a leaderboard
export function displayLeaderboard() {
  getLeaderboard().then((leaderboard) => {
    const leaderboardContainer = document.getElementById('leaderboard-container');
    leaderboardContainer.innerHTML = ""; // Limpa a lista antes de adicionar os novos dados

    if (leaderboard) {
      // Ordena os jogadores por Milkshakes e, em caso de empate, por Money
      const sortedLeaderboard = Object.entries(leaderboard)
        .sort(([, playerA], [, playerB]) => {
          if (playerB.milkshakes === playerA.milkshakes) {
            return playerB.money - playerA.money; // Ordena por money se milkshakes forem iguais
          }
          return playerB.milkshakes - playerA.milkshakes; // Ordena por milkshakes
        });

      // Adiciona cada jogador à lista da leaderboard
      sortedLeaderboard.forEach(([playerName, playerData], index) => {
        const playerEntry = document.createElement('div');
        playerEntry.classList.add('leaderboard-entry');

        // Medalhas para os 3 primeiros
        let medal = '';
        if (index === 0) medal = '🥇';
        else if (index === 1) medal = '🥈';
        else if (index === 2) medal = '🥉';

        playerEntry.innerHTML = `
          <span class="rank">${medal} ${index + 1}.</span>
          <span class="player-name">${playerName}</span>
          <span class="stats">Milkshakes: ${playerData.milkshakes} | Money: $${playerData.money.toFixed(2)}</span>
        `;
        leaderboardContainer.appendChild(playerEntry);
      });
    } else {
      console.log("Nenhum dado de leaderboard encontrado.");
    }
  });
}