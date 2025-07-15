import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReportConfig, ChartConfig, TableConfig, ReportSection } from '../models/report.model';
import { Data } from 'plotly.js';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportSubject = new BehaviorSubject<ReportConfig | null>(null);
  public report$ = this.reportSubject.asObservable();

  generateReport(config: ReportConfig): void {
    this.reportSubject.next(config);
  }

  updateChart(sectionId: string, chartId: string, chartConfig: ChartConfig): void {
    const currentReport = this.reportSubject.value;
    if (currentReport) {
      const section = currentReport.sections.find(s => s.id === sectionId);
      if (section && section.charts) {
        const chartIndex = section.charts.findIndex(c => c.id === chartId);
        if (chartIndex !== -1) {
          section.charts[chartIndex] = chartConfig;
          this.reportSubject.next({ ...currentReport });
        }
      }
    }
  }

  exportToHtml(config: ReportConfig): string {
    return this.generateHtmlReport(config);
  }

  private generateHtmlReport(config: ReportConfig): string {
    const styles = this.getReportStyles(config.theme || 'light');
    const header = this.generateHeader(config);
    const sections = config.sections
      .sort((a, b) => a.order - b.order)
      .map(section => this.generateSection(section))
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${config.title}</title>
          <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
          ${styles}
        </head>
        <body>
          <div class="report-container">
            ${header}
            ${sections}
          </div>
          <script>
            ${this.generateChartScripts(config)}
          </script>
        </body>
      </html>
    `;
  }

  private generateHeader(config: ReportConfig): string {
    return `
      <div class="report-header">
        <h1>${config.title}</h1>
        ${config.subtitle ? `<h2>${config.subtitle}</h2>` : ''}
        <div class="report-meta">
          ${config.author ? `<span>By: ${config.author}</span>` : ''}
          ${config.publishedDate ? `<span>Published: ${config.publishedDate}</span>` : ''}
          ${config.downloadEnabled ? '<button class="download-btn" onclick="window.print()">Download</button>' : ''}
        </div>
        ${config.description ? `<p class="report-description">${config.description}</p>` : ''}
      </div>
    `;
  }

  private generateSection(section: ReportSection): string {
    const charts = section.charts?.map(chart => this.generateChartHtml(chart)).join('') || '';
    const tables = section.tables?.map(table => this.generateTableHtml(table)).join('') || '';
    
    return `
      <div class="report-section" id="${section.id}">
        <h3>${section.title}</h3>
        <div class="section-content">${section.content}</div>
        ${charts}
        ${tables}
      </div>
    `;
  }

  private generateChartHtml(chart: ChartConfig): string {
    return `
      <div class="chart-container">
        <h4>${chart.title}</h4>
        <div id="${chart.id}" class="chart-plot" style="height: ${chart.height || 400}px;"></div>
        ${chart.showDataTable ? `<div id="${chart.id}-table" class="chart-data-table"></div>` : ''}
      </div>
    `;
  }

  private generateTableHtml(table: TableConfig): string {
    const headers = table.columns.map(col => `<th>${col.label}</th>`).join('');
    const rows = table.data.map(row => {
      const cells = table.columns.map(col => `<td>${row[col.key] || ''}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    return `
      <div class="table-container">
        <h4>${table.title}</h4>
        <table class="data-table">
          <thead><tr>${headers}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  private generateChartScripts(config: ReportConfig): string {
    let scripts = '';
    
    config.sections.forEach(section => {
      section.charts?.forEach(chart => {
        scripts += `
          Plotly.newPlot('${chart.id}', ${JSON.stringify(chart.data)}, ${JSON.stringify(chart.options?.layout || {})});
        `;
        
        if (chart.showDataTable) {
          scripts += `
            document.getElementById('${chart.id}-table').innerHTML = generateDataTable(${JSON.stringify(chart.data)});
          `;
        }
      });
    });

    scripts += `
      function generateDataTable(data) {
        if (!data || data.length === 0) return '<p>No data available</p>';
        
        let html = '<table class="chart-data-table"><thead><tr>';
        html += '<th>Series</th><th>X</th><th>Y</th></tr></thead><tbody>';
        
        data.forEach(series => {
          if (this.hasXYData(series)) {
            for (let i = 0; i < series.x.length; i++) {
              html += '<tr>';
              html += '<td>' + (series.name || 'N/A') + '</td>';
              html += '<td>' + series.x[i] + '</td>';
              html += '<td>' + series.y[i] + '</td>';
              html += '</tr>';
            }
          }
        });
        
        html += '</tbody></table>';
        return html;
      }
    `;

    return scripts;
  }

  private getReportStyles(theme: 'light' | 'dark'): string {
    return `
      <style>
        body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #334155; line-height: 1.6; margin: 0; padding: 20px; }
        .report-container { max-width: 1200px; margin: 0 auto; }
        .report-header { border-bottom: 2px solid #ddd; padding-bottom: 20px; margin-bottom: 30px; }
        .report-header h1 { color: #2c3e50; margin-bottom: 10px; font-size: 2.5em; }
        .report-header h2 { color: #34495e; margin-bottom: 15px; font-size: 1.5em; }
        .report-meta { display: flex; gap: 20px; margin-bottom: 15px; }
        .report-meta span { color: #7f8c8d; font-size: 0.9em; }
        .download-btn { background: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
        .report-section { margin-bottom: 40px; }
        .report-section h3 { color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px; font-size: 1.8em; }
        .chart-container { margin: 30px 0; padding: 20px; border: 1px solid #e1e8ed; border-radius: 8px; background: #fafafa; }
        .chart-container h4 { margin-top: 0; color: #2c3e50; font-size: 1.3em; margin-bottom: 15px; }
        .chart-plot { margin-bottom: 15px; background: white; border-radius: 4px; }
        .table-container { margin: 30px 0; }
        .data-table, .chart-data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; background: white; }
        .data-table th, .data-table td, .chart-data-table th, .chart-data-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .data-table th, .chart-data-table th { background-color: #f8f9fa; font-weight: 600; color: #2c3e50; }
        .data-table tr:nth-child(even), .chart-data-table tr:nth-child(even) { background-color: #f8f9fa; }
      </style>
    `;
  }

  private hasXYData(series: Data): series is { x: any[]; y: any[]; name?: string } {
    return series && Array.isArray((series as any).x) && Array.isArray((series as any).y);
  }
}