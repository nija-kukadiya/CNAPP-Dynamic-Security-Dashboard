export type WidgetType = 'donut' | 'stacked-bar' | 'empty-graph' | 'custom-text';

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
