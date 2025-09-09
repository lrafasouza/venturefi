import { Component, Input, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  registerables
} from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-widget">
      <div class="widget-header">
        <h3>{{ title }}</h3>
        <div class="chart-controls">
          <button 
            *ngFor="let period of chartPeriods" 
            class="chart-btn"
            [class.active]="activePeriod === period"
            (click)="setActivePeriod(period)">
            {{ period }}
          </button>
        </div>
      </div>
      
      <div class="chart-container">
        <canvas #chartCanvas class="chart-canvas"></canvas>
        
        <!-- Loading state -->
        <div class="chart-loading" *ngIf="!chartLoaded">
          <div class="loading-spinner"></div>
          <span>Carregando gráfico...</span>
        </div>
      </div>
      
      <div class="chart-legend" *ngIf="data?.labels">
        <div class="legend-item" *ngFor="let dataset of data.datasets; let i = index">
          <span 
            class="legend-color" 
            [style.background-color]="getDatasetColor(dataset, i)">
          </span>
          <span class="legend-label">{{ dataset.label }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-widget {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      border: 1px solid var(--border-primary);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .chart-widget:hover {
      box-shadow: var(--shadow-md);
      border-color: var(--border-secondary);
    }
    
    .widget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
    }
    
    .widget-header h3 {
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
    }
    
    .chart-controls {
      display: flex;
      gap: var(--space-1);
    }
    
    .chart-btn {
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--border-secondary);
      background: var(--bg-primary);
      border-radius: var(--radius-md);
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--text-secondary);
    }
    
    .chart-btn:hover,
    .chart-btn.active {
      background: var(--accent-blue);
      color: var(--text-inverse);
      border-color: var(--accent-blue);
    }
    
    .chart-container {
      flex: 1;
      position: relative;
      min-height: 200px;
      margin-bottom: var(--space-4);
    }
    
    .chart-canvas {
      width: 100%;
      height: 100%;
    }
    
    
    .chart-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-3);
      color: var(--text-tertiary);
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--border-primary);
      border-top: 3px solid var(--accent-blue);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .chart-legend {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-4);
      justify-content: center;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: 0.875rem;
    }
    
    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: var(--radius-sm);
      flex-shrink: 0;
    }
    
    .legend-label {
      color: var(--text-secondary);
      font-weight: 500;
    }
  `]
})
export class ChartWidgetComponent implements AfterViewInit, OnDestroy {
  @Input() title: string = '';
  @Input() data: any = {};
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  chartLoaded = false;
  activePeriod = '6M';
  chartPeriods = ['6M', '1A', 'Tudo'];
  chart: Chart | null = null;
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeChart();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
  
  initializeChart(): void {
    if (this.chartCanvas?.nativeElement) {
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        if (this.data?.chartType === 'line') {
          this.createLineChart(ctx);
        } else if (this.data?.chartType === 'donut') {
          this.createDonutChart(ctx);
        }
        this.chartLoaded = true;
      }
    }
  }
  
  private createLineChart(ctx: CanvasRenderingContext2D): void {
    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: this.data?.labels || ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: this.data?.datasets?.map((dataset: any, index: number) => ({
          label: dataset.label,
          data: dataset.data,
          borderColor: dataset.color || this.getDefaultColor(index),
          backgroundColor: dataset.color ? `${dataset.color}20` : `${this.getDefaultColor(index)}20`,
          borderWidth: index === 0 ? 3 : 2,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: dataset.color || this.getDefaultColor(index),
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        })) || []
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // We use custom legend
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1F2937',
            bodyColor: '#6B7280',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: R$ ${this.formatCurrency(context.parsed.y)}`;
              }
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: false
            },
            ticks: {
              color: '#9CA3AF',
              font: {
                size: 12
              }
            }
          },
          y: {
            display: true,
            grid: {
              color: '#F3F4F6'
            },
            ticks: {
              color: '#9CA3AF',
              font: {
                size: 12
              },
              callback: (value) => {
                return `R$ ${this.formatCurrency(Number(value))}`;
              }
            }
          }
        },
        elements: {
          point: {
            hoverBackgroundColor: '#ffffff'
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private createDonutChart(ctx: CanvasRenderingContext2D): void {
    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: this.data?.labels || ['Alimentação', 'Transporte', 'Moradia', 'Outros'],
        datasets: [{
          data: this.data?.datasets?.[0]?.data || [1200, 800, 1000, 650],
          backgroundColor: this.data?.datasets?.[0]?.colors || [
            '#E74C3C', '#F39C12', '#3498DB', '#2ECC71'
          ],
          borderWidth: 0,
          hoverBorderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            display: false // We use custom legend
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1F2937',
            bodyColor: '#6B7280',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: R$ ${this.formatCurrency(value)} (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1000
        },
        onHover: (event, elements) => {
          if (event?.native?.target) {
            (event.native.target as HTMLElement).style.cursor = elements.length > 0 ? 'pointer' : 'default';
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private getDefaultColor(index: number): string {
    const colors = ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#F97316', '#EC4899'];
    return colors[index % colors.length];
  }
  
  setActivePeriod(period: string): void {
    this.activePeriod = period;
    // In real implementation, this would reload chart data
    // For now, we'll just update the period and recreate the chart
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    setTimeout(() => {
      this.initializeChart();
    }, 100);
  }
  
  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  
  getTotalExpenses(): number {
    if (this.data?.chartType === 'donut' && this.data?.datasets?.[0]?.data) {
      return this.data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
    }
    return 3650; // Mock total
  }
  
  getDatasetColor(dataset: any, index: number): string {
    if (dataset.color) return dataset.color;
    if (dataset.colors && dataset.colors[index]) return dataset.colors[index];
    
    const defaultColors = ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];
    return defaultColors[index % defaultColors.length];
  }
}