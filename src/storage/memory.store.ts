import {
  Ride,
  SavedAddress,
  WalletTransaction,
  DriverAccount,
  PassengerWallet,
  DriverWallet,
} from '../types/app.types';

export const memoryStore = {
  currentRide: null as Ride | null,

  activeRides: {} as Record<string, Ride>,
  availableRides: [] as Ride[],

  currentDriver: null as DriverAccount | null,
  driverOnline: false,

  rideHistory: [] as Ride[],
  ridesDatabase: [] as Ride[],

  savedAddresses: [] as SavedAddress[],

  driversDatabase: [] as DriverAccount[],

  onlineDrivers: {} as Record<string, boolean>,
  driverSockets: {} as Record<string, string>,

  passengerWallets: {} as Record<string, PassengerWallet>,
  driverWallets: {} as Record<string, DriverWallet>,
  walletTransactions: [] as WalletTransaction[],

  rideReviews: [] as any[],
  driverReviews: [] as any[],

  chatByRide: {} as Record<string, any[]>,

  raffleEntries: [] as any[],
  raffleWinners: [] as any[],
};