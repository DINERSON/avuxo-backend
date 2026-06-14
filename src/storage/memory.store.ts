import {
  Ride,
  SavedAddress,
  WalletTransaction,
  DriverAccount,
} from '../types/app.types';

export const memoryStore = {
  // Fallback antigo. Não usar como principal em multicorridas.
  currentRide: null as Ride | null,

  // Fonte principal das corridas ativas.
  activeRides: {} as Record<string, Ride>,

  // Corridas pendentes disponíveis para motoristas online.
  availableRides: [] as Ride[],

  currentDriver: null as DriverAccount | null,
  driverOnline: false,

  rideHistory: [] as Ride[],
  ridesDatabase: [] as Ride[],

  savedAddresses: [] as SavedAddress[],

  walletBalance: 0,
  walletHistory: [] as WalletTransaction[],

  driversDatabase: [] as DriverAccount[],

  // Controle realtime de motoristas online.
  onlineDrivers: {} as Record<string, boolean>,
  driverSockets: {} as Record<string, string>,

  driverWallets: {} as Record<string, any>,
  walletTransactions: [] as any[],

  rideReviews: [] as any[],
  driverReviews: [] as any[],

  chatByRide: {} as Record<string, any[]>,
};