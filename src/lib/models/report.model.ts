import { Data } from 'plotly.js';

export interface ReportConfig {
  title: string;
  subtitle?: string;
  author?: string;
  publishedDate?: string;
  description?: string;
  sections: ReportSection[];
  downloadEnabled?: boolean;
  theme?: 'light' | 'dark';
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  charts?: ChartConfig[];
  tables?: TableConfig[];
  order: number;
}

export interface TableConfig {
  id: string;
  title: string;
  data: any[];
  columns: TableColumn[];
  showPagination?: boolean;
  pageSize?: number;
}

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'percentage';
  sortable?: boolean;
  width?: string;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'choropleth';
  data: Data[];
  options?: PlotlyOptions;
  showDataTable?: boolean;
  downloadEnabled?: boolean;
  height?: number;
  width?: number;
}

export type ChartData = Data;

export interface PlotlyOptions {
  layout?: any;
  config?: any;
  style?: any;
}