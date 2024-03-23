export interface ICreateOrderRequest {
  transactionId?: string;
  sum: number;
  rewardPointsUsed: number;
  promoCodeId?: number;
  carWashId: number;
  bayNumber: number;
}
