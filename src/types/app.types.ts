export type RideStatus =
  | 'pending'
  | 'accepted'
  | 'arriving'
  | 'in_progress'
  | 'finished'
  | 'declined'
  | 'cancelled';

export type ChatSender =
  | 'passenger'
  | 'driver'
  | 'system';

export interface ChatMessage {
  id: number;
  rideId?: string;
  sender: ChatSender;
  from: ChatSender;
  role: ChatSender;
  message: string;
  text: string;
  createdAt: string;
}

export interface RideReview {
  rating: number;
  comment: string;
  price: number;
  rideType: string;
  distanceText: string;
  eta: string;
  createdAt: string;
}

export interface Ride {
  id: string;
  rideId: string;

  originLat: number;
  originLng: number;

  destLat: number;
  destLng: number;

  destinationLabel: string;
  originName: string;
  destinationName: string;

  price: number;
  fare: number;
  total: number;

  distanceKm: number;
  distanceText: string;
  eta: string;

  rideType: string;

  passenger?: any;
  driver?: any;
  driverId?: string;

  status: RideStatus;

  paymentMethod?: string;
  platform?: string;

  createdAt: string;
  updatedAt: string;

  acceptedAt?: string;
  arrivedAt?: string;
  startedAt?: string;
  finishedAt?: string;

  chat: ChatMessage[];

  review?: RideReview;

  cancelledBy?: string;
  canceledBy?: string;
  cancelReason?: string;
  cancelledAt?: string;

  avuxoFee?: number;

  passengerPaidAmount?: number;
  driverEarningAmount?: number;
  driverWalletBalanceAfterFee?: number;

  walletTransaction?: any;
  walletTransactions?: WalletTransaction[];

  declinedDrivers?: string[];
}

export interface SavedAddress {
  id: number;

  type: 'home' | 'work' | 'favorite';

  label: string;
  address: string;

  lat: number;
  lng: number;

  createdAt: string;
}

export type WalletUserType =
  | 'passenger'
  | 'driver';

export type WalletTransactionType =
  | 'credit'
  | 'debit'
  | 'ride_payment'
  | 'ride_earning'
  | 'avuxo_fee'
  | 'payment';

export interface WalletTransaction {
  id: number | string;

  userId: string;
  userType: WalletUserType;

  type: WalletTransactionType;

  title: string;
  amount: number;

  description: string;

  rideId?: string | null;
  driverId?: string;
  passengerId?: string;

  createdAt: string;
}

export interface PassengerWallet {
  passengerId: string;
  balance: number;
  transactions: WalletTransaction[];
  createdAt: string;
  updatedAt: string;
}

export interface DriverWallet {
  driverId: string;
  driverName?: string;

  balance: number;
  availableBalance: number;

  totalEarnings: number;
  totalFees: number;

  transactions: WalletTransaction[];

  createdAt: string;
  updatedAt: string;
}

export type DriverStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'blocked';

export interface DriverAccount {
  id: string;

  fullName: string;
  email: string;
  phone: string;

  rating: number;
  totalRatings: number;

  carBrand: string;
  carModel: string;
  carPlate: string;
  carColor: string;
  carYear: string;
  carSeats: string;

  renavam: string;

  driverPhoto: string;
  vehiclePhoto: string;
  documentPhoto: string;

  licensePhoto?: string;

  cnhFront?: string;
  cnhBack?: string;

  cnhFrontPhoto?: string;
  cnhBackPhoto?: string;

  vehicleDocumentPhoto?: string;
  vehicleDocumentPdf?: string;

  vehicleSidePhoto?: string;
  vehicleBackPhoto?: string;

  rentedVehicle: boolean;

  status: DriverStatus;

  approved: boolean;
  online: boolean;
  blocked: boolean;

  blockedReason: string;

  walletBalance?: number;
  walletFees?: number;
  walletEarnings?: number;

  createdAt: string;
}