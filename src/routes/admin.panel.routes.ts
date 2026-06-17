import { Express } from 'express';

export function registerAdminPanelRoutes(app: Express) {
  app.get('/admin', (_req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AVUXO Admin</title>

<style>
* { box-sizing: border-box; }

:root {
  --green: #24F877;
  --bg: #050609;
  --box: rgba(255,255,255,0.04);
  --line: rgba(255,255,255,0.08);
  --muted: #8c96a8;
  --danger: #ff5f5f;
  --warn: #ffcc66;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(36,248,119,0.16), transparent 34%),
    radial-gradient(circle at 90% 10%, rgba(36,248,119,0.08), transparent 30%),
    linear-gradient(135deg, #050609 0%, #07110c 100%);
  color: white;
  font-family: Arial, sans-serif;
}

.shell {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
}

aside {
  padding: 30px;
  background: rgba(255,255,255,0.035);
  border-right: 1px solid var(--line);
  backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  height: 100vh;
}

.logo {
  color: var(--green);
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 4px;
}

.sub {
  margin-top: 8px;
  color: var(--muted);
  font-size: 12px;
  letter-spacing: 3px;
}

.status-pill {
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(36,248,119,0.10);
  color: var(--green);
  font-size: 12px;
  font-weight: 900;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 99px;
  background: var(--green);
  box-shadow: 0 0 18px var(--green);
}

nav {
  margin-top: 34px;
  display: grid;
  gap: 10px;
}

button {
  border: 0;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255,255,255,0.045);
  color: white;
  text-align: left;
  font-weight: 800;
  cursor: pointer;
  transition: 0.18s ease;
}

button:hover,
button.active {
  color: var(--green);
  background: rgba(36,248,119,0.13);
  transform: translateY(-1px);
}

main {
  padding: 40px;
  overflow: hidden;
}

.top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  font-size: 40px;
}

p {
  color: var(--muted);
}

.section { display: none; }
.section.active { display: block; }

.cards {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.card,
.premium-box,
.panel,
.mini-log {
  background: var(--box);
  border: 1px solid var(--line);
  box-shadow: 0 20px 60px rgba(0,0,0,0.24);
}

.card {
  padding: 24px;
  border-radius: 24px;
  min-height: 130px;
}

.card small {
  color: var(--muted);
  font-weight: 800;
}

.card strong {
  display: block;
  margin-top: 12px;
  font-size: 32px;
}

.card .hint {
  margin-top: 8px;
  color: var(--muted);
  font-size: 12px;
}

.premium-box {
  margin-top: 30px;
  padding: 28px;
  border-radius: 28px;
}

.panel {
  margin-top: 30px;
  border-radius: 28px;
  overflow: auto;
}

.panel-head {
  padding: 20px 24px;
  border-bottom: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.panel-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

input,
select {
  width: 100%;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 12px 14px;
  color: white;
  background: rgba(255,255,255,0.05);
  outline: none;
}

input:focus,
select:focus {
  border-color: rgba(36,248,119,0.45);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;
}

th,
td {
  padding: 17px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  text-align: left;
  vertical-align: top;
}

th {
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
}

.badge {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(36,248,119,0.12);
  color: var(--green);
  font-size: 12px;
  font-weight: 900;
}

.badge.pending { color: var(--warn); background: rgba(255,204,102,0.12); }
.badge.blocked, .badge.cancelled, .badge.rejected { color: var(--danger); background: rgba(255,77,77,0.12); }
.badge.finished, .badge.approved { color: var(--green); background: rgba(36,248,119,0.12); }

.modal,
.zoom-modal {
  position: fixed;
  inset: 0;
  display: none;
  justify-content: center;
  align-items: center;
  padding: 30px;
}

.modal {
  background: rgba(0,0,0,0.82);
  z-index: 9999;
}

.zoom-modal {
  background: rgba(0,0,0,0.94);
  z-index: 999999;
}

.modal-content {
  width: 100%;
  max-width: 1200px;
  max-height: 92vh;
  overflow-y: auto;
  border-radius: 30px;
  background: #0b0f14;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 30px;
}

.modal-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.modal-grid,
.docs-grid,
.city-grid {
  margin-top: 24px;
  display: grid;
  gap: 20px;
}

.modal-grid { grid-template-columns: repeat(2, 1fr); }
.docs-grid { grid-template-columns: repeat(3, 1fr); }
.city-grid { grid-template-columns: repeat(3, 1fr); }

.modal-card,
.doc-card,
.city-card {
  border-radius: 22px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
}

.modal-card,
.city-card { padding: 22px; }

.modal-card h3,
.city-card h3 {
  margin-top: 0;
  color: var(--green);
}

.doc-card { overflow: hidden; }

.doc-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
  cursor: pointer;
}

.doc-info { padding: 16px; }
.doc-title { font-weight: 900; margin-bottom: 8px; }

.empty-doc {
  height: 220px;
  display: grid;
  place-items: center;
  color: var(--muted);
  background: rgba(255,255,255,0.03);
}

.pdf-btn { background: rgba(36,248,119,0.14); color: var(--green); }
.danger-btn { background: rgba(255,77,77,0.12); color: var(--danger); }
.warn-btn { background: rgba(255,204,102,0.12); color: var(--warn); }
.neutral-btn { background: rgba(255,255,255,0.06); color: white; }

.zoom-modal img {
  max-width: 95%;
  max-height: 95%;
  border-radius: 24px;
}

.map-placeholder {
  margin-top: 30px;
  min-height: 440px;
  border-radius: 30px;
  border: 1px solid var(--line);
  background:
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    radial-gradient(circle at 40% 45%, rgba(36,248,119,0.18), transparent 20%),
    rgba(255,255,255,0.03);
  background-size: 50px 50px, 50px 50px, auto, auto;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 30px;
}

.mini-log {
  margin-top: 16px;
  padding: 16px;
  border-radius: 18px;
  color: #dfe5ec;
}

.log-time {
  color: var(--muted);
  font-size: 12px;
  margin-bottom: 6px;
}

@media (max-width: 1100px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
  .city-grid, .docs-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 900px) {
  .shell { grid-template-columns: 1fr; }
  aside { position: relative; height: auto; }
  main { padding: 22px; }
  .modal-grid, .docs-grid, .city-grid { grid-template-columns: 1fr; }
}
</style>

<script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
</head>

<body>
<div class="shell">
  <aside>
    <div class="logo">AVUXO</div>
    <div class="sub">COMMAND CENTER</div>
    <div class="status-pill"><span class="status-dot"></span><span id="socketStatus">ONLINE</span></div>

    <nav>
      <button onclick="logoutAdmin()">Logout</button>
      <button class="active" onclick="openSection('dashboard', this)">Dashboard</button>
      <button onclick="openSection('drivers', this)">Motoristas</button>
      <button onclick="openSection('passengers', this)">Passageiros</button>
      <button onclick="openSection('rides', this)">Corridas</button>
      <button onclick="openSection('finance', this)">Financeiro</button>
      <button onclick="openSection('cities', this)">Cidades</button>
      <button onclick="openSection('map', this)">Mapa ao vivo</button>
      <button onclick="openSection('logs', this)">Logs</button>
      <button onclick="openSection('system', this)">Sistema</button>
    </nav>
  </aside>

  <main>
    <section id="dashboard" class="section active">
      <div class="top-row">
        <div>
          <h1>Dashboard</h1>
          <p>Painel operacional AVUXO em tempo real.</p>
        </div>
        <button onclick="refreshOperationalData()">Atualizar tudo</button>
      </div>

      <div class="cards">
        <div class="card"><small>Motoristas</small><strong id="driversCount">0</strong><div class="hint">Total cadastrado</div></div>
        <div class="card"><small>Online</small><strong id="onlineDriversCount">0</strong><div class="hint">Disponíveis agora</div></div>
        <div class="card"><small>Pendentes</small><strong id="pendingCount">0</strong><div class="hint">Aguardando revisão</div></div>
        <div class="card"><small>Aprovados</small><strong id="approvedCount">0</strong><div class="hint">Liberados</div></div>
        <div class="card"><small>Bloqueados</small><strong id="blockedCount">0</strong><div class="hint">Sem acesso</div></div>
        <div class="card"><small>Corridas ativas</small><strong id="activeRidesCount">0</strong><div class="hint">Em andamento/agendadas</div></div>
        <div class="card"><small>Corridas hoje</small><strong id="todayRidesCount">0</strong><div class="hint">Histórico do dia</div></div>
        <div class="card"><small>Receita hoje</small><strong id="todayRevenue">R$ 0</strong><div class="hint">Corridas finalizadas</div></div>
        <div class="card"><small>Receita mês</small><strong id="monthRevenue">R$ 0</strong><div class="hint">Total mensal</div></div>
        <div class="card"><small>Taxas AVUXO</small><strong id="avuxoFeesTotal">R$ 0</strong><div class="hint">Taxas registradas</div></div>
        <div class="card"><small>Finalizadas</small><strong id="finishedRidesCount">0</strong><div class="hint">Histórico geral</div></div>
        <div class="card"><small>Canceladas</small><strong id="cancelledRidesCount">0</strong><div class="hint">Histórico geral</div></div>
      </div>

      <div class="premium-box">
        <h2>Resumo operacional</h2>
        <p id="operationalSummary">Backend online, painel ativo e dados carregando.</p>
      </div>
    </section>

    <section id="drivers" class="section">
      <h1>Motoristas</h1>
      <p>Gerencie aprovações, bloqueios, carteira e documentos.</p>

      <section class="panel">
        <div class="panel-head">
          <strong>Motoristas cadastrados</strong>
          <div class="panel-actions">
            <button onclick="loadDrivers()">Atualizar</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Online</th>
              <th>Saldo</th>
              <th>Taxas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="driversTable"><tr><td colspan="7">Carregando...</td></tr></tbody>
        </table>
      </section>
    </section>

    <section id="passengers" class="section">
      <h1>Passageiros</h1>
      <p>Visão operacional dos passageiros com base nas corridas registradas.</p>

      <div class="panel">
        <div class="panel-head">
          <strong>Passageiros encontrados</strong>
          <button onclick="loadPassengers()">Atualizar</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Corridas</th>
              <th>Total gasto</th>
            </tr>
          </thead>
          <tbody id="passengersTable"><tr><td colspan="5">Carregando...</td></tr></tbody>
        </table>
      </div>
    </section>

    <section id="rides" class="section">
      <h1>Corridas</h1>
      <p>Corridas realtime AVUXO.</p>

      <div class="panel">
        <div class="panel-head">
          <strong>Corridas ativas</strong>
          <button onclick="loadCurrentRide()">Atualizar</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Passageiro</th>
              <th>Tipo</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Distância</th>
              <th>Tempo</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="ridesTable"><tr><td colspan="8">Carregando...</td></tr></tbody>
        </table>
      </div>

      <div class="panel">
        <div class="panel-head">
          <strong>Últimas corridas finalizadas/canceladas</strong>
          <button onclick="loadRideHistory()">Atualizar</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>RideId</th>
              <th>Passageiro</th>
              <th>Motorista</th>
              <th>Valor</th>
              <th>Taxa</th>
              <th>Status</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody id="historyTable"><tr><td colspan="7">Carregando...</td></tr></tbody>
        </table>
      </div>
    </section>

    <section id="finance" class="section">
      <h1>Financeiro</h1>
      <p>Carteiras, receitas e taxas AVUXO.</p>

      <div class="cards">
        <div class="card"><small>Receita hoje</small><strong id="financeTodayRevenue">R$ 0</strong></div>
        <div class="card"><small>Receita mês</small><strong id="financeMonthRevenue">R$ 0</strong></div>
        <div class="card"><small>Taxas AVUXO</small><strong id="financeFeesTotal">R$ 0</strong></div>
        <div class="card"><small>Motoristas devendo</small><strong id="driversDebtCount">0</strong></div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <strong>Carteiras dos motoristas</strong>
          <button onclick="loadDrivers()">Atualizar</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Motorista</th>
              <th>Status</th>
              <th>Saldo</th>
              <th>Ganhos</th>
              <th>Taxas</th>
              <th>Bloqueado</th>
            </tr>
          </thead>
          <tbody id="walletsTable"><tr><td colspan="6">Carregando...</td></tr></tbody>
        </table>
      </div>
    </section>

    <section id="cities" class="section">
      <h1>Cidades</h1>
      <p>Estrutura pronta para expansão regional.</p>
      <div class="city-grid" id="citiesGrid"></div>
    </section>

    <section id="map" class="section">
      <h1>Mapa ao vivo</h1>
      <p>Visão operacional. A integração com Google Maps pode ser ligada depois.</p>
      <div class="map-placeholder">
        <div>
          <h2>Mapa AVUXO</h2>
          <p id="mapSummary">Carregando dados de motoristas e corridas...</p>
          <p>Quando ligar a chave do Google Maps no painel, esta área pode mostrar motoristas online, origem, destino e rota em tempo real.</p>
        </div>
      </div>
    </section>

    <section id="logs" class="section">
      <h1>Logs</h1>
      <p>Eventos recentes do painel e das corridas.</p>
      <div id="logsList"></div>
    </section>

    <section id="system" class="section">
      <h1>Sistema</h1>
      <p>Infraestrutura online.</p>
      <div class="premium-box">
        <h2>AVUXO Backend</h2>
        <p>Status: online</p>
        <p>API: /admin/drivers funcionando</p>
        <p>API: /rides/active funcionando</p>
        <p>API: /ride/history funcionando</p>
        <p>API: /admin funcionando</p>
        <p>Socket.IO: conectado ao painel admin</p>
      </div>
    </section>
  </main>
</div>

<div class="modal" id="driverModal">
  <div class="modal-content">
    <div class="modal-top">
      <div>
        <h2 id="modalDriverName">Motorista</h2>
        <p id="modalStatus">Status</p>
      </div>
      <button onclick="closeModal()">Fechar</button>
    </div>

    <div class="modal-grid">
      <div class="modal-card">
        <h3>Dados pessoais</h3>
        <p><strong>Telefone:</strong> <span id="modalPhone">-</span></p>
        <p><strong>Email:</strong> <span id="modalEmail">-</span></p>
        <p><strong>RENAVAM:</strong> <span id="modalRenavam">-</span></p>
      </div>

      <div class="modal-card">
        <h3>Veículo</h3>
        <p><strong>Modelo:</strong> <span id="modalCar">-</span></p>
        <p><strong>Placa:</strong> <span id="modalPlate">-</span></p>
        <p><strong>Cor:</strong> <span id="modalColor">-</span></p>
        <p><strong>Carteira:</strong> <span id="modalWallet">-</span></p>
      </div>
    </div>

    <div class="docs-grid" id="docsGrid"></div>

    <div style="margin-top:30px;display:flex;gap:12px;flex-wrap:wrap;">
      <button onclick="approveDriver()">Aprovar</button>
      <button class="warn-btn" onclick="blockDriver()">Bloquear</button>
      <button class="danger-btn" onclick="rejectDriver()">Rejeitar</button>
      <button class="neutral-btn" onclick="unblockDriver()">Desbloquear</button>
    </div>
  </div>
</div>

<div class="zoom-modal" id="zoomModal" onclick="closeZoom()">
  <img id="zoomedImage" src="" />
</div>

<script>
let currentDriverId = null;
let currentRideId = null;
window.driversCache = [];
window.activeRidesCache = [];
window.historyCache = [];
window.logsCache = [];

const adminToken = localStorage.getItem('avuxo_admin_token');

if (!adminToken) {
  window.location.href = '/login';
}

const socket = io({
  auth: { token: adminToken },
});

socket.emit('join:admin');

function addLog(message) {
  const item = {
    id: Date.now() + Math.random(),
    message: message,
    createdAt: new Date().toISOString(),
  };

  window.logsCache.unshift(item);
  window.logsCache = window.logsCache.slice(0, 80);
  renderLogs();
}

socket.on('connect', function() {
  document.getElementById('socketStatus').textContent = 'ONLINE';
  addLog('Painel conectado ao Socket.IO.');
});

socket.on('disconnect', function() {
  document.getElementById('socketStatus').textContent = 'RECONECTANDO';
  addLog('Painel desconectado do Socket.IO.');
});

function refreshOperationalData() {
  loadDrivers();
  loadCurrentRide();
  loadRideHistory();
  loadRideStats();
  loadPassengers();
  renderCities();
}

[
  'server:ready',
  'admin:state',
  'ride:update',
  'ride:updated',
  'ride:requested',
  'ride:accepted',
  'ride:arrived',
  'ride:started',
  'ride:finished',
  'ride:cancelled',
  'wallet:update',
  'chat:updated',
].forEach(function(eventName) {
  socket.on(eventName, function(data) {
    addLog('Evento recebido: ' + eventName + (data?.rideId ? ' • rideId ' + data.rideId : ''));
    refreshOperationalData();
  });
});

function money(value) {
  return 'R$ ' + Number(value || 0).toFixed(2).replace('.', ',');
}

function safeText(value, fallback) {
  return String(value || fallback || '-');
}

function badgeClass(value) {
  return 'badge ' + String(value || '').toLowerCase();
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('pt-BR');
}

function updateActiveRideCard(count) {
  const active = document.getElementById('activeRidesCount');
  if (active) active.textContent = String(count || 0);
}

async function loadRideStats() {
  try {
    const response = await fetch('/ride/history');
    const data = await response.json();
    const rides = data.rides || [];
    window.historyCache = rides;

    const now = new Date();

    const today = rides.filter(function(ride) {
      const date = new Date(ride.finishedAt || ride.cancelledAt || ride.createdAt);
      return date.toDateString() === now.toDateString();
    });

    const month = rides.filter(function(ride) {
      const date = new Date(ride.finishedAt || ride.cancelledAt || ride.createdAt);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    const finished = rides.filter(function(ride) { return ride.status === 'finished'; });
    const cancelled = rides.filter(function(ride) { return ride.status === 'cancelled'; });

    const todayRevenue = today.reduce(function(total, ride) {
      if (ride.status === 'cancelled') return total;
      return total + Number(ride.total || ride.price || 0);
    }, 0);

    const monthRevenue = month.reduce(function(total, ride) {
      if (ride.status === 'cancelled') return total;
      return total + Number(ride.total || ride.price || 0);
    }, 0);

    const feesTotal = rides.reduce(function(total, ride) {
      return total + Number(ride.avuxoFee || 0);
    }, 0);

    document.getElementById('todayRidesCount').textContent = today.length;
    document.getElementById('todayRevenue').textContent = money(todayRevenue);
    document.getElementById('monthRevenue').textContent = money(monthRevenue);
    document.getElementById('financeTodayRevenue').textContent = money(todayRevenue);
    document.getElementById('financeMonthRevenue').textContent = money(monthRevenue);
    document.getElementById('avuxoFeesTotal').textContent = money(feesTotal);
    document.getElementById('financeFeesTotal').textContent = money(feesTotal);
    document.getElementById('finishedRidesCount').textContent = finished.length;
    document.getElementById('cancelledRidesCount').textContent = cancelled.length;

    document.getElementById('operationalSummary').textContent =
      'Backend online • Corridas hoje: ' + today.length +
      ' • Receita hoje: ' + money(todayRevenue) +
      ' • Taxas AVUXO: ' + money(feesTotal) +
      ' • Última atualização: ' + new Date().toLocaleTimeString('pt-BR');

    renderHistory(rides);
  } catch (error) {
    console.error('Erro ao carregar estatísticas de corridas', error);
  }
}

function renderRides(rides) {
  const tbody = document.getElementById('ridesTable');
  if (!tbody) return;

  window.activeRidesCache = rides || [];

  if (!rides || !rides.length) {
    currentRideId = null;
    updateActiveRideCard(0);
    tbody.innerHTML = '<tr><td colspan="8">Nenhuma corrida ativa.</td></tr>';
    updateMapSummary();
    return;
  }

  updateActiveRideCard(rides.length);
  updateMapSummary();

  tbody.innerHTML = rides.map(function(ride) {
    const rideId = ride.rideId || ride.id;

    return (
      '<tr>' +
        '<td>' + safeText(ride.passenger?.fullName || ride.passenger?.name, 'Passageiro') + '</td>' +
        '<td>' + safeText(ride.rideType, '-') + '</td>' +
        '<td>' + safeText(ride.originName, '-') + '</td>' +
        '<td>' + safeText(ride.destinationName, '-') + '</td>' +
        '<td>' + safeText(ride.distanceText, '-') + '</td>' +
        '<td>' + safeText(ride.eta, '-') + '</td>' +
        '<td>' + money(ride.total || ride.price || 0) + '</td>' +
        '<td><span class="' + badgeClass(ride.status || 'pending') + '">' + safeText(ride.status, 'pending') + '</span></td>' +
      '</tr>' +
      '<tr>' +
        '<td colspan="8">' +
          '<b>RideId:</b> ' + safeText(rideId, '-') +
          ' | <b>Passageiro:</b> ' + safeText(ride.passenger?.fullName || ride.passenger?.name, '-') +
          ' | <b>Email:</b> ' + safeText(ride.passenger?.email, '-') +
          ' | <b>Telefone:</b> ' + safeText(ride.passenger?.phone, '-') +
          '<br><b>Motorista:</b> ' + safeText(ride.driver?.fullName || ride.driver?.name, 'Aguardando') +
          ' | <b>Telefone:</b> ' + safeText(ride.driver?.phone, '-') +
          ' | <b>Placa:</b> ' + safeText(ride.driver?.carPlate || ride.driver?.plate, '-') +
          ' | <b>Pagamento:</b> ' + safeText(ride.paymentMethod, 'wallet') +
          '<br><br>' + renderRideButtons(ride) +
        '</td>' +
      '</tr>'
    );
  }).join('');
}

function renderRideButtons(ride) {
  const rideId = ride.rideId || ride.id;
  const status = ride.status || 'pending';
  let html = '';

  if (status === 'pending') {
    html += '<button onclick="rideAction(\'/ride/accept\', \'' + rideId + '\')">Aceitar pelo painel</button> ';
  }

  if (status === 'accepted') {
    html += '<button onclick="rideAction(\'/ride/arrived\', \'' + rideId + '\')">Chegando</button> ';
    html += '<button onclick="rideAction(\'/ride/start\', \'' + rideId + '\')">Iniciar</button> ';
  }

  if (status === 'arriving') {
    html += '<button onclick="rideAction(\'/ride/start\', \'' + rideId + '\')">Iniciar</button> ';
  }

  if (status === 'in_progress') {
    html += '<button onclick="rideAction(\'/ride/finish\', \'' + rideId + '\')">Finalizar</button> ';
  }

  if (status !== 'finished' && status !== 'cancelled') {
    html += '<button class="danger-btn" onclick="rideAction(\'/ride/cancel\', \'' + rideId + '\')">Cancelar</button>';
  }

  return html;
}

async function rideAction(endpoint, rideId) {
  try {
    currentRideId = rideId;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rideId: rideId,
        reason: 'Ação feita pelo painel admin',
        cancelledBy: 'admin',
        driverId: 'admin-driver',
        name: 'Admin AVUXO',
        fullName: 'Admin AVUXO',
      }),
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || 'Erro ao executar ação da corrida.');
      return;
    }

    addLog('Ação executada pelo painel: ' + endpoint + ' • ' + rideId);
    await loadCurrentRide();
    await loadRideStats();
  } catch (error) {
    console.error(error);
    alert('Erro ao executar ação da corrida.');
  }
}

function openSection(sectionId, button) {
  document.querySelectorAll('.section').forEach(function(section) {
    section.classList.remove('active');
  });

  document.getElementById(sectionId).classList.add('active');

  document.querySelectorAll('nav button').forEach(function(btn) {
    btn.classList.remove('active');
  });

  button.classList.add('active');

  if (sectionId === 'drivers' || sectionId === 'dashboard' || sectionId === 'finance') loadDrivers();
  if (sectionId === 'rides' || sectionId === 'dashboard' || sectionId === 'finance' || sectionId === 'map') {
    loadCurrentRide();
    loadRideHistory();
    loadRideStats();
  }
  if (sectionId === 'passengers') loadPassengers();
  if (sectionId === 'cities') renderCities();
  if (sectionId === 'logs') renderLogs();
}

async function loadDrivers() {
  const tbody = document.getElementById('driversTable');
  const walletsTable = document.getElementById('walletsTable');

  if (tbody) tbody.innerHTML = '<tr><td colspan="7">Atualizando...</td></tr>';

  try {
    const response = await fetch('/admin/drivers', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + adminToken },
    });

    if (response.status === 401) {
      localStorage.removeItem('avuxo_admin_token');
      window.location.href = '/login';
      return;
    }

    const data = await response.json();

    if (!data.success) {
      if (tbody) tbody.innerHTML = '<tr><td colspan="7">Erro ao carregar motoristas.</td></tr>';
      return;
    }

    const drivers = data.drivers || [];
    window.driversCache = drivers;

    const pending = drivers.filter(function(d) { return (d.status || 'pending') === 'pending'; }).length;
    const approved = drivers.filter(function(d) { return d.status === 'approved'; }).length;
    const blocked = drivers.filter(function(d) { return d.status === 'blocked'; }).length;
    const online = drivers.filter(function(d) { return d.online === true; }).length;
    const debt = drivers.filter(function(d) { return Number(d.walletFees || 0) >= 20 || d.blocked === true; }).length;

    document.getElementById('driversCount').textContent = drivers.length;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('approvedCount').textContent = approved;
    document.getElementById('blockedCount').textContent = blocked;
    document.getElementById('onlineDriversCount').textContent = online;
    document.getElementById('driversDebtCount').textContent = debt;

    if (!drivers.length) {
      if (tbody) tbody.innerHTML = '<tr><td colspan="7">Nenhum motorista.</td></tr>';
      if (walletsTable) walletsTable.innerHTML = '<tr><td colspan="6">Nenhuma carteira.</td></tr>';
      updateMapSummary();
      return;
    }

    if (tbody) {
      tbody.innerHTML = drivers.map(function(driver, index) {
        return (
          '<tr>' +
            '<td>' + safeText(driver.fullName, '-') + '<br><small>' + safeText(driver.email, '-') + '</small></td>' +
            '<td>' + safeText(driver.phone, '-') + '</td>' +
            '<td><span class="' + badgeClass(driver.status || 'pending') + '">' + safeText(driver.status, 'pending') + '</span></td>' +
            '<td>' + (driver.online ? '<span class="badge approved">online</span>' : '<span class="badge blocked">offline</span>') + '</td>' +
            '<td>' + money(driver.walletBalance || 0) + '</td>' +
            '<td>' + money(driver.walletFees || 0) + '</td>' +
            '<td><button onclick="openModal(window.driversCache[' + index + '])">Revisar</button></td>' +
          '</tr>'
        );
      }).join('');
    }

    if (walletsTable) {
      walletsTable.innerHTML = drivers.map(function(driver) {
        return (
          '<tr>' +
            '<td>' + safeText(driver.fullName, '-') + '</td>' +
            '<td><span class="' + badgeClass(driver.status || 'pending') + '">' + safeText(driver.status, 'pending') + '</span></td>' +
            '<td>' + money(driver.walletBalance || 0) + '</td>' +
            '<td>' + money(driver.walletEarnings || 0) + '</td>' +
            '<td>' + money(driver.walletFees || 0) + '</td>' +
            '<td>' + (driver.blocked ? 'Sim' : 'Não') + '</td>' +
          '</tr>'
        );
      }).join('');
    }

    updateMapSummary();
  } catch (error) {
    console.error(error);
    if (tbody) tbody.innerHTML = '<tr><td colspan="7">Falha ao atualizar motoristas.</td></tr>';
  }
}

function createDocCard(title, image, pdf) {
  return (
    '<div class="doc-card">' +
      (image
        ? '<img src="' + image + '" onclick="openZoom(\'' + image + '\')" />'
        : '<div class="empty-doc">Sem imagem</div>'
      ) +
      '<div class="doc-info">' +
        '<div class="doc-title">' + title + '</div>' +
        (pdf ? '<button class="pdf-btn" onclick="window.open(\'' + pdf + '\', \'_blank\')">Abrir PDF</button>' : '') +
      '</div>' +
    '</div>'
  );
}

function openModal(driver) {
  currentDriverId = driver.id;
  document.getElementById('driverModal').style.display = 'flex';
  document.getElementById('modalDriverName').textContent = driver.fullName || '-';
  document.getElementById('modalStatus').textContent = 'Status: ' + (driver.status || 'pending');
  document.getElementById('modalPhone').textContent = driver.phone || '-';
  document.getElementById('modalEmail').textContent = driver.email || '-';
  document.getElementById('modalRenavam').textContent = driver.renavam || '-';
  document.getElementById('modalCar').textContent = (driver.carBrand || '') + ' ' + (driver.carModel || '');
  document.getElementById('modalPlate').textContent = driver.carPlate || '-';
  document.getElementById('modalColor').textContent = driver.carColor || '-';
  document.getElementById('modalWallet').textContent = money(driver.walletBalance || 0) + ' • Taxas: ' + money(driver.walletFees || 0);

  document.getElementById('docsGrid').innerHTML =
    createDocCard('Selfie', driver.driverPhoto) +
    createDocCard('CNH Frente', driver.cnhFrontPhoto || driver.cnhFront || driver.licensePhoto) +
    createDocCard('CNH Verso', driver.cnhBackPhoto || driver.cnhBack || driver.licenseBackPhoto) +
    createDocCard('Documento', driver.documentPhoto) +
    createDocCard('Carro Frente', driver.vehiclePhoto) +
    createDocCard('Carro Lateral', driver.vehicleSidePhoto || driver.sidePhotoLeft || driver.sidePhotoRight) +
    createDocCard('Carro Traseira', driver.vehicleBackPhoto || driver.backPhoto) +
    createDocCard('Documento Veículo', driver.vehicleDocumentPhoto, driver.vehicleDocumentPdf || driver.carDocumentPdf);
}

function closeModal() { document.getElementById('driverModal').style.display = 'none'; }

function openZoom(src) {
  if (!src) return;
  document.getElementById('zoomedImage').src = src;
  document.getElementById('zoomModal').style.display = 'flex';
}

function closeZoom() {
  document.getElementById('zoomModal').style.display = 'none';
  document.getElementById('zoomedImage').src = '';
}

async function driverAction(action, body) {
  if (!currentDriverId) return;

  try {
    const response = await fetch('/admin/drivers/' + currentDriverId + '/' + action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + adminToken,
      },
      body: JSON.stringify(body || {}),
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || 'Erro na ação do motorista.');
      return;
    }

    addLog('Motorista ' + currentDriverId + ' • ação: ' + action);
    closeModal();
    await loadDrivers();
  } catch (error) {
    console.error(error);
    alert('Erro na ação do motorista.');
  }
}

function approveDriver() { driverAction('approve'); }
function blockDriver() { driverAction('block', { reason: 'Bloqueado pelo admin' }); }
function rejectDriver() { driverAction('reject'); }
function unblockDriver() { driverAction('unblock'); }

async function loadCurrentRide() {
  const tbody = document.getElementById('ridesTable');

  try {
    const response = await fetch('/rides/active');
    const data = await response.json();
    const rides = data.rides || [];
    renderRides(rides);
  } catch (error) {
    console.error(error);
    updateActiveRideCard(0);
    if (tbody) tbody.innerHTML = '<tr><td colspan="8">Erro ao carregar corridas ativas.</td></tr>';
  }
}

async function loadRideHistory() {
  try {
    const response = await fetch('/ride/history');
    const data = await response.json();
    renderHistory(data.rides || []);
  } catch (error) {
    console.error(error);
  }
}

function renderHistory(rides) {
  const tbody = document.getElementById('historyTable');
  if (!tbody) return;

  const list = (rides || []).slice(0, 50);

  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="7">Nenhuma corrida no histórico.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(function(ride) {
    return (
      '<tr>' +
        '<td>' + safeText(ride.rideId || ride.id, '-') + '</td>' +
        '<td>' + safeText(ride.passenger?.fullName || ride.passenger?.name, '-') + '</td>' +
        '<td>' + safeText(ride.driver?.fullName || ride.driver?.name, '-') + '</td>' +
        '<td>' + money(ride.total || ride.price || 0) + '</td>' +
        '<td>' + money(ride.avuxoFee || 0) + '</td>' +
        '<td><span class="' + badgeClass(ride.status || '-') + '">' + safeText(ride.status, '-') + '</span></td>' +
        '<td>' + formatDate(ride.finishedAt || ride.cancelledAt || ride.createdAt) + '</td>' +
      '</tr>'
    );
  }).join('');
}

function loadPassengers() {
  const tbody = document.getElementById('passengersTable');
  if (!tbody) return;

  const rides = window.historyCache || [];
  const map = {};

  rides.forEach(function(ride) {
    const p = ride.passenger || {};
    const id = p.uid || p.id || ride.passengerId || p.phone || 'passenger-' + Math.random();

    if (!map[id]) {
      map[id] = {
        name: p.fullName || p.name || 'Passageiro',
        phone: p.phone || '-',
        email: p.email || '-',
        rides: 0,
        spent: 0,
      };
    }

    map[id].rides += 1;
    if (ride.status !== 'cancelled') {
      map[id].spent += Number(ride.total || ride.price || 0);
    }
  });

  const passengers = Object.values(map);

  if (!passengers.length) {
    tbody.innerHTML = '<tr><td colspan="5">Nenhum passageiro encontrado no histórico ainda.</td></tr>';
    return;
  }

  tbody.innerHTML = passengers.map(function(passenger) {
    return (
      '<tr>' +
        '<td>' + safeText(passenger.name, '-') + '</td>' +
        '<td>' + safeText(passenger.phone, '-') + '</td>' +
        '<td>' + safeText(passenger.email, '-') + '</td>' +
        '<td>' + passenger.rides + '</td>' +
        '<td>' + money(passenger.spent) + '</td>' +
      '</tr>'
    );
  }).join('');
}

function renderCities() {
  const grid = document.getElementById('citiesGrid');
  if (!grid) return;

  const cities = [
    { name: 'Pimenta Bueno', state: 'RO', active: true, fee: '10% + R$ 0,50', radius: '15 km' },
    { name: 'Espigão do Oeste', state: 'RO', active: false, fee: '10% + R$ 0,50', radius: '15 km' },
    { name: 'Cacoal', state: 'RO', active: false, fee: '12% + R$ 0,50', radius: '20 km' },
    { name: 'Rolim de Moura', state: 'RO', active: false, fee: '10% + R$ 0,75', radius: '18 km' },
    { name: 'Ji-Paraná', state: 'RO', active: false, fee: '12% + R$ 1,00', radius: '25 km' },
    { name: 'Vilhena', state: 'RO', active: false, fee: '15% + R$ 1,00', radius: '25 km' },
  ];

  grid.innerHTML = cities.map(function(city) {
    return (
      '<div class="city-card">' +
        '<h3>' + city.name + ' - ' + city.state + '</h3>' +
        '<p><strong>Status:</strong> <span class="' + (city.active ? 'badge approved' : 'badge blocked') + '">' + (city.active ? 'Ativa' : 'Inativa') + '</span></p>' +
        '<p><strong>Taxa:</strong> ' + city.fee + '</p>' +
        '<p><strong>Raio:</strong> ' + city.radius + '</p>' +
        '<button class="neutral-btn" onclick="alert(\'Em breve: edição direta da cidade no backend.\')">Configurar</button>' +
      '</div>'
    );
  }).join('');
}

function updateMapSummary() {
  const mapSummary = document.getElementById('mapSummary');
  if (!mapSummary) return;

  const online = (window.driversCache || []).filter(function(d) { return d.online === true; }).length;
  const active = (window.activeRidesCache || []).length;

  mapSummary.textContent = 'Motoristas online: ' + online + ' • Corridas ativas: ' + active;
}

function renderLogs() {
  const list = document.getElementById('logsList');
  if (!list) return;

  if (!window.logsCache.length) {
    list.innerHTML = '<div class="mini-log">Nenhum log ainda.</div>';
    return;
  }

  list.innerHTML = window.logsCache.map(function(log) {
    return (
      '<div class="mini-log">' +
        '<div class="log-time">' + formatDate(log.createdAt) + '</div>' +
        '<div>' + safeText(log.message, '-') + '</div>' +
      '</div>'
    );
  }).join('');
}

function logoutAdmin() {
  localStorage.removeItem('avuxo_admin_token');
  window.location.href = '/login';
}

refreshOperationalData();
renderCities();
renderLogs();

setInterval(function() {
  loadRideStats();
}, 15000);
</script>

</body>
</html>
    `);
  });
}
