export interface PropertyDetails {
  tenantName: string;
  propertyAddress: string;
  rentDueDate: string;
}

export interface RentEntry {
  id: string;
  datePaid: string;
  periodCovered: string;
  rentAmount: number;
  totalPaid: number;
  createdAt?: number;
}

export interface UtilityEntry {
  id: string;
  month: string;
  previousReading: number;
  presentReading: number;
  kwhUsed: number;
  costPerKwh: number;
  totalCost: number;
  amountPaid: number;
  createdAt?: number;
}

export interface BillEntry {
  id: string;
  billName: string;
  dueDate: string;
  amount: number;
  amountPaid: number;
  createdAt?: number;
}

export interface CustomLogData {
  id: string;
  title: string;
  entries: BillEntry[];
  createdAt?: number;
}
