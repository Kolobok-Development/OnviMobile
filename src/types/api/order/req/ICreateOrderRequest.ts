export interface ICreateOrderRequest {
  sum: number;
  rewardPointsUsed: number;
  promoCodeId?: number;
  carWashId: number;
  bayNumber: number;
  bayType?: string | null;
}
