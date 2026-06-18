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
* {
  box-sizing: border-box;
}

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
  z-index: 10;
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

.nav-btn,
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
  text-decoration: none;
  display: block;
  width: 100%;
  font-family: Arial, sans-serif;
  font-size: 14px;
}

.nav-btn:hover,
.nav-btn.active,
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

.section {
  display: none;
}

.section.active {
  display: block;
}

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
.panel-head h2 {
  margin: 0;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 16px;
  color: var(--muted);
  border-bottom: 1px solid var(--line);
}

td {
  padding: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 800;
}

.badge-green {
  background: rgba(36,248,119,0.14);
  color: #24F877;
}

.badge-yellow {
  background: rgba(255,204,102,0.14);
  color: #ffcc66;
}

.badge-red {
  background: rgba(255,95,95,0.14);
  color: #ff5f5f;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn {
  border: 0;
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 800;
}

.btn-green {
  background: rgba(36,248,119,0.14);
  color: #24F877;
}

.btn-red {
  background: rgba(255,95,95,0.14);
  color: #ff5f5f;
}

.btn-yellow {
  background: rgba(255,204,102,0.14);
  color: #ffcc66;
}

.btn-blue {
  background: rgba(0,140,255,0.14);
  color: #62b1ff;
}

.mini-log {
  padding: 16px;
  border-radius: 20px;
  margin-bottom: 10px;
}

.mini-log-title {
  font-weight: 900;
}

.mini-log-sub {
  color: var(--muted);
  margin-top: 6px;
  font-size: 13px;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: var(--muted);
}

.refresh-btn {
  padding: 14px 22px;
  border-radius: 18px;
  background: rgba(36,248,119,0.12);
  color: white;
  border: 0;
  font-weight: 900;
  cursor: pointer;
}

@media(max-width:1200px){
  .cards{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }
}

@media(max-width:900px){
  .shell{
    grid-template-columns:1fr;
  }

  aside{
    height:auto;
    position:relative;
  }

  .cards{
    grid-template-columns:1fr;
  }
}
</style>
</head>

<body>

<div class="shell">

<aside>

<div class="logo">AVUXO</div>

<div class="sub">
COMMAND CENTER
</div>

<div class="status-pill">
<div class="status-dot"></div>
ONLINE
</div>

<nav id="adminNav">

<button class="nav-btn active" data-section="dashboard">
Dashboard
</button>

<button class="nav-btn" data-section="drivers">
Motoristas
</button>

<button class="nav-btn" data-section="passengers">
Passageiros
</button>

<button class="nav-btn" data-section="rides">
Corridas
</button>

<button class="nav-btn" data-section="finance">
Financeiro
</button>

<button class="nav-btn" data-section="cities">
Cidades
</button>

<button class="nav-btn" data-section="map">
Mapa ao vivo
</button>

<button class="nav-btn" data-section="logs">
Logs
</button>

<button class="nav-btn" data-section="system">
Sistema
</button>

<button id="logoutBtn">
Logout
</button>

</nav>

</aside>

<main>

<div class="top-row">

<div>
<h1>Dashboard</h1>
<p>
Painel operacional AVUXO em tempo real.
</p>
</div>

<button
class="refresh-btn"
onclick="refreshOperationalData()"
>
Atualizar tudo
</button>

</div>
<section id="dashboard" class="section active">

<div class="cards">

<div class="card">
<small>Motoristas</small>
<strong id="driversCount">0</strong>
<div class="hint">Total cadastrado</div>
</div>

<div class="card">
<small>Online</small>
<strong id="onlineDriversCount">0</strong>
<div class="hint">Disponíveis agora</div>
</div>

<div class="card">
<small>Pendentes</small>
<strong id="pendingCount">0</strong>
<div class="hint">Aguardando revisão</div>
</div>

<div class="card">
<small>Aprovados</small>
<strong id="approvedCount">0</strong>
<div class="hint">Liberados</div>
</div>

<div class="card">
<small>Bloqueados</small>
<strong id="blockedCount">0</strong>
<div class="hint">Sem acesso</div>
</div>

<div class="card">
<small>Corridas ativas</small>
<strong id="activeRidesCount">0</strong>
<div class="hint">Em andamento/agendadas</div>
</div>

<div class="card">
<small>Corridas hoje</small>
<strong id="todayRidesCount">0</strong>
<div class="hint">Histórico do dia</div>
</div>

<div class="card">
<small>Receita hoje</small>
<strong id="todayRevenue">R$ 0,00</strong>
<div class="hint">Corridas finalizadas</div>
</div>

<div class="card">
<small>Receita mês</small>
<strong id="monthRevenue">R$ 0,00</strong>
<div class="hint">Total mensal</div>
</div>

<div class="card">
<small>Taxas AVUXO</small>
<strong id="avuxoFeesTotal">R$ 0,00</strong>
<div class="hint">Taxas registradas</div>
</div>

<div class="card">
<small>Finalizadas</small>
<strong id="finishedRidesCount">0</strong>
<div class="hint">Histórico geral</div>
</div>

<div class="card">
<small>Canceladas</small>
<strong id="cancelledRidesCount">0</strong>
<div class="hint">Histórico geral</div>
</div>

</div>

<div class="premium-box">
<h2>Resumo operacional</h2>
<p id="operationalSummary">
Backend online, painel ativo e dados carregando.
</p>
</div>

</section>

<section id="drivers" class="section">

<h1>Motoristas</h1>
<p>Gerencie aprovações, bloqueios, carteira e documentos.</p>

<div class="panel">
<div class="panel-head">
<h2>Motoristas cadastrados</h2>
<button class="refresh-btn" onclick="loadDrivers()">Atualizar</button>
</div>

<div class="table-wrap">
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
<tbody id="driversTable">
<tr>
<td colspan="7">Carregando...</td>
</tr>
</tbody>
</table>
</div>
</div>

</section>

<section id="passengers" class="section">

<h1>Passageiros</h1>
<p>Visão operacional dos passageiros com base nas corridas registradas.</p>

<div class="panel">
<div class="panel-head">
<h2>Passageiros encontrados</h2>
<button class="refresh-btn" onclick="loadPassengers()">Atualizar</button>
</div>

<div class="table-wrap">
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
<tbody id="passengersTable">
<tr>
<td colspan="5">Carregando...</td>
</tr>
</tbody>
</table>
</div>
</div>

</section>

<section id="rides" class="section">

<h1>Corridas</h1>
<p>Corridas realtime AVUXO.</p>

<div class="panel">
<div class="panel-head">
<h2>Corridas ativas</h2>
<button class="refresh-btn" onclick="loadCurrentRide()">Atualizar</button>
</div>

<div class="table-wrap">
<table>
<thead>
<tr>
<th>Passageiro</th>
<th>Tipo</th>
<th>Origem</th>
<th>Destino</th>
<th>Valor</th>
<th>Status</th>
</tr>
</thead>
<tbody id="ridesTable">
<tr>
<td colspan="6">Carregando...</td>
</tr>
</tbody>
</table>
</div>
</div>

<div class="panel">
<div class="panel-head">
<h2>Histórico</h2>
<button class="refresh-btn" onclick="loadRideHistory()">Atualizar</button>
</div>

<div class="table-wrap">
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
<tbody id="historyTable">
<tr>
<td colspan="7">Carregando...</td>
</tr>
</tbody>
</table>
</div>
</div>

</section>
<section id="finance" class="section">

<h1>Financeiro</h1>
<p>Carteiras, receitas e taxas AVUXO.</p>

<div class="cards">

<div class="card">
<small>Receita hoje</small>
<strong id="financeTodayRevenue">R$ 0,00</strong>
</div>

<div class="card">
<small>Receita mês</small>
<strong id="financeMonthRevenue">R$ 0,00</strong>
</div>

<div class="card">
<small>Taxas AVUXO</small>
<strong id="financeFeesTotal">R$ 0,00</strong>
</div>

<div class="card">
<small>Motoristas devendo</small>
<strong id="driversDebtCount">0</strong>
</div>

</div>

<div class="panel">
<div class="panel-head">
<h2>Carteiras dos motoristas</h2>
<button class="refresh-btn" onclick="loadDrivers()">Atualizar</button>
</div>

<div class="table-wrap">
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
<tbody id="walletsTable">
<tr>
<td colspan="6">Carregando...</td>
</tr>
</tbody>
</table>
</div>
</div>

</section>

<section id="cities" class="section">

<h1>Cidades</h1>
<p>Estrutura pronta para expansão regional.</p>

<div class="cards">

<div class="card">
<small>Cidade principal</small>
<strong>Pimenta Bueno</strong>
<div class="hint">RO</div>
</div>

<div class="card">
<small>Status</small>
<strong>Ativa</strong>
<div class="hint">Operação inicial</div>
</div>

<div class="card">
<small>Raio</small>
<strong>15 km</strong>
<div class="hint">Cobertura base</div>
</div>

<div class="card">
<small>Taxa</small>
<strong>R$ 0,50</strong>
<div class="hint">Por corrida finalizada</div>
</div>

</div>

<div class="premium-box">
<h2>Expansão</h2>
<p>
Área pronta para futuras cidades: Espigão do Oeste, Cacoal, Rolim de Moura, Ji-Paraná e Vilhena.
</p>
</div>

</section>

<section id="map" class="section">

<h1>Mapa ao vivo</h1>
<p>Visão operacional. A integração com Google Maps pode ser ligada depois.</p>

<div class="premium-box">
<h2>Mapa AVUXO</h2>
<p id="mapSummary">Carregando dados de motoristas e corridas...</p>
<p>
Quando ligar a chave do Google Maps no painel, esta área pode mostrar motoristas online, origem, destino e rota em tempo real.
</p>
</div>

</section>

<section id="logs" class="section">

<h1>Logs</h1>
<p>Eventos recentes do painel e das corridas.</p>

<div id="logsList">
<div class="mini-log">
<div class="mini-log-title">Painel iniciado</div>
<div class="mini-log-sub">Aguardando eventos.</div>
</div>
</div>

</section>

<section id="system" class="section">

<h1>Sistema</h1>
<p>Infraestrutura online.</p>

<div class="premium-box">
<h2>AVUXO Backend</h2>
<p>Status: online</p>
<p>API: /admin/drivers</p>
<p>API: /rides/active</p>
<p>API: /ride/history</p>
<p>API: /admin</p>
<p>Socket.IO: opcional no painel</p>
</div>

</section>

</main>
</div>

<div id="driverModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.82);z-index:9999;align-items:center;justify-content:center;padding:30px;">

<div style="width:100%;max-width:900px;background:#0b0f14;border:1px solid rgba(255,255,255,0.08);border-radius:28px;padding:28px;max-height:90vh;overflow:auto;">

<div class="top-row">
<div>
<h2 id="modalDriverName">Motorista</h2>
<p id="modalStatus">Status</p>
</div>

<button class="btn btn-red" onclick="closeModal()">Fechar</button>
</div>

<div class="cards">

<div class="card">
<small>Telefone</small>
<strong id="modalPhone">-</strong>
</div>

<div class="card">
<small>Email</small>
<strong id="modalEmail">-</strong>
</div>

<div class="card">
<small>Veículo</small>
<strong id="modalCar">-</strong>
</div>

<div class="card">
<small>Placa</small>
<strong id="modalPlate">-</strong>
</div>

</div>

<div class="action-row" style="margin-top:24px;">
<button class="btn btn-green" onclick="approveDriver()">Aprovar</button>
<button class="btn btn-yellow" onclick="blockDriver()">Bloquear</button>
<button class="btn btn-red" onclick="rejectDriver()">Rejeitar</button>
<button class="btn btn-blue" onclick="unblockDriver()">Desbloquear</button>
</div>

</div>
</div>
<script>
let currentDriverId = null;
let driversCache = [];
let activeRidesCache = [];
let historyCache = [];
let logsCache = [];

const adminToken = localStorage.getItem('avuxo_admin_token');

if (!adminToken) {
  window.location.href = '/login';
}

function byId(id) {
  return document.getElementById(id);
}

function money(value) {
  return 'R$ ' + Number(value || 0).toFixed(2).replace('.', ',');
}

function safeText(value, fallback = '-') {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
}

function statusBadge(status) {
  const value = safeText(status, 'pending').toLowerCase();

  if (value === 'approved' || value === 'finished' || value === 'online') {
    return '<span class="badge badge-green">' + value + '</span>';
  }

  if (value === 'pending' || value === 'arriving' || value === 'accepted') {
    return '<span class="badge badge-yellow">' + value + '</span>';
  }

  return '<span class="badge badge-red">' + value + '</span>';
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('pt-BR');
}

function addLog(title, subtitle = '') {
  logsCache.unshift({
    title,
    subtitle,
    createdAt: new Date().toISOString(),
  });

  logsCache = logsCache.slice(0, 60);
  renderLogs();
}

function openSection(sectionId) {
  document.querySelectorAll('.section').forEach(function(section) {
    section.classList.remove('active');
  });

  const section = byId(sectionId) || byId('dashboard');
  section.classList.add('active');

  document.querySelectorAll('#adminNav .nav-btn').forEach(function(button) {
    button.classList.remove('active');
  });

  const activeButton = document.querySelector('#adminNav .nav-btn[data-section="' + sectionId + '"]');
  if (activeButton) activeButton.classList.add('active');

  const title = document.querySelector('.top-row h1');
  const subtitle = document.querySelector('.top-row p');

  const titles = {
    dashboard: ['Dashboard', 'Painel operacional AVUXO em tempo real.'],
    drivers: ['Motoristas', 'Gerencie aprovações, bloqueios, carteira e documentos.'],
    passengers: ['Passageiros', 'Visão operacional dos passageiros.'],
    rides: ['Corridas', 'Corridas realtime AVUXO.'],
    finance: ['Financeiro', 'Carteiras, receitas e taxas AVUXO.'],
    cities: ['Cidades', 'Estrutura pronta para expansão regional.'],
    map: ['Mapa ao vivo', 'Visão operacional.'],
    logs: ['Logs', 'Eventos recentes do painel e das corridas.'],
    system: ['Sistema', 'Infraestrutura online.'],
  };

  if (title) title.textContent = titles[sectionId]?.[0] || 'Dashboard';
  if (subtitle) subtitle.textContent = titles[sectionId]?.[1] || 'Painel operacional AVUXO em tempo real.';

  if (sectionId === 'dashboard') refreshOperationalData();
  if (sectionId === 'drivers') loadDrivers();
  if (sectionId === 'passengers') loadPassengers();
  if (sectionId === 'rides') {
    loadCurrentRide();
    loadRideHistory();
  }
  if (sectionId === 'finance') {
    loadDrivers();
    loadRideStats();
  }
  if (sectionId === 'map') {
    loadDrivers();
    loadCurrentRide();
  }
  if (sectionId === 'logs') renderLogs();

  try {
    const url = new URL(window.location.href);
    url.searchParams.set('section', sectionId);
    window.history.replaceState({}, '', url.toString());
  } catch (_) {}
}

function bindNavigation() {
  document.querySelectorAll('#adminNav .nav-btn[data-section]').forEach(function(button) {
    button.addEventListener('click', function() {
      openSection(button.dataset.section);
    });
  });

  const logoutBtn = byId('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutAdmin);
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + adminToken,
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('avuxo_admin_token');
    window.location.href = '/login';
    throw new Error('Não autorizado');
  }

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (_) {
    return {};
  }
}

function refreshOperationalData() {
  loadDrivers();
  loadCurrentRide();
  loadRideHistory();
  loadRideStats();
  loadPassengers();
  updateMapSummary();
  addLog('Painel atualizado', 'Dados principais recarregados.');
}
async function loadDrivers() {
  const tbody = byId('driversTable');
  const walletsTable = byId('walletsTable');

  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="7">Atualizando...</td></tr>';
  }

  try {
    const data = await fetchJson('/admin/drivers');
    const drivers = Array.isArray(data.drivers) ? data.drivers : [];

    driversCache = drivers;

    const pending = drivers.filter(d => (d.status || 'pending') === 'pending').length;
    const approved = drivers.filter(d => d.status === 'approved').length;
    const blocked = drivers.filter(d => d.status === 'blocked' || d.blocked === true).length;
    const online = drivers.filter(d => d.online === true).length;
    const debt = drivers.filter(d => Number(d.walletFees || 0) >= 20 || d.blocked === true).length;

    if (byId('driversCount')) byId('driversCount').textContent = String(drivers.length);
    if (byId('pendingCount')) byId('pendingCount').textContent = String(pending);
    if (byId('approvedCount')) byId('approvedCount').textContent = String(approved);
    if (byId('blockedCount')) byId('blockedCount').textContent = String(blocked);
    if (byId('onlineDriversCount')) byId('onlineDriversCount').textContent = String(online);
    if (byId('driversDebtCount')) byId('driversDebtCount').textContent = String(debt);

    if (!drivers.length) {
      if (tbody) tbody.innerHTML = '<tr><td colspan="7">Nenhum motorista cadastrado.</td></tr>';
      if (walletsTable) walletsTable.innerHTML = '<tr><td colspan="6">Nenhuma carteira encontrada.</td></tr>';
      updateMapSummary();
      return;
    }

    if (tbody) {
      tbody.innerHTML = drivers.map(function(driver, index) {
        return (
          '<tr>' +
            '<td>' +
              '<strong>' + safeText(driver.fullName || driver.name, '-') + '</strong><br>' +
              '<small>' + safeText(driver.email, '-') + '</small>' +
            '</td>' +
            '<td>' + safeText(driver.phone, '-') + '</td>' +
            '<td>' + statusBadge(driver.status || 'pending') + '</td>' +
            '<td>' + statusBadge(driver.online ? 'online' : 'offline') + '</td>' +
            '<td>' + money(driver.walletBalance || 0) + '</td>' +
            '<td>' + money(driver.walletFees || 0) + '</td>' +
            '<td>' +
              '<div class="action-row">' +
                '<button class="btn btn-blue" onclick="openModalByIndex(' + index + ')">Revisar</button>' +
              '</div>' +
            '</td>' +
          '</tr>'
        );
      }).join('');
    }

    if (walletsTable) {
      walletsTable.innerHTML = drivers.map(function(driver) {
        return (
          '<tr>' +
            '<td>' + safeText(driver.fullName || driver.name, '-') + '</td>' +
            '<td>' + statusBadge(driver.status || 'pending') + '</td>' +
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
    if (tbody) tbody.innerHTML = '<tr><td colspan="7">Erro ao carregar motoristas.</td></tr>';
  }
}

function openModalByIndex(index) {
  const driver = driversCache[index];
  if (!driver) return;

  currentDriverId = driver.id || driver.driverId || driver.phone;

  byId('modalDriverName').textContent = safeText(driver.fullName || driver.name, 'Motorista');
  byId('modalStatus').textContent = 'Status: ' + safeText(driver.status, 'pending');
  byId('modalPhone').textContent = safeText(driver.phone, '-');
  byId('modalEmail').textContent = safeText(driver.email, '-');
  byId('modalCar').textContent = safeText((driver.carBrand || '') + ' ' + (driver.carModel || ''), '-');
  byId('modalPlate').textContent = safeText(driver.carPlate || driver.plate, '-');

  const modal = byId('driverModal');
  if (modal) modal.style.display = 'flex';
}

function closeModal() {
  const modal = byId('driverModal');
  if (modal) modal.style.display = 'none';
}

async function driverAction(action, body = {}) {
  if (!currentDriverId) {
    alert('Motorista não selecionado.');
    return;
  }

  try {
    const data = await fetchJson('/admin/drivers/' + currentDriverId + '/' + action, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!data.success) {
      alert(data.message || 'Erro ao executar ação.');
      return;
    }

    addLog('Motorista atualizado', 'Ação: ' + action);
    closeModal();
    await loadDrivers();
  } catch (error) {
    console.error(error);
    alert('Erro ao executar ação do motorista.');
  }
}

function approveDriver() {
  driverAction('approve');
}

function blockDriver() {
  driverAction('block', { reason: 'Bloqueado pelo admin' });
}

function rejectDriver() {
  driverAction('reject', { reason: 'Rejeitado pelo admin' });
}

function unblockDriver() {
  driverAction('unblock');
}
async function loadCurrentRide() {
  const tbody = byId('ridesTable');

  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="6">Atualizando...</td></tr>';
  }

  try {
    const data = await fetchJson('/rides/active');
    const rides = Array.isArray(data.rides) ? data.rides : [];

    activeRidesCache = rides;

    if (byId('activeRidesCount')) {
      byId('activeRidesCount').textContent = String(rides.length);
    }

    if (!rides.length) {
      if (tbody) tbody.innerHTML = '<tr><td colspan="6">Nenhuma corrida ativa.</td></tr>';
      updateMapSummary();
      return;
    }

    if (tbody) {
      tbody.innerHTML = rides.map(function(ride) {
        return (
          '<tr>' +
            '<td>' + safeText(ride.passenger?.fullName || ride.passenger?.name, 'Passageiro') + '</td>' +
            '<td>' + safeText(ride.rideType, '-') + '</td>' +
            '<td>' + safeText(ride.originName, '-') + '</td>' +
            '<td>' + safeText(ride.destinationName, '-') + '</td>' +
            '<td>' + money(ride.total || ride.price || 0) + '</td>' +
            '<td>' + statusBadge(ride.status || 'pending') + '</td>' +
          '</tr>'
        );
      }).join('');
    }

    updateMapSummary();
  } catch (error) {
    console.error(error);
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="6">Erro ao carregar corridas ativas.</td></tr>';
    }
  }
}

async function loadRideHistory() {
  const tbody = byId('historyTable');

  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="7">Atualizando...</td></tr>';
  }

  try {
    const data = await fetchJson('/ride/history');
    const rides = Array.isArray(data.rides) ? data.rides : [];

    historyCache = rides;
    renderHistory(rides);
    updateRideStatsFromHistory(rides);
  } catch (error) {
    console.error(error);
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="7">Erro ao carregar histórico.</td></tr>';
    }
  }
}

function renderHistory(rides) {
  const tbody = byId('historyTable');
  if (!tbody) return;

  const list = Array.isArray(rides) ? rides.slice(0, 80) : [];

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
        '<td>' + statusBadge(ride.status || '-') + '</td>' +
        '<td>' + formatDate(ride.finishedAt || ride.cancelledAt || ride.createdAt) + '</td>' +
      '</tr>'
    );
  }).join('');
}

async function loadRideStats() {
  try {
    const data = await fetchJson('/ride/history');
    const rides = Array.isArray(data.rides) ? data.rides : [];

    historyCache = rides;
    updateRideStatsFromHistory(rides);
  } catch (error) {
    console.error(error);
  }
}

function updateRideStatsFromHistory(rides) {
  const list = Array.isArray(rides) ? rides : [];
  const now = new Date();

  const today = list.filter(function(ride) {
    const date = new Date(ride.finishedAt || ride.cancelledAt || ride.createdAt);
    return !Number.isNaN(date.getTime()) && date.toDateString() === now.toDateString();
  });

  const month = list.filter(function(ride) {
    const date = new Date(ride.finishedAt || ride.cancelledAt || ride.createdAt);
    return !Number.isNaN(date.getTime()) &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
  });

  const finished = list.filter(ride => ride.status === 'finished');
  const cancelled = list.filter(ride => ride.status === 'cancelled');

  const todayRevenue = today.reduce(function(total, ride) {
    if (ride.status === 'cancelled') return total;
    return total + Number(ride.total || ride.price || 0);
  }, 0);

  const monthRevenue = month.reduce(function(total, ride) {
    if (ride.status === 'cancelled') return total;
    return total + Number(ride.total || ride.price || 0);
  }, 0);

  const feesTotal = list.reduce(function(total, ride) {
    return total + Number(ride.avuxoFee || 0);
  }, 0);

  if (byId('todayRidesCount')) byId('todayRidesCount').textContent = String(today.length);
  if (byId('todayRevenue')) byId('todayRevenue').textContent = money(todayRevenue);
  if (byId('monthRevenue')) byId('monthRevenue').textContent = money(monthRevenue);
  if (byId('financeTodayRevenue')) byId('financeTodayRevenue').textContent = money(todayRevenue);
  if (byId('financeMonthRevenue')) byId('financeMonthRevenue').textContent = money(monthRevenue);
  if (byId('avuxoFeesTotal')) byId('avuxoFeesTotal').textContent = money(feesTotal);
  if (byId('financeFeesTotal')) byId('financeFeesTotal').textContent = money(feesTotal);
  if (byId('finishedRidesCount')) byId('finishedRidesCount').textContent = String(finished.length);
  if (byId('cancelledRidesCount')) byId('cancelledRidesCount').textContent = String(cancelled.length);

  if (byId('operationalSummary')) {
    byId('operationalSummary').textContent =
      'Backend online • Corridas hoje: ' + today.length +
      ' • Receita hoje: ' + money(todayRevenue) +
      ' • Taxas AVUXO: ' + money(feesTotal);
  }
}

function loadPassengers() {
  const tbody = byId('passengersTable');

  if (!tbody) return;

  const rides = Array.isArray(historyCache) ? historyCache : [];
  const map = {};

  rides.forEach(function(ride) {
    const passenger = ride.passenger || {};
    const key =
      passenger.uid ||
      passenger.id ||
      passenger.phone ||
      passenger.email ||
      ride.passengerId ||
      'passenger-' + Math.random();

    if (!map[key]) {
      map[key] = {
        name: passenger.fullName || passenger.name || 'Passageiro',
        phone: passenger.phone || '-',
        email: passenger.email || '-',
        rides: 0,
        spent: 0,
      };
    }

    map[key].rides += 1;

    if (ride.status !== 'cancelled') {
      map[key].spent += Number(ride.total || ride.price || 0);
    }
  });

  const passengers = Object.values(map);

  if (!passengers.length) {
    tbody.innerHTML = '<tr><td colspan="5">Nenhum passageiro encontrado ainda.</td></tr>';
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
function updateMapSummary() {
  const online = driversCache.filter(driver => driver.online === true).length;
  const active = activeRidesCache.length;

  const mapSummary = byId('mapSummary');

  if (mapSummary) {
    mapSummary.textContent =
      'Motoristas online: ' + online +
      ' • Corridas ativas: ' + active;
  }
}

function renderLogs() {
  const list = byId('logsList');

  if (!list) return;

  if (!logsCache.length) {
    list.innerHTML =
      '<div class="mini-log">' +
        '<div class="mini-log-title">Nenhum log ainda</div>' +
        '<div class="mini-log-sub">Aguardando eventos do painel.</div>' +
      '</div>';
    return;
  }

  list.innerHTML = logsCache.map(function(log) {
    return (
      '<div class="mini-log">' +
        '<div class="mini-log-title">' + safeText(log.title, '-') + '</div>' +
        '<div class="mini-log-sub">' +
          formatDate(log.createdAt) +
          (log.subtitle ? ' • ' + safeText(log.subtitle, '') : '') +
        '</div>' +
      '</div>'
    );
  }).join('');
}

function logoutAdmin() {
  localStorage.removeItem('avuxo_admin_token');
  window.location.href = '/login';
}

function openInitialSection() {
  let sectionId = 'dashboard';

  try {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('section');

    const allowed = [
      'dashboard',
      'drivers',
      'passengers',
      'rides',
      'finance',
      'cities',
      'map',
      'logs',
      'system',
    ];

    if (requested && allowed.includes(requested)) {
      sectionId = requested;
    }
  } catch (_) {}

  openSection(sectionId);
}

function bootAdminPanel() {
  bindNavigation();
  renderLogs();
  openInitialSection();

  setInterval(function() {
    loadRideStats();
    updateMapSummary();
  }, 15000);
}

document.addEventListener('DOMContentLoaded', bootAdminPanel);
</script>

</body>
</html>
    `);
  });
}
