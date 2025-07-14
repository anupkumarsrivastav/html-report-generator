import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportViewerComponent } from './components/report-viewer/report-viewer.component';
import { ChartViewerComponent } from './components/chart-viewer/chart-viewer.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ReportService } from './services/report.service';

@NgModule({
  declarations: [
    ReportViewerComponent,
    ChartViewerComponent,
    DataTableComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    ReportService
  ],
  exports: [
    ReportViewerComponent,
    ChartViewerComponent,
    DataTableComponent
  ]
})
export class ReportLibModule { }