export type DriverStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'blocked';

export interface Driver {
  id: string;

  fullName: string;
  email: string;
  phone: string;

  cpf: string;
  cnh: string;

  carBrand: string;
  carModel: string;
  carPlate: string;
  carColor: string;
  carYear: string;
  carSeats: number;

  renavam?: string;

  profilePhoto?: string;

  driverPhoto?: string;
  documentPhoto?: string;
  licensePhoto?: string;
  licenseBackPhoto?: string;
  vehiclePhoto?: string;

  frontPhoto?: string;
  backPhoto?: string;
  sidePhotoLeft?: string;
  sidePhotoRight?: string;

  licensePdf?: string;
  carDocumentPdf?: string;

  otpVerified: boolean;

  status: DriverStatus;

  approved?: boolean;

  blocked?: boolean;

  blockedReason?: string;

  walletDebt?: number;

  online: boolean;

  createdAt: Date;
}

export const driversDatabase: Driver[] = [];