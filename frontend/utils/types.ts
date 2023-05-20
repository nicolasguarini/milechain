export interface Vehicle {
  licensePlate: string;
  mileage: number;
  owner: string;
}

export interface MileageRecord {
  mileage: number;
  timestamp: number;
}

export interface OwnersRecord {
  owner: string;
  timestamp: number;
}

export type Record = MileageRecord | OwnersRecord;
