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
    { id: 'education', name: 'Education Statistics Report' },
    { id: 'charts', name: 'All Chart Types Demo' }
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
      case 'charts':
        this.currentReport = this.getChartTypesDemo();
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
          content: '<p>Q4 2024 demonstrated exceptional growth across multiple regions, with significant improvements in both revenue and market penetration.</p>',
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
                  mode: 'lines+markers',
                  line: { color: '#2ecc71', width: 3 },
                  marker: { size: 8 }
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
            },
            {
              id: 'regional-sales',
              title: 'Sales by Region',
              type: 'bar',
              data: [
                {
                  x: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'],
                  y: [4.2, 3.8, 2.9, 1.1, 0.5],
                  type: 'bar',
                  name: 'Q4 2024 Sales',
                  marker: { color: '#3498db' }
                }
              ],
              options: {
                layout: {
                  title: 'Regional Sales Performance (Million $)',
                  xaxis: { title: 'Region' },
                  yaxis: { title: 'Sales (Million $)' }
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 400
            },
            {
              id: 'product-mix',
              title: 'Product Category Sales Distribution',
              type: 'pie',
              data: [
                {
                  labels: ['Enterprise Software', 'Cloud Services', 'Consulting', 'Support & Maintenance', 'Hardware'],
                  values: [35, 28, 18, 12, 7],
                  type: 'pie',
                  marker: {
                    colors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6']
                  }
                }
              ],
              options: {
                layout: {
                  title: 'Revenue Distribution by Product Category (%)'
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 400
            },
            {
              id: 'monthly-trends',
              title: 'Monthly Sales Trends',
              type: 'line',
              data: [
                {
                  x: ['Oct 2024', 'Nov 2024', 'Dec 2024'],
                  y: [3.8, 4.1, 4.6],
                  name: 'Monthly Revenue',
                  type: 'scatter',
                  mode: 'lines+markers',
                  line: { color: '#e67e22', width: 3 },
                  marker: { size: 8 }
                },
                {
                  x: ['Oct 2024', 'Nov 2024', 'Dec 2024'],
                  y: [3.2, 3.5, 3.8],
                  name: 'Previous Year',
                  type: 'scatter',
                  mode: 'lines+markers',
                  line: { color: '#95a5a6', width: 2, dash: 'dash' },
                  marker: { size: 6 }
                }
              ],
              options: {
                layout: {
                  title: 'Q4 Monthly Performance vs Previous Year',
                  xaxis: { title: 'Month' },
                  yaxis: { title: 'Revenue (Million $)' }
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 400
            },
            {
              id: 'top-performers',
              title: 'Top Sales Representatives',
              type: 'bar',
              data: [
                {
                  x: ['Sarah Johnson', 'Mike Chen', 'Lisa Rodriguez', 'David Kim', 'Emma Wilson'],
                  y: [1.8, 1.6, 1.4, 1.2, 1.0],
                  type: 'bar',
                  name: 'Q4 Sales',
                  marker: { color: '#16a085' }
                }
              ],
              options: {
                layout: {
                  title: 'Top 5 Sales Representatives (Million $)',
                  xaxis: { title: 'Sales Representative' },
                  yaxis: { title: 'Sales (Million $)' }
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

  private getChartTypesDemo(): ReportConfig {
    return {
      title: 'Complete Chart Types Demonstration',
      subtitle: 'All Supported Chart Types with Examples',
      author: 'Chart Demo Team',
      publishedDate: new Date().toLocaleDateString(),
      description: 'Comprehensive demonstration of all supported chart types including bar, line, pie, scatter, and choropleth maps.',
      downloadEnabled: true,
      theme: 'light',
      sections: [
        {
          id: 'bar-charts',
          title: 'Bar Chart Variations',
          content: '<p>Demonstrating different bar chart types: vertical, horizontal, grouped, and stacked.</p>',
          order: 1,
          charts: [
            {
              id: 'vertical-bar',
              title: 'Vertical Bar Chart',
              type: 'bar',
              data: [
                {
                  x: ['Product A', 'Product B', 'Product C', 'Product D'],
                  y: [20, 14, 23, 25],
                  type: 'bar',
                  name: 'Sales',
                  marker: { color: '#3498db' }
                }
              ],
              options: {
                layout: {
                  title: 'Product Sales (Vertical)',
                  xaxis: { title: 'Products' },
                  yaxis: { title: 'Sales (thousands)' }
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 400
            },
            {
              id: 'horizontal-bar',
              title: 'Horizontal Bar Chart',
              type: 'bar',
              data: [
                {
                  x: [20, 14, 23, 25],
                  y: ['Product A', 'Product B', 'Product C', 'Product D'],
                  type: 'bar',
                  name: 'Sales',
                  orientation: 'h',
                  marker: { color: '#e74c3c' }
                }
              ],
              options: {
                layout: {
                  title: 'Product Sales (Horizontal)',
                  xaxis: { title: 'Sales (thousands)' },
                  yaxis: { title: 'Products' }
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 400
            },
            {
              id: 'grouped-bar',
              title: 'Grouped Bar Chart',
              type: 'bar',
              data: [
                {
                  x: ['Q1', 'Q2', 'Q3', 'Q4'],
                  y: [20, 14, 23, 25],
                  type: 'bar',
                  name: '2023',
                  marker: { color: '#3498db' }
                },
                {
                  x: ['Q1', 'Q2', 'Q3', 'Q4'],
                  y: [16, 18, 20, 28],
                  type: 'bar',
                  name: '2024',
                  marker: { color: '#e74c3c' }
                }
              ],
              options: {
                layout: {
                  title: 'Quarterly Sales Comparison',
                  barmode: 'group',
                  xaxis: { title: 'Quarter' },
                  yaxis: { title: 'Sales (thousands)' }
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 400
            },
            {
              id: 'stacked-bar',
              title: 'Stacked Bar Chart',
              type: 'bar',
              data: [
                {
                  x: ['Q1', 'Q2', 'Q3', 'Q4'],
                  y: [20, 14, 23, 25],
                  type: 'bar',
                  name: 'Online',
                  marker: { color: '#3498db' }
                },
                {
                  x: ['Q1', 'Q2', 'Q3', 'Q4'],
                  y: [16, 18, 20, 28],
                  type: 'bar',
                  name: 'Offline',
                  marker: { color: '#e74c3c' }
                }
              ],
              options: {
                layout: {
                  title: 'Sales by Channel',
                  barmode: 'stack',
                  xaxis: { title: 'Quarter' },
                  yaxis: { title: 'Sales (thousands)' }
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 400
            }
          ]
        },
        {
          id: 'line-scatter-charts',
          title: 'Line & Scatter Chart Types',
          content: '<p>Different variations of line and scatter charts for trend analysis.</p>',
          order: 2,
          charts: [
            {
              id: 'line-chart',
              title: 'Single Line Chart',
              type: 'scatter',
              data: [
                {
                  x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  y: [10, 15, 13, 17, 19, 22],
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'Revenue',
                  line: { color: '#2ecc71', width: 3 },
                  marker: { size: 8 }
                }
              ],
              options: {
                layout: {
                  title: 'Monthly Revenue Trend',
                  xaxis: { title: 'Month' },
                  yaxis: { title: 'Revenue (thousands)' }
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 400
            },
            {
              id: 'multiple-line-chart',
              title: 'Multiple Line Chart',
              type: 'scatter',
              data: [
                {
                  x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  y: [10, 15, 13, 17, 19, 22],
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'Revenue',
                  line: { color: '#2ecc71', width: 3 },
                  marker: { size: 8 }
                },
                {
                  x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  y: [8, 12, 11, 14, 16, 18],
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'Expenses',
                  line: { color: '#e74c3c', width: 3 },
                  marker: { size: 8 }
                },
                {
                  x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  y: [2, 3, 2, 3, 3, 4],
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'Profit',
                  line: { color: '#3498db', width: 3 },
                  marker: { size: 8 }
                },
                {
                  x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  y: [6, 9, 8, 11, 13, 15],
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'Target',
                  line: { color: '#f39c12', width: 2, dash: 'dash' },
                  marker: { size: 6 }
                }
              ],
              options: {
                layout: {
                  title: 'Monthly Financial Performance',
                  xaxis: { title: 'Month' },
                  yaxis: { title: 'Amount (thousands)' },
                  hovermode: 'x unified'
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 400
            },
            {
              id: 'scatter-chart',
              title: 'Scatter Plot',
              type: 'scatter',
              data: [
                {
                  x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                  y: [10, 15, 13, 17, 19, 22, 18, 25, 28, 32],
                  type: 'scatter',
                  mode: 'markers',
                  name: 'Data Points',
                  marker: { 
                    size: 10, 
                    color: '#9b59b6',
                    opacity: 0.7
                  }
                }
              ],
              options: {
                layout: {
                  title: 'Sales vs Marketing Spend',
                  xaxis: { title: 'Marketing Spend (thousands)' },
                  yaxis: { title: 'Sales (thousands)' }
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 400
            },
            {
              id: 'bubble-chart',
              title: 'Bubble Chart',
              type: 'scatter',
              data: [
                {
                  x: [1, 2, 3, 4, 5],
                  y: [10, 15, 13, 17, 19],
                  type: 'scatter',
                  mode: 'markers',
                  name: 'Company A',
                  marker: { 
                    size: [20, 30, 25, 35, 40],
                    color: '#3498db',
                    opacity: 0.6
                  }
                },
                {
                  x: [1.5, 2.5, 3.5, 4.5, 5.5],
                  y: [8, 12, 16, 20, 24],
                  type: 'scatter',
                  mode: 'markers',
                  name: 'Company B',
                  marker: { 
                    size: [15, 25, 30, 20, 45],
                    color: '#e74c3c',
                    opacity: 0.6
                  }
                }
              ],
              options: {
                layout: {
                  title: 'Market Position Analysis (Bubble Size = Market Share)',
                  xaxis: { title: 'Price' },
                  yaxis: { title: 'Quality Score' }
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 400
            }
          ]
        },
        {
          id: 'pie-charts',
          title: 'Pie Chart Variations',
          content: '<p>Standard pie chart and donut chart examples.</p>',
          order: 3,
          charts: [
            {
              id: 'pie-chart',
              title: 'Pie Chart',
              type: 'pie',
              data: [
                {
                  labels: ['Desktop', 'Mobile', 'Tablet', 'Smart TV'],
                  values: [45, 35, 15, 5],
                  type: 'pie',
                  marker: {
                    colors: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12']
                  }
                }
              ],
              options: {
                layout: {
                  title: 'Device Usage Distribution'
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 400
            },
            {
              id: 'donut-chart',
              title: 'Donut Chart',
              type: 'pie',
              data: [
                {
                  labels: ['Email', 'Social Media', 'Direct', 'Search'],
                  values: [30, 25, 20, 25],
                  type: 'pie',
                  hole: 0.4,
                  marker: {
                    colors: ['#9b59b6', '#1abc9c', '#f39c12', '#e67e22']
                  }
                }
              ],
              options: {
                layout: {
                  title: 'Traffic Sources (Donut)',
                  annotations: [
                    {
                      font: { size: 20 },
                      showarrow: false,
                      text: 'Traffic',
                      x: 0.5,
                      y: 0.5
                    }
                  ]
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 400
            }
          ]
        },
        {
          id: 'maps',
          title: 'Map Visualizations',
          content: '<p>Choropleth maps for geographical data visualization.</p>',
          order: 4,
          charts: [
            {
              id: 'choropleth-map',
              title: 'Choropleth Map',
              type: 'choropleth',
              data: [
                {
                  type: 'choropleth',
                  locationmode: 'USA-states',
                  locations: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA'],
                  z: [1390, 695, 1204, 912, 2704, 1528, 1123, 679, 1711, 1809],
                  text: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia'],
                  colorscale: [
                    [0, '#f7fbff'],
                    [0.2, '#deebf7'],
                    [0.4, '#c6dbef'],
                    [0.6, '#9ecae1'],
                    [0.8, '#6baed6'],
                    [1, '#3182bd']
                  ],
                                     colorbar: {
                     title: { text: 'Sales ($)' }
                   }
                }
              ],
              options: {
                layout: {
                  title: 'Sales by State',
                  geo: {
                    scope: 'usa',
                    projection: { type: 'albers usa' },
                    showlakes: true,
                    lakecolor: '#ffffff'
                  }
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 500
            },
            {
              id: 'world-choropleth',
              title: 'World Choropleth Map',
              type: 'choropleth',
              data: [
                {
                  type: 'choropleth',
                  locationmode: 'ISO-3',
                  locations: ['USA', 'CHN', 'DEU', 'JPN', 'GBR', 'IND', 'FRA', 'ITA', 'BRA', 'CAN'],
                  z: [21427700, 14342900, 3846400, 4938600, 2829100, 2875100, 2715500, 2103900, 1449600, 1736400],
                  text: ['United States', 'China', 'Germany', 'Japan', 'United Kingdom', 'India', 'France', 'Italy', 'Brazil', 'Canada'],
                  colorscale: [
                    [0, '#fff5f0'],
                    [0.25, '#fee0d2'],
                    [0.5, '#fcbba1'],
                    [0.75, '#fc9272'],
                    [1, '#de2d26']
                  ],
                                     colorbar: {
                     title: { text: 'GDP (USD)' }
                   }
                }
              ],
              options: {
                layout: {
                  title: 'GDP by Country',
                  geo: {
                    showframe: false,
                    showcoastlines: false,
                    projection: { type: 'natural earth' }
                  }
                }
              },
              showDataTable: true,
              downloadEnabled: true,
              height: 500
            }
          ]
        }
      ]
    };
  }
}