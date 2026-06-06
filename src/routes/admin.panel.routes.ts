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

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(36,248,119,0.14), transparent 32%),
    radial-gradient(circle at 90% 10%, rgba(36,248,119,0.06), transparent 28%),
    #050609;
  color: white;
  font-family: Arial, sans-serif;
}

.shell { display: grid; grid-template-columns: 280px 1fr; min-height: 100vh; }

aside {
  padding: 30px;
  background: rgba(255,255,255,0.03);
  border-right: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(20px);
}

.logo {
  color: #24F877;
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 4px;
  text-shadow: 0 0 28px rgba(36,248,119,0.32);
}

.sub {
  margin-top: 8px;
  color: #8c96a8;
  font-size: 12px;
  letter-spacing: 3px;
}

nav { margin-top: 40px; display: grid; gap: 12px; }

button {
  border: 0;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255,255,255,0.04);
  color: white;
  text-align: left;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s;
}

button:hover, button.active {
  color: #24F877;
  background: rgba(36,248,119,0.12);
}

main { padding: 40px; }

h1 { margin-top: 0; font-size: 40px; }

p { color: #8c96a8; }

.section { display: none; }

.section.active { display: block; }

.cards {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.card {
  padding: 24px;
  border-radius: 24px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 20px 60px rgba(0,0,0,0.22);
}

.card small { color: #8c96a8; }

.card strong {
  display: block;
  margin-top: 12px;
  font-size: 34px;
}

.panel {
  margin-top: 30px;
  border-radius: 28px;
  overflow: auto;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 20px 60px rgba(0,0,0,0.22);
}

.panel-head {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

table { width: 100%; border-collapse: collapse; min-width: 900px; }

th, td {
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  text-align: left;
  vertical-align: top;
}

th {
  color: #8c96a8;
  font-size: 12px;
  text-transform: uppercase;
}

.badge {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(36,248,119,0.12);
  color: #24F877;
  font-size: 12px;
  font-weight: 900;
}

.premium-box {
  margin-top: 30px;
  padding: 28px;
  border-radius: 28px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.82);
  display: none;
  justify-content: center;
  align-items: center;
  padding: 30px;
  z-index: 9999;
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

.modal-grid {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.modal-card {
  padding: 22px;
  border-radius: 22px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
}

.modal-card h3 {
  margin-top: 0;
  color: #24F877;
  margin-bottom: 18px;
}

.docs-grid {
  margin-top: 26px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.doc-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 22px;
  overflow: hidden;
}

.doc-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
  cursor: pointer;
}

.doc-info { padding: 16px; }

.doc-title { font-weight: 900; margin-bottom: 8px; }

.pdf-btn {
  background: rgba(36,248,119,0.14);
  color: #24F877;
}

.danger-btn {
  background: rgba(255,77,77,0.12);
  color: #ff5f5f;
}

.warn-btn {
  background: rgba(255,204,102,0.12);
  color: #ffcc66;
}

.zoom-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.94);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  padding: 40px;
}

.zoom-modal img {
  max-width: 95%;
  max-height: 95%;
  border-radius: 24px;
}

.empty-doc {
  height: 220px;
  display: grid;
  place-items: center;
  color: #8c96a8;
  background: rgba(255,255,255,0.03);
}

@media (max-width: 900px) {
  .shell { grid-template-columns: 1fr; }
  aside { position: static; }
  .cards { grid-template-columns: repeat(2, 1fr); }
  main { padding: 22px; }
}
</style>

<script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
</head>

<body>
<div class="shell">
  <aside>
    <div class="logo">AVUXO</div>
    <div class="sub">COMMAND CENTER</div>

    <nav>
      <button onclick="logoutAdmin()">Logout</button>
      <button class="active" onclick="openSection('dashboard', this)">Dashboard</button>
      <button onclick="openSection('drivers', this)">Motoristas</button>
      <button onclick="openSection('rides', this)">Corridas</button>
      <button onclick="openSection('finance', this)">Financeiro</button>
      <button onclick="openSection('system', this)">Sistema</button>
    </nav>
  </aside>

  <main>
    <section id="dashboard" class="section active">
      <h1>Dashboard</h1>
      <p>Painel premium operacional.</p>

      <div class="cards">
        <div class="card"><small>Motoristas</small><strong id="driversCount">0</strong></div>
        <div class="card"><small>Pendentes</small><strong id="pendingCount">0</strong></div>
        <div class="card"><small>Aprovados</small><strong id="approvedCount">0</strong></div>
        <div class="card"><small>Bloqueados</small><strong id="blockedCount">0</strong></div>
        <div class="card"><small>Corridas ativas</small><strong id="activeRidesCount">0</strong></div>
        <div class="card"><small>Corridas hoje</small><strong id="todayRidesCount">0</strong></div>
        <div class="card"><small>Receita hoje</small><strong id="todayRevenue">R$ 0</strong></div>
        <div class="card"><small>Receita mês</small><strong id="monthRevenue">R$ 0</strong></div>
      </div>

      <div class="premium-box">
        <h2>Resumo operacional</h2>
        <p id="operationalSummary">Backend online, painel ativo e dados carregando.</p>
      </div>
    </section>

    <section id="drivers" class="section">
      <h1>Motoristas</h1>
      <p>Gerencie aprovações, bloqueios e documentos.</p>

      <section class="panel">
        <div class="panel-head">
          <strong>Motoristas cadastrados</strong>
          <button onclick="loadDrivers()">Atualizar</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody id="driversTable">
            <tr><td colspan="4">Carregando...</td></tr>
          </tbody>
        </table>
      </section>
    </section>

    <section id="rides" class="section">
      <h1>Corridas</h1>
      <p>Corridas realtime AVUXO.</p>

      <div class="panel">
        <div class="panel-head">
          <strong>Corrida atual</strong>
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

          <tbody id="ridesTable">
            <tr><td colspan="8">Carregando...</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="finance" class="section">
      <h1>Financeiro</h1>
      <p>Carteira, receitas e taxas AVUXO.</p>

      <div class="cards">
        <div class="card"><small>Receita hoje</small><strong id="financeTodayRevenue">R$ 0</strong></div>
        <div class="card"><small>Receita mês</small><strong id="financeMonthRevenue">R$ 0</strong></div>
        <div class="card"><small>Taxas</small><strong>R$ 0</strong></div>
        <div class="card"><small>Mensalidades pendentes</small><strong>0</strong></div>
      </div>
    </section>

    <section id="system" class="section">
      <h1>Sistema</h1>
      <p>Infraestrutura online.</p>

      <div class="premium-box">
        <h2>AVUXO Backend</h2>
        <p>Status: online</p>
        <p>API: /admin/drivers funcionando</p>
        <p>API: /ride/current funcionando</p>
        <p>API: /ride/history funcionando</p>
        <p>Painel: /admin funcionando</p>
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
      </div>
    </div>

    <div class="docs-grid" id="docsGrid"></div>

    <div style="margin-top:30px;display:flex;gap:12px;flex-wrap:wrap;">
      <button onclick="approveDriver()">Aprovar</button>
      <button class="warn-btn" onclick="blockDriver()">Bloquear</button>
      <button class="danger-btn" onclick="rejectDriver()">Rejeitar</button>
    </div>
  </div>
</div>

<div class="zoom-modal" id="zoomModal" onclick="closeZoom()">
  <img id="zoomedImage" src="" />
</div>

<script>
let currentDriverId = null;
window.driversCache = [];

const adminToken = localStorage.getItem('avuxo_admin_token');

if (!adminToken) {
  window.location.href = '/login';
}

const socket = io();

socket.emit('admin:join');

socket.on('server:ready', function(data) {
  console.log('SERVER READY', data);
  loadCurrentRide();
  loadRideStats();
});

socket.on('admin:state', function(data) {
  if (data.currentRide) {
    renderRide(data.currentRide);
    updateActiveRideCard(data.currentRide);
  } else {
    renderRide(null);
    updateActiveRideCard(null);
  }

  loadRideStats();
});

socket.on('ride:update', function(data) {
  if (data.ride) {
    renderRide(data.ride);
    updateActiveRideCard(data.ride);
  } else {
    renderRide(null);
    updateActiveRideCard(null);
  }

  loadRideStats();
});

function money(value) {
  return 'R$ ' + Number(value || 0).toFixed(2).replace('.', ',');
}

function updateActiveRideCard(ride) {
  const active = document.getElementById('activeRidesCount');

  if (!active) return;

  if (!ride) {
    active.textContent = '0';
    return;
  }

  active.textContent =
    ride.status !== 'finished' && ride.status !== 'cancelled'
      ? '1'
      : '0';
}

async function loadRideStats() {
  try {
    const response = await fetch('/ride/history');
    const data = await response.json();
    const rides = data.rides || [];

    const now = new Date();

    const today = rides.filter(function(ride) {
      const date = new Date(ride.finishedAt || ride.cancelledAt || ride.createdAt);
      return date.toDateString() === now.toDateString();
    });

    const month = rides.filter(function(ride) {
      const date = new Date(ride.finishedAt || ride.cancelledAt || ride.createdAt);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });

    const todayRevenue = today.reduce(function(total, ride) {
      if (ride.status === 'cancelled') return total;
      return total + Number(ride.total || ride.price || 0);
    }, 0);

    const monthRevenue = month.reduce(function(total, ride) {
      if (ride.status === 'cancelled') return total;
      return total + Number(ride.total || ride.price || 0);
    }, 0);

    document.getElementById('todayRidesCount').textContent = today.length;
    document.getElementById('todayRevenue').textContent = money(todayRevenue);
    document.getElementById('monthRevenue').textContent = money(monthRevenue);

    document.getElementById('financeTodayRevenue').textContent = money(todayRevenue);
    document.getElementById('financeMonthRevenue').textContent = money(monthRevenue);

    document.getElementById('operationalSummary').textContent =
      'Backend online • Corridas hoje: ' + today.length +
      ' • Receita hoje: ' + money(todayRevenue) +
      ' • Última atualização: ' + new Date().toLocaleTimeString('pt-BR');

  } catch (error) {
    console.error('Erro ao carregar estatísticas de corridas', error);
  }
}

function renderRide(ride) {
  const tbody = document.getElementById('ridesTable');

  if (!tbody) return;

  if (!ride) {
    tbody.innerHTML =
      '<tr>' +
        '<td colspan="8">Nenhuma corrida ativa.</td>' +
      '</tr>';
    return;
  }

  tbody.innerHTML =
    '<tr>' +
      '<td>' + (ride.passenger?.fullName || ride.passenger?.name || 'Passageiro') + '</td>' +
      '<td>' + (ride.rideType || '-') + '</td>' +
      '<td>' + (ride.originName || '-') + '</td>' +
      '<td>' + (ride.destinationName || '-') + '</td>' +
      '<td>' + (ride.distanceText || '-') + '</td>' +
      '<td>' + (ride.eta || '-') + '</td>' +
      '<td>' + money(ride.total || ride.price || 0) + '</td>' +
      '<td><span class="badge">' + (ride.status || 'pending') + '</span></td>' +
    '</tr>' +
    '<tr>' +
      '<td colspan="8">' +
        '<b>Motorista:</b> ' + (ride.driver?.fullName || ride.driver?.name || 'Aguardando motorista') +
        ' | <b>Telefone:</b> ' + (ride.driver?.phone || '-') +
        ' | <b>Placa:</b> ' + (ride.driver?.carPlate || ride.driver?.plate || '-') +
        ' | <b>Pagamento:</b> ' + (ride.paymentMethod || 'PIX') +
        '<br><br>' +
        '<button onclick="rideAction(\\'/ride/accept\\')">Aceitar</button> ' +
        '<button onclick="rideAction(\\'/ride/arrived\\')">Chegando</button> ' +
        '<button onclick="rideAction(\\'/ride/start\\')">Iniciar</button> ' +
        '<button onclick="rideAction(\\'/ride/finish\\')">Finalizar</button> ' +
        '<button class="danger-btn" onclick="rideAction(\\'/ride/cancel\\')">Cancelar</button>' +
      '</td>' +
    '</tr>';
}

async function rideAction(endpoint) {
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reason: 'Ação feita pelo painel admin',
        cancelledBy: 'admin',
      }),
    });

    loadCurrentRide();
    loadRideStats();
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

  if (sectionId === 'drivers' || sectionId === 'dashboard') {
    loadDrivers();
  }

  if (sectionId === 'rides' || sectionId === 'dashboard' || sectionId === 'finance') {
    loadCurrentRide();
    loadRideStats();
  }
}

async function loadDrivers() {
  const tbody = document.getElementById('driversTable');

  tbody.innerHTML = '<tr><td colspan="4">Atualizando...</td></tr>';

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
      tbody.innerHTML = '<tr><td colspan="4">Erro ao carregar motoristas.</td></tr>';
      return;
    }

    const drivers = data.drivers || [];

    window.driversCache = drivers;

    document.getElementById('driversCount').textContent = drivers.length;
    document.getElementById('pendingCount').textContent = drivers.filter(function(d) {
      return (d.status || 'pending') === 'pending';
    }).length;
    document.getElementById('approvedCount').textContent = drivers.filter(function(d) {
      return d.status === 'approved';
    }).length;
    document.getElementById('blockedCount').textContent = drivers.filter(function(d) {
      return d.status === 'blocked';
    }).length;

    if (!drivers.length) {
      tbody.innerHTML = '<tr><td colspan="4">Nenhum motorista.</td></tr>';
      return;
    }

    tbody.innerHTML = drivers.map(function(driver, index) {
      return (
        '<tr>' +
          '<td>' + (driver.fullName || '-') + '</td>' +
          '<td>' + (driver.phone || '-') + '</td>' +
          '<td><span class="badge">' + (driver.status || 'pending') + '</span></td>' +
          '<td><button onclick="openModal(window.driversCache[' + index + '])">Revisar</button></td>' +
        '</tr>'
      );
    }).join('');
  } catch (error) {
    console.error(error);
    tbody.innerHTML = '<tr><td colspan="4">Falha ao atualizar motoristas.</td></tr>';
  }
}

function createDocCard(title, image, pdf) {
  return (
    '<div class="doc-card">' +
      (
        image
          ? '<img src="' + image + '" onclick="openZoom(\\'' + image + '\\')" />'
          : '<div class="empty-doc">Sem imagem</div>'
      ) +
      '<div class="doc-info">' +
        '<div class="doc-title">' + title + '</div>' +
        (
          pdf
            ? '<button class="pdf-btn" onclick="window.open(\\'' + pdf + '\\', \\'_blank\\')">Abrir PDF</button>'
            : ''
        ) +
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

  document.getElementById('docsGrid').innerHTML =
    createDocCard('Selfie', driver.driverPhoto) +
    createDocCard('CNH Frente', driver.cnhFrontPhoto || driver.cnhFront) +
    createDocCard('CNH Verso', driver.cnhBackPhoto || driver.cnhBack) +
    createDocCard('Documento', driver.documentPhoto) +
    createDocCard('Carro Frente', driver.vehiclePhoto) +
    createDocCard('Carro Lateral', driver.vehicleSidePhoto) +
    createDocCard('Carro Traseira', driver.vehicleBackPhoto) +
    createDocCard('Documento Veículo', driver.vehicleDocumentPhoto, driver.vehicleDocumentPdf);
}

function closeModal() {
  document.getElementById('driverModal').style.display = 'none';
}

function openZoom(src) {
  if (!src) return;
  document.getElementById('zoomedImage').src = src;
  document.getElementById('zoomModal').style.display = 'flex';
}

function closeZoom() {
  document.getElementById('zoomModal').style.display = 'none';
  document.getElementById('zoomedImage').src = '';
}

async function approveDriver() {
  if (!currentDriverId) return;

  try {
    const response = await fetch('/admin/drivers/' + currentDriverId + '/approve', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + adminToken },
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || 'Erro ao aprovar motorista.');
      return;
    }

    closeModal();
    await loadDrivers();
  } catch (error) {
    console.error(error);
    alert('Erro ao aprovar motorista.');
  }
}

async function blockDriver() {
  if (!currentDriverId) return;

  try {
    const response = await fetch('/admin/drivers/' + currentDriverId + '/block', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + adminToken,
      },
      body: JSON.stringify({ reason: 'Bloqueado pelo admin' }),
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || 'Erro ao bloquear motorista.');
      return;
    }

    closeModal();
    await loadDrivers();
  } catch (error) {
    console.error(error);
    alert('Erro ao bloquear motorista.');
  }
}

async function rejectDriver() {
  if (!currentDriverId) return;

  try {
    const response = await fetch('/admin/drivers/' + currentDriverId + '/reject', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + adminToken },
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || 'Erro ao rejeitar motorista.');
      return;
    }

    closeModal();
    await loadDrivers();
  } catch (error) {
    console.error(error);
    alert('Erro ao rejeitar motorista.');
  }
}

async function loadCurrentRide() {
  const tbody = document.getElementById('ridesTable');

  try {
    const response = await fetch('/ride/current');
    const data = await response.json();
    const ride = data.ride;

    if (!ride) {
      renderRide(null);
      updateActiveRideCard(null);
      return;
    }

    renderRide(ride);
    updateActiveRideCard(ride);
  } catch (error) {
    tbody.innerHTML =
      '<tr>' +
        '<td colspan="8">Erro ao carregar corrida.</td>' +
      '</tr>';
  }
}

function logoutAdmin() {
  localStorage.removeItem('avuxo_admin_token');
  window.location.href = '/login';
}

loadDrivers();
loadCurrentRide();
loadRideStats();

setInterval(function() {
  loadCurrentRide();
  loadRideStats();
}, 3000);
</script>

</body>
</html>
    `);
  });
}