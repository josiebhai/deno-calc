export interface DenominationLine {
  value: number;
  qty: number;
  subtotal: number;
}

export interface CountRecord {
  orgName: string | null;
  serviceName: string | null;
  currencyCode: string;
  currencySymbol: string;
  denominations: DenominationLine[];
  total: number;
  createdAt: number; // epoch ms
  expiresAt: number; // epoch ms
}
