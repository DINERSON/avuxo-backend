import { Express } from 'express';
import { memoryStore } from '../storage/memory.store';

const AVUXO_FEE_PER_RIDE = 0.5;

function ensureStore() {
  const store = memoryStore as any;

  store.passengerWallets = store.passengerWallets || {};
  store.driverWallets = store.driverWallets || {};
  store.walletTransactions = store.walletTransactions || [];

  return store;
}

function now() {
  return new Date().toISOString();
}

function createPassengerWallet(passengerId: string) {
  const store = ensureStore();

  if (!store.passengerWallets[passengerId]) {
    store.passengerWallets[passengerId] = {
      passengerId,
      balance: 0,
      transactions: [],
      createdAt: now(),
      updatedAt: now(),
    };
  }

  return store.passengerWallets[passengerId];
}

function createDriverWallet(driverId: string) {
  const store = ensureStore();

  if (!store.driverWallets[driverId]) {
    store.driverWallets[driverId] = {
      driverId,
      balance: 0,
      availableBalance: 0,
      totalEarnings: 0,
      totalFees: 0,
      transactions: [],
      createdAt: now(),
      updatedAt: now(),
    };
  }

  return store.driverWallets[driverId];
}

export function registerWalletRoutes(app: Express) {
  app.get('/passenger/wallet/:passengerId', (req, res) => {
    const wallet = createPassengerWallet(
      String(req.params.passengerId),
    );

    return res.json({
      success: true,
      wallet,
    });
  });

  app.post('/passenger/wallet/:passengerId/add-balance', (req, res) => {
    const store = ensureStore();

    const passengerId = String(req.params.passengerId);
    const amount = Number(req.body.amount || 0);

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valor inválido.',
      });
    }

    const wallet = createPassengerWallet(passengerId);

    wallet.balance += amount;
    wallet.updatedAt = now();

    const transaction = {
      id: Date.now(),
      userId: passengerId,
      userType: 'passenger',
      type: 'credit',
      title: 'Recarga de saldo',
      amount,
      description: 'Saldo adicionado na carteira',
      createdAt: now(),
    };

    wallet.transactions.unshift(transaction);
    store.walletTransactions.unshift(transaction);

    return res.json({
      success: true,
      wallet,
      transaction,
    });
  });

  app.post('/passenger/wallet/:passengerId/debit', (req, res) => {
    const store = ensureStore();

    const passengerId = String(req.params.passengerId);
    const amount = Number(req.body.amount || 0);
    const rideId = String(req.body.rideId || '');

    const wallet = createPassengerWallet(passengerId);

    if (wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Saldo insuficiente.',
      });
    }

    wallet.balance -= amount;
    wallet.updatedAt = now();

    const transaction = {
      id: Date.now(),
      userId: passengerId,
      userType: 'passenger',
      type: 'ride_payment',
      title: 'Pagamento de corrida',
      amount: -amount,
      description: 'Pagamento realizado com saldo',
      rideId,
      createdAt: now(),
    };

    wallet.transactions.unshift(transaction);
    store.walletTransactions.unshift(transaction);

    return res.json({
      success: true,
      wallet,
      transaction,
    });
  });

  app.get('/driver/wallet/:driverId', (req, res) => {
    const wallet = createDriverWallet(
      String(req.params.driverId),
    );

    return res.json({
      success: true,
      wallet,
    });
  });

  app.post('/driver/wallet/:driverId/add-balance', (req, res) => {
    const store = ensureStore();

    const driverId = String(req.params.driverId);
    const amount = Number(req.body.amount || 0);

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valor inválido.',
      });
    }

    const wallet = createDriverWallet(driverId);

    wallet.balance += amount;
    wallet.availableBalance += amount;
    wallet.updatedAt = now();

    const transaction = {
      id: Date.now(),
      userId: driverId,
      userType: 'driver',
      type: 'payment',
      title: 'Recarga motorista',
      amount,
      description: 'Saldo adicionado pelo motorista',
      createdAt: now(),
    };

    wallet.transactions.unshift(transaction);
    store.walletTransactions.unshift(transaction);

    return res.json({
      success: true,
      wallet,
      transaction,
    });
  });

  app.get('/wallet/transactions/:userId', (req, res) => {
    const userId = String(req.params.userId);

    const transactions = (memoryStore.walletTransactions || []).filter(
      (item: any) => String(item.userId) === userId,
    );

    return res.json({
      success: true,
      transactions,
    });
  });
}

export {
  createPassengerWallet,
  createDriverWallet,
  AVUXO_FEE_PER_RIDE,
};