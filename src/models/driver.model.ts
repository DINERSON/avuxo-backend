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

  carModel: string;
  carPlate: string;
  carColor: string;

  profilePhoto: string;
  cnhPhoto: string;
  carPhoto: string;

  otpVerified: boolean;

  status: DriverStatus;

  online: boolean;

  createdAt: Date;
}

export const driversDatabase: Driver[] = [];