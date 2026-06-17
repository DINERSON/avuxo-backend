import { Express } from 'express';
import { memoryStore } from '../storage/memory.store';

type RaffleCode = {
  id: string;
  code: string;
  city: string;
  title: string;
  prize: string;
  active: boolean;
  createdAt: string;
};

type RaffleEntry = {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  email: string;
  city: string;
  code: string;
  createdAt: string;
};

function now() {
  return new Date().toISOString();
}

function normalize(value: any) {
  return String(value || '').trim();
}

function normalizeCode(value: any) {
  return normalize(value).toUpperCase().replace(/\s+/g, '');
}

function normalizeCity(value: any) {
  return normalize(value).toLowerCase().replace(/\s+/g, '_');
}

function ensureRaffleStore() {
  const store = memoryStore as any;

  store.raffleEntries = store.raffleEntries || [];
  store.raffleWinners = store.raffleWinners || [];
  store.raffleCodes = store.raffleCodes || [];

  if (!store.raffleCodes.length) {
    store.raffleCodes.push({
      id: `code-${Date.now()}`,
      code: 'AVUXOPB',
      city: 'pimenta_bueno',
      title: 'Sorteio AVUXO Pimenta Bueno',
      prize: '20 caixas de cerveja',
      active: true,
      createdAt: now(),
    });
  }

  return store;
}

export function registerRaffleAdminRoutes(app: Express) {
  ensureRaffleStore();

  app.get('/raffle-admin', (_req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AVUXO Sorteios</title>
<style>
*{box-sizing:border-box}
body{margin:0;min-height:100vh;background:radial-gradient(circle at top left,rgba(36,248,119,.14),transparent 32%),#050609;color:white;font-family:Arial,sans-serif}
main{padding:34px;max-width:1400px;margin:0 auto}
.logo{color:#24F877;font-size:34px;font-weight:900;letter-spacing:4px}
.sub{margin-top:6px;color:#8c96a8;font-size:12px;letter-spacing:3px}
.top{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:30px}
a,button{border:0;padding:13px 16px;border-radius:16px;background:rgba(255,255,255,.06);color:white;text-decoration:none;font-weight:800;cursor:pointer}
button.primary{background:#24F877;color:#050609}
button.danger{background:rgba(255,77,77,.12);color:#ff5f5f}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:24px}
.card,.panel{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);box-shadow:0 20px 60px rgba(0,0,0,.22)}
.card{border-radius:24px;padding:22px}
.card small{color:#8c96a8}
.card strong{display:block;margin-top:12px;font-size:30px}
.panel{border-radius:28px;overflow:hidden;margin-top:24px}
.panel-head{padding:20px 24px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center;gap:12px}
.panel-body{padding:22px}
.form-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
input{width:100%;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:13px 14px;background:rgba(255,255,255,.05);color:white;outline:none}
input::placeholder{color:#8c96a8}
.table-wrap{overflow:auto}
table{width:100%;min-width:980px;border-collapse:collapse}
th,td{padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.06);text-align:left;vertical-align:top}
th{color:#8c96a8;font-size:12px;text-transform:uppercase}
.badge{display:inline-block;padding:8px 12px;border-radius:999px;background:rgba(36,248,119,.12);color:#24F877;font-size:12px;font-weight:900}
.badge.off{background:rgba(255,77,77,.12);color:#ff5f5f}
.notice{color:#8c96a8;line-height:1.6}
@media(max-width:900px){main{padding:22px}.top{display:grid}.cards{grid-template-columns:repeat(2,1fr)}.form-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<main>
  <div class="top">
    <div>
      <div class="logo">AVUXO</div>
      <div class="sub">SORTEIOS E PROMOÇÕES</div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <a href="/admin">Voltar ao Admin</a>
      <button onclick="loadAll()">Atualizar</button>
    </div>
  </div>

  <div class="cards">
    <div class="card"><small>Participantes</small><strong id="entriesCount">0</strong></div>
    <div class="card"><small>Códigos ativos</small><strong id="activeCodesCount">0</strong></div>
    <div class="card"><small>Vencedores</small><strong id="winnersCount">0</strong></div>
    <div class="card"><small>Último vencedor</small><strong id="lastWinner">-</strong></div>
  </div>

  <section class="panel">
    <div class="panel-head"><strong>Criar código manual</strong></div>
    <div class="panel-body">
      <div class="form-grid">
        <input id="newCode" placeholder="Código: AVUXOPB" />
        <input id="newCity" placeholder="Cidade: pimenta_bueno" />
        <input id="newTitle" placeholder="Título do sorteio" />
        <input id="newPrize" placeholder="Prêmio" />
        <button class="primary" onclick="createCode()">Criar Código</button>
      </div>
      <p class="notice">Use cidade sem acento e com underline. Exemplo: <b>pimenta_bueno</b>.</p>
    </div>
  </section>

  <section class="panel">
    <div class="panel-head">
      <strong>Códigos cadastrados</strong>
      <button onclick="loadCodes()">Atualizar códigos</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Código</th><th>Cidade</th><th>Título</th><th>Prêmio</th><th>Status</th><th>Criado em</th><th>Ação</th>
          </tr>
        </thead>
        <tbody id="codesTable"><tr><td colspan="7">Carregando...</td></tr></tbody>
      </table>
    </div>
  </section>

  <section class="panel">
    <div class="panel-head"><strong>Sortear vencedor</strong></div>
    <div class="panel-body">
      <div class="form-grid">
        <input id="drawCode" placeholder="Código do sorteio" />
        <input id="drawCity" placeholder="Cidade" />
        <button class="primary" onclick="drawWinner()">Sortear</button>
      </div>
      <p class="notice">Informe pelo menos o código. Cidade é recomendado.</p>
      <div id="winnerBox" class="notice"></div>
    </div>
  </section>

  <section class="panel">
    <div class="panel-head">
      <strong>Participantes</strong>
      <button onclick="loadEntries()">Atualizar participantes</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Usuário</th><th>Telefone</th><th>Email</th><th>Cidade</th><th>Código</th><th>Data</th>
          </tr>
        </thead>
        <tbody id="entriesTable"><tr><td colspan="6">Carregando...</td></tr></tbody>
      </table>
    </div>
  </section>

  <section class="panel">
    <div class="panel-head">
      <strong>Histórico de vencedores</strong>
      <button onclick="loadWinners()">Atualizar vencedores</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Vencedor</th><th>Telefone</th><th>Cidade</th><th>Código</th><th>Sorteado em</th>
          </tr>
        </thead>
        <tbody id="winnersTable"><tr><td colspan="5">Carregando...</td></tr></tbody>
      </table>
    </div>
  </section>
</main>

<script>
function safe(value,fallback){return String(value||fallback||'-')}
function dateBR(value){try{return value?new Date(value).toLocaleString('pt-BR'):'-'}catch(e){return '-'}}
async function jsonFetch(url,options){const response=await fetch(url,options||{});return await response.json()}

async function loadCodes(){
  const tbody=document.getElementById('codesTable');
  try{
    const data=await jsonFetch('/raffle-admin/codes');
    const codes=data.codes||[];
    document.getElementById('activeCodesCount').textContent=codes.filter(i=>i.active).length;
    if(!codes.length){tbody.innerHTML='<tr><td colspan="7">Nenhum código cadastrado.</td></tr>';return}
    tbody.innerHTML=codes.map(item=>(
      '<tr>'+
      '<td><b>'+safe(item.code)+'</b></td>'+
      '<td>'+safe(item.city)+'</td>'+
      '<td>'+safe(item.title)+'</td>'+
      '<td>'+safe(item.prize)+'</td>'+
      '<td><span class="badge '+(item.active?'':'off')+'">'+(item.active?'ATIVO':'INATIVO')+'</span></td>'+
      '<td>'+dateBR(item.createdAt)+'</td>'+
      '<td>'+(item.active?'<button class="danger" onclick="disableCode(\\''+item.id+'\\')">Desativar</button>':'-')+'</td>'+
      '</tr>'
    )).join('');
  }catch(error){console.error(error);tbody.innerHTML='<tr><td colspan="7">Erro ao carregar códigos.</td></tr>'}
}

async function createCode(){
  const body={
    code:document.getElementById('newCode').value,
    city:document.getElementById('newCity').value,
    title:document.getElementById('newTitle').value,
    prize:document.getElementById('newPrize').value
  };
  const data=await jsonFetch('/raffle-admin/codes/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!data.success){alert(data.message||'Erro ao criar código.');return}
  document.getElementById('newCode').value='';
  document.getElementById('newCity').value='';
  document.getElementById('newTitle').value='';
  document.getElementById('newPrize').value='';
  alert('Código criado com sucesso.');
  loadCodes();
}

async function disableCode(id){
  if(!confirm('Desativar este código?'))return;
  const data=await jsonFetch('/raffle-admin/codes/'+id+'/disable',{method:'POST'});
  if(!data.success){alert(data.message||'Erro ao desativar código.');return}
  loadCodes();
}

async function loadEntries(){
  const tbody=document.getElementById('entriesTable');
  try{
    const data=await jsonFetch('/raffle-admin/entries');
    const entries=data.entries||[];
    document.getElementById('entriesCount').textContent=entries.length;
    if(!entries.length){tbody.innerHTML='<tr><td colspan="6">Nenhum participante.</td></tr>';return}
    tbody.innerHTML=entries.map(item=>(
      '<tr>'+
      '<td><b>'+safe(item.userName||item.userId)+'</b><br><small>'+safe(item.userId)+'</small></td>'+
      '<td>'+safe(item.phone)+'</td>'+
      '<td>'+safe(item.email)+'</td>'+
      '<td>'+safe(item.city)+'</td>'+
      '<td><b>'+safe(item.code)+'</b></td>'+
      '<td>'+dateBR(item.createdAt)+'</td>'+
      '</tr>'
    )).join('');
  }catch(error){console.error(error);tbody.innerHTML='<tr><td colspan="6">Erro ao carregar participantes.</td></tr>'}
}

async function drawWinner(){
  const code=document.getElementById('drawCode').value;
  const city=document.getElementById('drawCity').value;
  if(!code){alert('Informe o código do sorteio.');return}
  if(!confirm('Confirmar sorteio agora?'))return;
  const data=await jsonFetch('/raffle-admin/draw',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,city})});
  if(!data.success){alert(data.message||'Erro ao sortear.');return}
  const winner=data.winner;
  document.getElementById('winnerBox').innerHTML=
    '<h2>🎉 Vencedor: '+safe(winner.userName||winner.userId)+'</h2>'+
    '<p>Telefone: '+safe(winner.phone)+'</p>'+
    '<p>Cidade: '+safe(winner.city)+'</p>'+
    '<p>Código: '+safe(winner.code)+'</p>';
  alert('Sorteio realizado.');
  loadWinners();
}

async function loadWinners(){
  const tbody=document.getElementById('winnersTable');
  try{
    const data=await jsonFetch('/raffle-admin/winners');
    const winners=data.winners||[];
    document.getElementById('winnersCount').textContent=winners.length;
    if(!winners.length){document.getElementById('lastWinner').textContent='-';tbody.innerHTML='<tr><td colspan="5">Nenhum vencedor.</td></tr>';return}
    document.getElementById('lastWinner').textContent=winners[0].userName||winners[0].userId||'-';
    tbody.innerHTML=winners.map(item=>(
      '<tr>'+
      '<td><b>'+safe(item.userName||item.userId)+'</b></td>'+
      '<td>'+safe(item.phone)+'</td>'+
      '<td>'+safe(item.city)+'</td>'+
      '<td><b>'+safe(item.code)+'</b></td>'+
      '<td>'+dateBR(item.drawnAt)+'</td>'+
      '</tr>'
    )).join('');
  }catch(error){console.error(error);tbody.innerHTML='<tr><td colspan="5">Erro ao carregar vencedores.</td></tr>'}
}

async function loadAll(){await loadCodes();await loadEntries();await loadWinners()}
loadAll();
setInterval(loadEntries,15000);
</script>
</body>
</html>
    `);
  });

  app.get('/raffle-admin/entries', (_req, res) => {
    const store = ensureRaffleStore();

    res.json({
      success: true,
      total: store.raffleEntries.length,
      entries: store.raffleEntries,
    });
  });

  app.get('/raffle-admin/codes', (_req, res) => {
    const store = ensureRaffleStore();

    res.json({
      success: true,
      total: store.raffleCodes.length,
      codes: store.raffleCodes,
    });
  });

  app.post('/raffle-admin/codes/create', (req, res) => {
    const store = ensureRaffleStore();

    const code = normalizeCode(req.body.code);
    const city = normalizeCity(req.body.city || req.body.cityId);
    const title = normalize(req.body.title) || 'Sorteio AVUXO';
    const prize = normalize(req.body.prize) || 'Prêmio AVUXO';

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Informe o código do sorteio.',
      });
    }

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'Informe a cidade do sorteio.',
      });
    }

    const exists = store.raffleCodes.find(
      (item: RaffleCode) =>
        normalizeCode(item.code) === code &&
        normalizeCity(item.city) === city &&
        item.active,
    );

    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'Já existe um código ativo igual para esta cidade.',
      });
    }

    const raffleCode: RaffleCode = {
      id: `code-${Date.now()}-${Math.floor(Math.random() * 99999)}`,
      code,
      city,
      title,
      prize,
      active: true,
      createdAt: now(),
    };

    store.raffleCodes.unshift(raffleCode);

    return res.json({
      success: true,
      message: 'Código criado com sucesso.',
      code: raffleCode,
    });
  });

  app.post('/raffle-admin/codes/:id/disable', (req, res) => {
    const store = ensureRaffleStore();
    const { id } = req.params;

    const raffleCode = store.raffleCodes.find(
      (item: RaffleCode) => String(item.id) === String(id),
    );

    if (!raffleCode) {
      return res.status(404).json({
        success: false,
        message: 'Código não encontrado.',
      });
    }

    raffleCode.active = false;

    return res.json({
      success: true,
      message: 'Código desativado.',
      code: raffleCode,
    });
  });

  app.post('/raffle-admin/draw', (req, res) => {
    const store = ensureRaffleStore();

    const city = normalizeCity(req.body.city || req.body.cityId);
    const code = normalizeCode(req.body.code);

    let entries = store.raffleEntries as RaffleEntry[];

    if (city) {
      entries = entries.filter(
        (entry) => normalizeCity(entry.city) === city,
      );
    }

    if (code) {
      entries = entries.filter(
        (entry) => normalizeCode(entry.code) === code,
      );
    }

    if (!entries.length) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum participante encontrado para este sorteio.',
      });
    }

    const winner = entries[Math.floor(Math.random() * entries.length)];

    const winnerRecord = {
      ...winner,
      drawnAt: now(),
    };

    store.raffleWinners.unshift(winnerRecord);

    return res.json({
      success: true,
      message: 'Sorteio realizado com sucesso.',
      winner: winnerRecord,
    });
  });

  app.get('/raffle-admin/winners', (_req, res) => {
    const store = ensureRaffleStore();

    res.json({
      success: true,
      total: store.raffleWinners.length,
      winners: store.raffleWinners,
    });
  });
}