import { Component, OnInit } from '@angular/core';
import { ReportConfig } from '@lib/models/report.model';
import { ReportService } from '@lib/services/report.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular Dynamic Report Demo';
  currentReport: ReportConfig | null = null;
  selectedTemplate = 'stunting';

  templates = [
    { id: 'stunting', name: 'Stunting Trends Report' },
    { id: 'sales', name: 'Sales Performance Report' },
    { id: 'education', name: 'Education Statistics Report' }
  ];

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.loadTemplate('stunting');
  }

  loadTemplate(templateId: string) {
    this.selectedTemplate = templateId;
    switch (templateId) {
      case 'stunting':
        this.currentReport = this.getStuntingReport();
        break;
      case 'sales':
        this.currentReport = this.getSalesReport();
        break;
      case 'education':
        this.currentReport = this.getEducationReport();
        break;
      default:
        this.currentReport = this.getStuntingReport();
    }
  }

  generateRandomData() {
    if (this.currentReport) {
      this.currentReport.sections.forEach(section => {
        section.charts?.forEach(chart => {
          chart.data.forEach(series => {
            const seriesWithY = series as any;
            if (seriesWithY.y && Array.isArray(seriesWithY.y)) {
              seriesWithY.y = seriesWithY.y.map(() => Math.floor(Math.random() * 50) + 10);
            }
          });
        });
      });
      this.reportService.generateReport({ ...this.currentReport });
    }
  }

  exportToHtml() {
    if (this.currentReport) {
      const htmlContent = this.reportService.exportToHtml(this.currentReport);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.currentReport.title.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  private getStuntingReport(): ReportConfig {
    return {
      title: 'Stunting Trends in Northeast India: Mixed Progress and Emerging Concerns (2015-2019)',
      subtitle: 'Health and Nutrition Analysis Report',
      author: 'Satender Rana',
      publishedDate: '23/05/25',
      description: 'With stunting rates nearing 47%, Meghalaya has the highest burden of child stunting in the Northeast. This article explores trends in child stunting across Northeastern states.',
      downloadEnabled: true,
      theme: 'light',
      sections: [
        {
          id: 'overview',
          title: 'Report Overview',
          content: `
            <p>Child stunting continues to be a critical public health concern across India, and this dataset from NFHS 4 and 5 (2015 and 2019) provides a window into how Northeastern states are faring. The trends are far from uniform: while a few states have made notable progress, others show concerning stagnation or even increases, especially among vulnerable populations.</p>
            
            <p>Sikkim and Manipur stand out for their sustained reductions in child stunting. Sikkim recorded the largest gains, dropping from 43.1% in 2015 to 25.6% in 2019. These improvements could be linked to relatively better coverage of maternal and child health services, stronger community development programmes, and greater proximity to basic infrastructure like healthcare and water access.</p>
          `,
          order: 1,
          charts: [
            {
              id: 'stunting-trends-line',
              title: 'Stunting Trends by State (2015-2019)',
              type: 'line',
              data: [
                {
                  x: [2015, 2016, 2017, 2018, 2019],
                  y: [47.0, 46.2, 45.1, 44.3, 43.8],
                  name: 'Meghalaya',
                  type: 'scatter',
                  mode: 'lines+markers',
                  line: { color: '#e74c3c', width: 3 },
                  marker: { size: 8 }
                },
                {
                  x: [2015, 2016, 2017, 2018, 2019],
                  y: [36.4, 35.1, 33.8, 32.5, 31.2],
                  name: 'Assam',
                  type: 'scatter',
                  mode: 'lines+markers',
                  line: { color: '#3498db', width: 3 },
                  marker: { size: 8 }
                },
                {
                  x: [2015, 2016, 2017, 2018, 2019],
                  y: [43.1, 39.7, 35.2, 30.8, 25.6],
                  name: 'Sikkim',
                  type: 'scatter',
                  mode: 'lines+markers',
                  line: { color: '#2ecc71', width: 3 },
                  marker: { size: 8 }
                },
                {
                  x: [2015, 2016, 2017, 2018, 2019],
                  y: [28.9, 27.8, 26.2, 24.8, 23.1],
                  name: 'Manipur',
                  type: 'scatter',
                  mode: 'lines+markers',
                  line: { color: '#f39c12', width: 3 },
                  marker: { size: 8 }
                }
              ],
              options: {
                layout: {
                  title: {
                    text: 'Child Stunting Rates by State',
                    font: { size: 18, family: 'Inter' }
                  },
                  xaxis: { 
                    title: 'Year',
                    gridcolor: '#f0f0f0'
                  },
                  yaxis: { 
                    title: 'Stunting Rate (%)',
                    gridcolor: '#f0f0f0'
                  },
                  hovermode: 'x unified',
                  plot_bgcolor: '#fafafa',
                  paper_bgcolor: 'white'
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 450
            }
          ],
          tables: [
            {
              id: 'stunting-summary',
              title: 'Stunting Statistics Summary (2019)',
              data: [
                { state: 'Meghalaya', rate: 43.8, change: -3.2, status: 'High Risk' },
                { state: 'Assam', rate: 31.2, change: -5.2, status: 'Moderate Risk' },
                { state: 'Sikkim', rate: 25.6, change: -17.5, status: 'Improved' },
                { state: 'Manipur', rate: 23.1, change: -5.8, status: 'Low Risk' }
              ],
              columns: [
                { key: 'state', label: 'State', type: 'text', sortable: true },
                { key: 'rate', label: 'Stunting Rate (%)', type: 'number', sortable: true },
                { key: 'change', label: 'Change from 2015', type: 'number', sortable: true },
                { key: 'status', label: 'Risk Status', type: 'text', sortable: true }
              ],
              showPagination: true
            }
          ]
        }
      ]
    };
  }

  private getSalesReport(): ReportConfig {
    return {
      title: 'Q4 2024 Sales Performance Report',
      subtitle: 'Regional Sales Analysis and Trends',
      author: 'Sales Analytics Team',
      publishedDate: new Date().toLocaleDateString(),
      description: 'Comprehensive analysis of Q4 2024 sales performance across all regions with year-over-year comparisons.',
      downloadEnabled: true,
      theme: 'light',
      sections: [
        {
          id: 'sales-overview',
          title: 'Sales Overview',
          content: '<p>Q4 2024 demonstrated exceptional growth across multiple regions.</p>',
          order: 1,
          charts: [
            {
              id: 'quarterly-sales',
              title: 'Quarterly Sales Performance',
              type: 'line',
              data: [
                {
                  x: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
                  y: [8.2, 9.1, 10.5, 12.5],
                  name: 'Revenue (Millions $)',
                  type: 'scatter',
                  mode: 'lines+markers'
                }
              ],
              options: {
                layout: {
                  title: 'Quarterly Revenue Growth',
                  xaxis: { title: 'Quarter' },
                  yaxis: { title: 'Revenue (Million $)' }
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 400
            }
          ]
        }
      ]
    };
  }

  private getEducationReport(): ReportConfig {
    return {
      title: 'Education Statistics Report 2024',
      subtitle: 'Student Performance and Enrollment Analysis',
      author: 'Education Department',
      publishedDate: new Date().toLocaleDateString(),
      description: 'Comprehensive analysis of student performance and enrollment rates.',
      downloadEnabled: true,
      theme: 'light',
      sections: [
        {
          id: 'enrollment-trends',
          title: 'Enrollment Trends',
          content: '<p>Student enrollment has shown steady growth across all educational levels.</p>',
          order: 1,
          charts: [
            {
              id: 'enrollment-by-level',
              title: 'Enrollment by Education Level',
              type: 'pie',
              data: [
                {
                  labels: ['Primary', 'Secondary', 'Higher Secondary', 'University'],
                  values: [45, 30, 15, 10],
                  type: 'pie'
                }
              ],
              options: {
                layout: {
                  title: 'Student Distribution by Education Level'
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 400
            }
          ]
        }
      ]
    };
  }
}