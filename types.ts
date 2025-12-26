export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: string;
  marketCap?: string;
}

export interface ChartDataPoint {
  time: string;
  value: number;
}

export enum SortOption {
  SYMBOL = 'SYMBOL',
  PRICE_ASC = 'PRICE_ASC',
  PRICE_DESC = 'PRICE_DESC',
  CHANGE_ASC = 'CHANGE_ASC',
  CHANGE_DESC = 'CHANGE_DESC'
}