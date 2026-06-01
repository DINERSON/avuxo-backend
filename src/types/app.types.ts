export type RideStatus =
  | 'pending'
  | 'accepted'
  | 'arriving'
  | 'in_progress'
  | 'finished'
  | 'declined'
  | 'cancelled';

export type ChatSender = 'passenger' | 'driver';

export interface ChatMessage {
  id: number;
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
  id: number;
  rideId: number;

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

  status: RideStatus;

  createdAt: string;
  updatedAt: string;

  chat: ChatMessage[];

  review?: RideReview;

  cancelledBy?: string;
  canceledBy?: string;
  cancelReason?: string;

  cancelledAt?: string;
  finishedAt?: string;
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

export interface WalletTransaction {
  id: number;

  type: 'credit' | 'debit';

  title: string;
  amount: number;

  createdAt: string;
}

export type DriverStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'blocked';

export interface DriverAccount {
  id: number;

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

  createdAt: string;
}