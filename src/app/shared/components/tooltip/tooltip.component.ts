import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="tooltip-wrapper" #tooltipWrapper>
      <div class="tooltip-trigger" 
           (mouseenter)="showTooltip()"
           (mouseleave)="hideTooltip()"
           (focus)="showTooltip()"
           (blur)="hideTooltip()"
           [attr.aria-describedby]="tooltipId"
           tabindex="0">
        <ng-content></ng-content>
        <app-icon 
          name="question-mark-circle" 
          size="16" 
          className="tooltip-icon"
          *ngIf="showIcon">
        </app-icon>
      </div>
      
      <div class="tooltip-content" 
           #tooltipContent
           [class.visible]="isVisible"
           [class]="'tooltip-' + position"
           [id]="tooltipId"
           role="tooltip">
        <div class="tooltip-header" *ngIf="title">
          <app-icon [name]="iconName" size="16" [className]="iconClass || ''" *ngIf="iconName"></app-icon>
          <span class="tooltip-title">{{ title }}</span>
        </div>
        
        <div class="tooltip-body" [innerHTML]="content"></div>
        
        <div class="tooltip-footer" *ngIf="showLearnMore">
          <button class="learn-more-btn" (click)="onLearnMore()">
            <app-icon name="academic-cap" size="14"></app-icon>
            <span>Saiba mais</span>
          </button>
        </div>
        
        <div class="tooltip-arrow"></div>
      </div>
    </div>
  `,
  styles: [`
    .tooltip-wrapper {
      position: relative;
      display: inline-block;
    }

    .tooltip-trigger {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      outline: none;
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
    }

    .tooltip-trigger:focus {
      outline: 2px solid var(--accent-blue);
      outline-offset: 2px;
    }

    .tooltip-icon {
      color: var(--text-tertiary);
      transition: color 0.2s ease;
    }

    .tooltip-trigger:hover .tooltip-icon,
    .tooltip-trigger:focus .tooltip-icon {
      color: var(--accent-blue);
    }

    .tooltip-content {
      position: absolute;
      z-index: 1000;
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      padding: var(--space-4);
      min-width: 250px;
      max-width: 350px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(8px);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }

    .tooltip-content.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      pointer-events: auto;
    }

    .tooltip-content.tooltip-top {
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%) translateY(8px);
    }

    .tooltip-content.tooltip-top.visible {
      transform: translateX(-50%) translateY(0);
    }

    .tooltip-content.tooltip-bottom {
      top: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%) translateY(-8px);
    }

    .tooltip-content.tooltip-bottom.visible {
      transform: translateX(-50%) translateY(0);
    }

    .tooltip-content.tooltip-left {
      right: calc(100% + 8px);
      top: 50%;
      transform: translateY(-50%) translateX(8px);
    }

    .tooltip-content.tooltip-left.visible {
      transform: translateY(-50%) translateX(0);
    }

    .tooltip-content.tooltip-right {
      left: calc(100% + 8px);
      top: 50%;
      transform: translateY(-50%) translateX(-8px);
    }

    .tooltip-content.tooltip-right.visible {
      transform: translateY(-50%) translateX(0);
    }

    .tooltip-header {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-2);
      padding-bottom: var(--space-2);
      border-bottom: 1px solid var(--border-primary);
    }

    .tooltip-title {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-primary);
    }

    .tooltip-body {
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--text-secondary);
    }

    .tooltip-body p {
      margin: 0 0 var(--space-2) 0;
    }

    .tooltip-body p:last-child {
      margin-bottom: 0;
    }

    .tooltip-body ul {
      margin: 0;
      padding-left: var(--space-4);
    }

    .tooltip-body li {
      margin-bottom: var(--space-1);
    }

    .tooltip-footer {
      margin-top: var(--space-3);
      padding-top: var(--space-2);
      border-top: 1px solid var(--border-primary);
    }

    .learn-more-btn {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      background: none;
      border: none;
      color: var(--accent-blue);
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      padding: var(--space-1) 0;
      transition: color 0.2s ease;
    }

    .learn-more-btn:hover {
      color: var(--accent-blue-dark);
    }

    .tooltip-arrow {
      position: absolute;
      width: 8px;
      height: 8px;
      background: var(--bg-primary);
      border: 1px solid var(--border-primary);
      transform: rotate(45deg);
    }

    .tooltip-top .tooltip-arrow {
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      border-top: none;
      border-left: none;
    }

    .tooltip-bottom .tooltip-arrow {
      top: -5px;
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      border-bottom: none;
      border-right: none;
    }

    .tooltip-left .tooltip-arrow {
      right: -5px;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
      border-left: none;
      border-bottom: none;
    }

    .tooltip-right .tooltip-arrow {
      left: -5px;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
      border-right: none;
      border-top: none;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .tooltip-content {
        min-width: 200px;
        max-width: 280px;
        padding: var(--space-3);
      }

      .tooltip-body {
        font-size: 0.8rem;
      }
    }
  `]
})
export class TooltipComponent implements AfterViewInit, OnDestroy {
  @Input() title?: string;
  @Input() content: string = '';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() showIcon: boolean = true;
  @Input() iconName?: string;
  @Input() iconClass?: string;
  @Input() showLearnMore: boolean = false;
  @Input() learnMoreUrl?: string;

  @ViewChild('tooltipWrapper') tooltipWrapper!: ElementRef;
  @ViewChild('tooltipContent') tooltipContent!: ElementRef;

  isVisible = false;
  tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
  private hideTimeout?: number;

  ngAfterViewInit() {
    this.adjustPosition();
  }

  ngOnDestroy() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  showTooltip() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.isVisible = true;
    this.adjustPosition();
  }

  hideTooltip() {
    this.hideTimeout = window.setTimeout(() => {
      this.isVisible = false;
    }, 150);
  }

  onLearnMore() {
    if (this.learnMoreUrl) {
      window.open(this.learnMoreUrl, '_blank');
    }
  }

  private adjustPosition() {
    if (!this.tooltipContent || !this.tooltipWrapper) return;

    const wrapper = this.tooltipWrapper.nativeElement;
    const tooltip = this.tooltipContent.nativeElement;
    const rect = wrapper.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Auto-adjust position based on viewport space
    let newPosition = this.position;

    if (this.position === 'top' && rect.top < tooltipRect.height + 20) {
      newPosition = 'bottom';
    } else if (this.position === 'bottom' && rect.bottom > viewportHeight - tooltipRect.height - 20) {
      newPosition = 'top';
    } else if (this.position === 'left' && rect.left < tooltipRect.width + 20) {
      newPosition = 'right';
    } else if (this.position === 'right' && rect.right > viewportWidth - tooltipRect.width - 20) {
      newPosition = 'left';
    }

    // Update classes if position changed
    if (newPosition !== this.position) {
      tooltip.className = tooltip.className.replace(/tooltip-(top|bottom|left|right)/, `tooltip-${newPosition}`);
    }
  }
}