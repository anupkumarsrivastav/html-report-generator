import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ReportConfig } from '../../models/report.model';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'lib-report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.css']
})
export class ReportViewerComponent implements OnInit, OnDestroy {
  @Input() config?: ReportConfig;
  
  report: ReportConfig | null = null;
  showTables = false; // Flag to control table visibility
  private destroy$ = new Subject<void>();

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    if (this.config) {
      this.report = this.config;
      this.reportService.generateReport(this.config);
    }

    this.reportService.report$
      .pipe(takeUntil(this.destroy$))
      .subscribe(report => {
        this.report = report;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSortedSections() {
    return this.report?.sections.sort((a, b) => a.order - b.order) || [];
  }

  toggleTableVisibility() {
    this.showTables = !this.showTables;
  }

  downloadReport() {
    if (this.report) {
      const htmlContent = this.reportService.exportToHtml(this.report);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.report.title.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }
}