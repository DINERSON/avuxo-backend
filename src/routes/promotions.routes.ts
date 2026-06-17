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

export function registerPromotionsRoutes(app: Express) {
  ensureRaffleStore();

  app.get('/promotions', (_req, res) => {
    res.json({
      success: true,
      type: 'raffle',
      title: 'Sorteio Diário AVUXO',
      message: 'Digite o código divulgado e participe do sorteio.',
    });
  });

  app.get('/promotions/raffle/codes', (_req, res) => {
    const store = ensureRaffleStore();

    res.json({
      success: true,
      codes: store.raffleCodes.filter((item: RaffleCode) => item.active),
    });
  });

  app.post('/promotions/raffle/enter', (req, res) => {
    const store = ensureRaffleStore();

    const userId = normalize(req.body.userId || req.body.uid);
    const userName = normalize(req.body.userName || req.body.name);
    const phone = normalize(req.body.phone || req.body.userPhone);
    const email = normalize(req.body.email || req.body.userEmail);
    const city = normalizeCity(req.body.city || req.body.cityId);
    const code = normalizeCode(req.body.code);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Usuário não informado.',
      });
    }

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'Cidade não informada.',
      });
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Código não informado.',
      });
    }

    const activeCode = store.raffleCodes.find(
      (item: RaffleCode) =>
        item.active &&
        normalizeCode(item.code) === code &&
        normalizeCity(item.city) === city,
    );

    if (!activeCode) {
      return res.status(400).json({
        success: false,
        message: 'Código inválido, expirado ou indisponível para esta cidade.',
      });
    }

    const alreadyByUser = store.raffleEntries.find(
      (entry: RaffleEntry) =>
        entry.userId === userId &&
        normalizeCode(entry.code) === code,
    );

    if (alreadyByUser) {
      return res.status(409).json({
        success: false,
        message: 'Você já participou deste sorteio.',
      });
    }

    if (phone) {
      const alreadyByPhone = store.raffleEntries.find(
        (entry: RaffleEntry) =>
          normalize(entry.phone) === phone &&
          normalizeCode(entry.code) === code,
      );

      if (alreadyByPhone) {
        return res.status(409).json({
          success: false,
          message: 'Este telefone já participou deste sorteio.',
        });
      }
    }

    if (email) {
      const alreadyByEmail = store.raffleEntries.find(
        (entry: RaffleEntry) =>
          normalize(entry.email).toLowerCase() === email.toLowerCase() &&
          normalizeCode(entry.code) === code,
      );

      if (alreadyByEmail) {
        return res.status(409).json({
          success: false,
          message: 'Este e-mail já participou deste sorteio.',
        });
      }
    }

    const entry: RaffleEntry = {
      id: `entry-${Date.now()}-${Math.floor(Math.random() * 99999)}`,
      userId,
      userName: userName || 'Usuário AVUXO',
      phone,
      email,
      city,
      code,
      createdAt: now(),
    };

    store.raffleEntries.unshift(entry);

    return res.json({
      success: true,
      message: 'Participação confirmada no sorteio AVUXO.',
      entry,
    });
  });

  app.get('/admin/raffle/entries', (_req, res) => {
    const store = ensureRaffleStore();

    res.json({
      success: true,
      total: store.raffleEntries.length,
      entries: store.raffleEntries,
    });
  });

  app.get('/admin/raffle/codes', (_req, res) => {
    const store = ensureRaffleStore();

    res.json({
      success: true,
      total: store.raffleCodes.length,
      codes: store.raffleCodes,
    });
  });

  app.post('/admin/raffle/codes/create', (req, res) => {
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

  app.post('/admin/raffle/codes/:id/disable', (req, res) => {
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

  app.post('/admin/raffle/draw', (req, res) => {
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

    const winner =
      entries[Math.floor(Math.random() * entries.length)];

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

  app.get('/admin/raffle/winners', (_req, res) => {
    const store = ensureRaffleStore();

    res.json({
      success: true,
      total: store.raffleWinners.length,
      winners: store.raffleWinners,
    });
  });
}