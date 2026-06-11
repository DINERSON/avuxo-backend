import {
  Ride,
  SavedAddress,
  WalletTransaction,
  DriverAccount,
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

  walletBalance: 0,

  walletHistory: [] as WalletTransaction[],

  driversDatabase: [] as DriverAccount[],

  driverWallets: {} as Record<string, any>,

  walletTransactions: [] as any[],

  rideReviews: [] as any[],

  driverReviews: [] as any[],
};