import { Directive, Input, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: false
})
export class TooltipDirective {
  @Input() text: string = '';  // Tooltip text
  private tooltipElement: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.createTooltip();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.destroyTooltip();
  }

  private createTooltip() {
    const tooltip = this.renderer.createElement('div');
    this.tooltipElement = tooltip;

    this.renderer.appendChild(tooltip, this.renderer.createText(this.text));
    this.renderer.addClass(tooltip, 'tooltip');
    this.renderer.appendChild(this.el.nativeElement, tooltip);

    const hostRect = this.el.nativeElement.getBoundingClientRect();

    this.renderer.setStyle(tooltip, 'position', 'fixed');
    this.renderer.setStyle(tooltip, 'visibility', 'hidden');

    const tooltipRect = tooltip.getBoundingClientRect();

    const spaceRight = window.innerWidth - hostRect.right;
    const spaceTop = hostRect.top;

    if (spaceRight > tooltipRect.width + 8) {
      this.renderer.setStyle(tooltip, 'top', `${hostRect.top + hostRect.height / 2 - tooltipRect.height / 2}px`);
      this.renderer.setStyle(tooltip, 'left', `${hostRect.right + 8}px`);
    } else if (spaceTop > tooltipRect.height + 8) {
      this.renderer.setStyle(tooltip, 'top', `${hostRect.top - tooltipRect.height - 8}px`);
      this.renderer.setStyle(tooltip, 'left', `${hostRect.left + hostRect.width / 2 - tooltipRect.width / 2}px`);
    }

    this.renderer.removeStyle(tooltip, 'visibility');
  }

  private destroyTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
