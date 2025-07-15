import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ChartConfig } from '../../models/report.model';
import * as Plotly from 'plotly.js-dist';
import { Data } from 'plotly.js';

@Component({
  selector: 'lib-chart-viewer',
  templateUrl: './chart-viewer.component.html',
  styleUrls: ['./chart-viewer.component.css']
})
export class ChartViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() config!: ChartConfig;
  @ViewChild('chartDiv', { static: true }) chartDiv!: ElementRef;

  private plotlyInstance: any;

  ngOnInit() {
    // Component initialization
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderChart();
    }, 100);
  }

  ngOnDestroy() {
    if (this.plotlyInstance) {
      Plotly.purge(this.chartDiv.nativeElement);
    }
  }

  private renderChart() {
    if (!this.config || !this.chartDiv) return;

    const layout = {
      ...this.config.options?.layout,
      responsive: true,
      autosize: true,
      font: {
        family: 'Inter, sans-serif'
      }
    };

    const config = {
      ...this.config.options?.config,
      displayModeBar: true,
      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
      displaylogo: false,
      responsive: true
    };

    this.plotlyInstance = Plotly.newPlot(
      this.chartDiv.nativeElement,
      this.config.data,
      layout,
      config
    );
  }

  downloadChart() {
    if (this.plotlyInstance && this.config) {
      Plotly.downloadImage(this.chartDiv.nativeElement, {
        format: 'png',
        width: 800,
        height: 600,
        filename: this.config.id
      });
    }
  }

  getTableConfig() {
    if (!this.config?.data) return null;

    const columns = [
      { key: 'series', label: 'Series', type: 'text' as const },
      { key: 'x', label: 'X', type: 'text' as const },
      { key: 'y', label: 'Y', type: 'number' as const }
    ];

    const data: any[] = [];
    this.config.data.forEach((series: Data) => {
      if (this.hasXYData(series)) {
        for (let i = 0; i < series.x.length; i++) {
          data.push({
            series: series.name || 'Series',
            x: series.x[i],
            y: series.y[i]
          });
        }
      }
    });

    return {
      id: `${this.config.id}-table`,
      title: `${this.config.title} - Data`,
      data,
      columns,
      showPagination: true,
      pageSize: 10
    };
  }

  private hasXYData(series: Data): series is { x: any[]; y: any[]; name?: string } {
    return series && Array.isArray((series as any).x) && Array.isArray((series as any).y);
  }
}