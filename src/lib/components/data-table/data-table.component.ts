import { Component, Input, OnInit } from '@angular/core';
import { TableConfig } from '../../models/report.model';

@Component({
  selector: 'lib-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  @Input() config!: TableConfig;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  pageSize: number = 10;
  sortedData: any[] = [];

  ngOnInit() {
    this.pageSize = this.config.pageSize || 10;
    this.sortedData = [...this.config.data];
  }

  sort(column: string) {
    const col = this.config.columns.find(c => c.key === column);
    if (!col?.sortable) return;

    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.sortedData.sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];
      
      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.currentPage = 1;
  }

  getCurrentPageData() {
    if (!this.config.showPagination) return this.sortedData;
    
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.sortedData.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.sortedData.length / this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  formatCellValue(value: any, type?: string) {
    if (value === null || value === undefined) return '';
    
    switch (type) {
      case 'percentage':
        return typeof value === 'number' ? `${value.toFixed(1)}%` : `${value}%`;
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      case 'date':
        return new Date(value).toLocaleDateString();
      default:
        return value;
    }
  }
}