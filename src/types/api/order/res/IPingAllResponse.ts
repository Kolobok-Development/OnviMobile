export interface IBayStatus {
  bayNumber: number;
  status: 'Free' | 'Busy' | 'Unavailable';
  type?: string;
  errorMessage?: string;
}

export interface IPingAllResponse {
  carWashId: number;
  bayType: string;
  bayStatuses: IBayStatus[];
  timestamp: string;
}
