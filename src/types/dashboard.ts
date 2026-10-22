export type WidgetType = 'donut' | 'stacked-bar' | 'empty-graph' | 'custom-text';

export type TimeRange = 'Last 24 hours' | 'Last 2 days' | 'Last 7 days' | 'Last 30 days';

export interface WidgetMetric {
  label: string;
  value: number;
  color: string;
}

export interface Widget {
  id: string;
  name: string;
  type: WidgetType;
  text?: string;
  total?: number | string;
  totalLabel?: string;
  metrics?: WidgetMetric[];
  createdAt?: string;
  createdAtTimestamp?: number;
}

export interface Category {
  id: string;
  name: string;
  shortCode: string; // e.g. "CSPM", "CWPP", "Image", "Ticket"
  widgets: Widget[];
}

export interface DashboardData {
  categories: Category[];
}

export interface AvailableWidgetRegistry {
  [categoryId: string]: Widget[];
}
