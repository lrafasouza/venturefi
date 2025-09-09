import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

export interface SelectOption {
  value: any;
  label: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'currency' | 'date' | 'status' | 'actions';
  width?: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
}

export interface TableAction {
  key: string;
  label: string;
  icon: string;
  type?: 'primary' | 'secondary' | 'danger';
  visible?: (row: any) => boolean;
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  search: string;
  status: string;
  dateRange: { start: Date | null; end: Date | null };
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, IconComponent, FormsModule],
  template: `
    <div class="data-table-container">
      <!-- Table Header with Controls -->
      <div class="table-header" *ngIf="showHeader">
        <div class="table-title">
          <h3 *ngIf="title">{{ title }}</h3>
          <p *ngIf="subtitle" class="table-subtitle">{{ subtitle }}</p>
        </div>
        
        <div class="table-controls">
          <!-- Search -->
          <input
            *ngIf="searchable"
            type="text"
            placeholder="Buscar..."
            [(ngModel)]="filters.search"
            (input)="onSearchChange($event)"
            class="search-input"
          />
          
          <!-- Status Filter -->
          <select
            *ngIf="statusOptions.length > 0"
            [(ngModel)]="filters.status"
            (change)="onStatusFilterChange($event)"
            class="status-filter"
          >
            <option value="">Todos os status</option>
            <option *ngFor="let option of statusOptions" [value]="option.value">
              {{ option.label }}
            </option>
          </select>
          
          <!-- Action Button -->
          <button *ngIf="primaryAction" 
                  class="btn btn-primary"
                  (click)="primaryAction.action()">
            <app-icon [name]="primaryAction.icon" size="16"></app-icon>
            <span>{{ primaryAction.label }}</span>
          </button>
        </div>
      </div>
      
      <!-- Table Filters Summary -->
      <div class="filters-summary" *ngIf="hasActiveFilters">
        <span class="filters-label">Filtros ativos:</span>
        
        <span *ngIf="filters.search" class="filter-tag">
          <app-icon name="magnifying-glass" size="14"></app-icon>
          "{{ filters.search }}"
          <button (click)="clearSearchFilter()" class="clear-filter">
            <app-icon name="x-mark" size="12"></app-icon>
          </button>
        </span>
        
        <span *ngIf="filters.status" class="filter-tag">
          <app-icon name="funnel" size="14"></app-icon>
          {{ getStatusLabel(filters.status) }}
          <button (click)="clearStatusFilter()" class="clear-filter">
            <app-icon name="x-mark" size="12"></app-icon>
          </button>
        </span>
        
        <button (click)="clearAllFilters()" class="clear-all-filters">
          Limpar todos
        </button>
      </div>
      
      <!-- Loading State -->
      <div *ngIf="loading" class="table-loading">
        <div class="loading-spinner"></div>
        <span>Carregando dados...</span>
      </div>
      
      <!-- Empty State -->
      <div *ngIf="!loading && filteredData.length === 0" class="table-empty">
        <app-icon name="inbox" size="48"></app-icon>
        <h4>{{ emptyMessage || 'Nenhum registro encontrado' }}</h4>
        <p>{{ emptySubtitle || 'Tente ajustar os filtros para encontrar o que procura.' }}</p>
        <button *ngIf="primaryAction" 
                class="btn btn-primary"
                (click)="primaryAction.action()">
          <app-icon [name]="primaryAction.icon" size="16"></app-icon>
          <span>{{ primaryAction.label }}</span>
        </button>
      </div>
      
      <!-- Table -->
      <div *ngIf="!loading && filteredData.length > 0" class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th *ngFor="let column of columns" 
                  [class]="'text-' + (column.align || 'left')"
                  [style.width]="column.width">
                <button *ngIf="column.sortable" 
                        class="sort-button"
                        (click)="toggleSort(column.key)">
                  <span>{{ column.label }}</span>
                  <app-icon 
                    [name]="getSortIcon(column.key)" 
                    size="14"
                    [className]="getSortIconClass(column.key)"
                  ></app-icon>
                </button>
                <span *ngIf="!column.sortable">{{ column.label }}</span>
              </th>
              <th *ngIf="actions.length > 0" class="actions-column">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of paginatedData; let i = index; trackBy: trackByFn"
                class="table-row"
                [class.selected]="isRowSelected(row)"
                (click)="onRowClick(row, i)">
              <td *ngFor="let column of columns" 
                  [class]="'text-' + (column.align || 'left')">
                <span [innerHTML]="getCellValue(row, column)"></span>
              </td>
              <td *ngIf="actions.length > 0" class="actions-cell">
                <div class="actions-menu">
                  <button *ngFor="let action of getVisibleActions(row)"
                          class="action-btn"
                          [class]="'btn-' + (action.type || 'secondary')"
                          (click)="onActionClick(action, row, $event)"
                          [title]="action.label">
                    <app-icon [name]="action.icon" size="16"></app-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div *ngIf="!loading && filteredData.length > 0 && showPagination" class="table-pagination">
        <div class="pagination-info">
          <span>
            Mostrando {{ startIndex + 1 }} a {{ endIndex }} de {{ filteredData.length }} registros
          </span>
        </div>
        
        <div class="pagination-controls">
          <select
            [(ngModel)]="pageSize"
            (change)="onPageSizeChange($event)"
            class="page-size-select"
          >
            <option *ngFor="let option of pageSizeOptions" [value]="option.value">
              {{ option.label }}
            </option>
          </select>
          
          <div class="pagination-buttons">
            <button class="btn btn-ghost pagination-btn"
                    [disabled]="currentPage === 1"
                    (click)="goToPage(1)">
              <app-icon name="chevron-double-left" size="16"></app-icon>
            </button>
            
            <button class="btn btn-ghost pagination-btn"
                    [disabled]="currentPage === 1"
                    (click)="goToPage(currentPage - 1)">
              <app-icon name="chevron-left" size="16"></app-icon>
            </button>
            
            <span class="page-numbers">
              <button *ngFor="let page of visiblePages"
                      class="btn btn-ghost pagination-btn"
                      [class.active]="page === currentPage"
                      (click)="goToPage(page)">
                {{ page }}
              </button>
            </span>
            
            <button class="btn btn-ghost pagination-btn"
                    [disabled]="currentPage === totalPages"
                    (click)="goToPage(currentPage + 1)">
              <app-icon name="chevron-right" size="16"></app-icon>
            </button>
            
            <button class="btn btn-ghost pagination-btn"
                    [disabled]="currentPage === totalPages"
                    (click)="goToPage(totalPages)">
              <app-icon name="chevron-double-right" size="16"></app-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .data-table-container {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-primary);
      overflow: hidden;
      animation: fadeInUp 0.4s ease-out;
    }
    
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: var(--space-6);
      border-bottom: 1px solid var(--border-primary);
      background: var(--bg-secondary);
    }
    
    .table-title h3 {
      color: var(--text-primary);
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 var(--space-1) 0;
    }
    
    .table-subtitle {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0;
    }
    
    .table-controls {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
    
    .search-input,
    .status-filter {
      min-width: 200px;
    }
    
    .filters-summary {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4) var(--space-6);
      background: var(--accent-blue-light);
      border-bottom: 1px solid var(--border-primary);
      font-size: 0.875rem;
    }
    
    .filters-label {
      color: var(--text-secondary);
      font-weight: 600;
    }
    
    .filter-tag {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background: var(--accent-blue);
      color: var(--text-inverse);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .clear-filter {
      background: none;
      border: none;
      color: var(--text-inverse);
      cursor: pointer;
      padding: var(--space-1);
      border-radius: var(--radius-sm);
      transition: background 0.2s ease;
    }
    
    .clear-filter:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .clear-all-filters {
      background: none;
      border: none;
      color: var(--accent-blue);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      transition: background 0.2s ease;
    }
    
    .clear-all-filters:hover {
      background: rgba(59, 130, 246, 0.1);
    }
    
    .table-loading,
    .table-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-16) var(--space-8);
      text-align: center;
    }
    
    .table-loading {
      gap: var(--space-4);
      color: var(--text-secondary);
    }
    
    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--border-primary);
      border-top: 3px solid var(--accent-blue);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .table-empty {
      gap: var(--space-4);
    }
    
    .table-empty h4 {
      color: var(--text-primary);
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
    }
    
    .table-empty p {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0;
      max-width: 400px;
    }
    
    .table-wrapper {
      overflow-x: auto;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .data-table thead th {
      padding: var(--space-4) var(--space-6);
      background: var(--bg-tertiary);
      border-bottom: 1px solid var(--border-primary);
      font-weight: 600;
      color: var(--text-secondary);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .sort-button {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background: none;
      border: none;
      color: inherit;
      font: inherit;
      cursor: pointer;
      padding: 0;
      transition: color 0.2s ease;
    }
    
    .sort-button:hover {
      color: var(--text-primary);
    }
    
    .sort-icon {
      opacity: 0.5;
      transition: opacity 0.2s ease;
    }
    
    .sort-icon.active {
      opacity: 1;
      color: var(--accent-blue);
    }
    
    .data-table tbody td {
      padding: var(--space-4) var(--space-6);
      border-bottom: 1px solid var(--border-primary);
      font-size: 0.875rem;
      color: var(--text-primary);
    }
    
    .table-row {
      transition: background 0.2s ease;
      cursor: pointer;
    }
    
    .table-row:hover {
      background: var(--bg-secondary);
    }
    
    .table-row.selected {
      background: var(--accent-blue-light);
    }
    
    .text-left { text-align: left; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    
    .actions-column {
      width: 120px;
    }
    
    .actions-cell {
      padding: var(--space-2) var(--space-6) !important;
    }
    
    .actions-menu {
      display: flex;
      gap: var(--space-1);
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: 1px solid var(--border-secondary);
      background: var(--bg-primary);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--text-secondary);
    }
    
    .action-btn:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }
    
    .action-btn.btn-primary {
      background: var(--accent-blue);
      border-color: var(--accent-blue);
      color: var(--text-inverse);
    }
    
    .action-btn.btn-primary:hover {
      background: #2563eb;
      border-color: #2563eb;
    }
    
    .action-btn.btn-danger {
      background: var(--accent-red);
      border-color: var(--accent-red);
      color: var(--text-inverse);
    }
    
    .action-btn.btn-danger:hover {
      background: #dc2626;
      border-color: #dc2626;
    }
    
    .table-pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4) var(--space-6);
      border-top: 1px solid var(--border-primary);
      background: var(--bg-secondary);
    }
    
    .pagination-info {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    
    .pagination-controls {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }
    
    .page-size-select {
      min-width: 100px;
    }
    
    .pagination-buttons {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }
    
    .pagination-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-secondary);
    }
    
    .pagination-btn.active {
      background: var(--accent-blue);
      border-color: var(--accent-blue);
      color: var(--text-inverse);
    }
    
    .page-numbers {
      display: flex;
      gap: var(--space-1);
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .table-header {
        flex-direction: column;
        gap: var(--space-4);
        align-items: stretch;
      }
      
      .table-controls {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-input,
      .status-filter {
        min-width: unset;
      }
      
      .table-pagination {
        flex-direction: column;
        gap: var(--space-3);
        align-items: stretch;
      }
      
      .pagination-controls {
        justify-content: space-between;
        flex-wrap: wrap;
        gap: var(--space-2);
      }
    }
  `]
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading: boolean = false;
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() emptyMessage: string = '';
  @Input() emptySubtitle: string = '';
  @Input() searchable: boolean = true;
  @Input() showHeader: boolean = true;
  @Input() showPagination: boolean = true;
  @Input() pageSize: number = 10;
  @Input() statusOptions: SelectOption[] = [];
  @Input() primaryAction?: { label: string; icon: string; action: () => void };
  @Input() selectable: boolean = false;
  @Input() selectedRows: any[] = [];
  @Input() trackByKey: string = 'id';
  
  @Output() rowClick = new EventEmitter<{ row: any; index: number }>();
  @Output() actionClick = new EventEmitter<{ action: TableAction; row: any }>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() sortChange = new EventEmitter<SortConfig>();
  @Output() filterChange = new EventEmitter<FilterConfig>();
  
  // Internal state
  filteredData: any[] = [];
  paginatedData: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  
  sortConfig: SortConfig = { column: '', direction: 'asc' };
  filters: FilterConfig = {
    search: '',
    status: '',
    dateRange: { start: null, end: null }
  };
  
  pageSizeOptions: SelectOption[] = [
    { value: 5, label: '5 por página' },
    { value: 10, label: '10 por página' },
    { value: 25, label: '25 por página' },
    { value: 50, label: '50 por página' },
    { value: 100, label: '100 por página' }
  ];
  
  get hasActiveFilters(): boolean {
    return !!(this.filters.search || this.filters.status);
  }
  
  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }
  
  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.filteredData.length);
  }
  
  get visiblePages(): number[] {
    const pages = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);
    
    let start = Math.max(1, this.currentPage - halfVisible);
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  ngOnInit(): void {
    this.updateFilteredData();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['pageSize']) {
      this.updateFilteredData();
    }
  }
  
  trackByFn = (index: number, item: any): any => {
    return item[this.trackByKey] || index;
  }
  
  updateFilteredData(): void {
    let filtered = [...this.data];
    
    // Apply search filter
    if (this.filters.search) {
      const searchTerm = this.filters.search.toLowerCase();
      filtered = filtered.filter(row => 
        this.columns.some(col => {
          const value = this.getCellValue(row, col);
          return value && value.toString().toLowerCase().includes(searchTerm);
        })
      );
    }
    
    // Apply status filter
    if (this.filters.status) {
      filtered = filtered.filter(row => row.status === this.filters.status);
    }
    
    // Apply sorting
    if (this.sortConfig.column) {
      filtered.sort((a, b) => {
        const aVal = a[this.sortConfig.column];
        const bVal = b[this.sortConfig.column];
        
        if (aVal === bVal) return 0;
        
        const result = aVal < bVal ? -1 : 1;
        return this.sortConfig.direction === 'asc' ? result : -result;
      });
    }
    
    this.filteredData = filtered;
    this.updatePagination();
  }
  
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    
    const start = this.startIndex;
    const end = this.endIndex;
    
    this.paginatedData = this.filteredData.slice(start, end);
  }
  
  getCellValue(row: any, column: TableColumn): string {
    const value = row[column.key];
    
    if (column.format) {
      return column.format(value);
    }
    
    switch (column.type) {
      case 'currency':
        return `R$ ${Number(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      case 'date':
        return value ? new Date(value).toLocaleDateString('pt-BR') : '';
      case 'status':
        return this.getStatusBadge(value);
      default:
        return value?.toString() || '';
    }
  }
  
  getStatusBadge(status: string): string {
    const statusMap: { [key: string]: { label: string; class: string } } = {
      active: { label: 'Ativo', class: 'status-success' },
      pending: { label: 'Pendente', class: 'status-warning' },
      inactive: { label: 'Inativo', class: 'status-error' },
      completed: { label: 'Concluído', class: 'status-success' },
      cancelled: { label: 'Cancelado', class: 'status-error' }
    };
    
    const config = statusMap[status] || { label: status, class: 'status-default' };
    return `<span class="status-badge ${config.class}">${config.label}</span>`;
  }
  
  toggleSort(column: string): void {
    if (this.sortConfig.column === column) {
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig.column = column;
      this.sortConfig.direction = 'asc';
    }
    
    this.sortChange.emit(this.sortConfig);
    this.updateFilteredData();
  }
  
  getSortIcon(column: string): string {
    if (this.sortConfig.column !== column) return 'arrows-up-down';
    return this.sortConfig.direction === 'asc' ? 'chevron-up' : 'chevron-down';
  }
  
  getSortIconClass(column: string): string {
    return this.sortConfig.column === column ? 'sort-icon active' : 'sort-icon';
  }
  
  onSearchChange(event: any): void {
    this.filters.search = event.target.value;
    this.currentPage = 1;
    this.filterChange.emit(this.filters);
    this.updateFilteredData();
  }
  
  onStatusFilterChange(event: any): void {
    this.filters.status = event.target.value;
    this.currentPage = 1;
    this.filterChange.emit(this.filters);
    this.updateFilteredData();
  }
  
  clearSearchFilter(): void {
    this.filters.search = '';
    this.currentPage = 1;
    this.updateFilteredData();
  }
  
  clearStatusFilter(): void {
    this.filters.status = '';
    this.currentPage = 1;
    this.updateFilteredData();
  }
  
  clearAllFilters(): void {
    this.filters = {
      search: '',
      status: '',
      dateRange: { start: null, end: null }
    };
    this.currentPage = 1;
    this.updateFilteredData();
  }
  
  getStatusLabel(value: string): string {
    const option = this.statusOptions.find(opt => opt.value === value);
    return option?.label || value;
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }
  
  onPageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = 1;
    this.updateFilteredData();
  }
  
  onRowClick(row: any, index: number): void {
    this.rowClick.emit({ row, index });
  }
  
  onActionClick(action: TableAction, row: any, event: Event): void {
    event.stopPropagation();
    this.actionClick.emit({ action, row });
  }
  
  getVisibleActions(row: any): TableAction[] {
    return this.actions.filter(action => 
      !action.visible || action.visible(row)
    );
  }
  
  isRowSelected(row: any): boolean {
    return this.selectedRows.some(selected => 
      selected[this.trackByKey] === row[this.trackByKey]
    );
  }
}