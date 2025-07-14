import { Data } from 'plotly.js';

export interface ChartConfig {
    id: string;
    title: string;
    type: 'line' | 'bar' | 'pie' | 'scatter' | 'area';
    data: Data[];
    options?: PlotlyOptions;
    showDataTable?: boolean;
    downloadEnabled?: boolean;
    height?: number;
    width?: number;
  }
  
  // ChartData is now just an alias for Plotly's Data type
  export type ChartData = Data;
  
  export interface PlotlyOptions {
    layout?: any;
    config?: any;
    style?: any;
  }