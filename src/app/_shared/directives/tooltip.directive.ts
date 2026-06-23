import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
  inject,
} from '@angular/core';

/**
 * Lightweight hover tooltip.
 *
 * Drop-in replacement for the `tooltip="..."` attribute that ng2-tooltip-directive
 * used to provide — that library relied on ComponentFactoryResolver, which Angular
 * removed in v22. Renders a `.ng-tooltip` element on the body, positioned above the
 * host (falling back to below when there isn't room).
 */
@Directive({
  selector: '[tooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('tooltip') text = '';
  /** 'top' (default) or 'bottom' */
  @Input() placement: 'top' | 'bottom' = 'top';

  private host = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private tooltipEl: HTMLElement | null = null;

  @HostListener('mouseenter')
  @HostListener('focus')
  show(): void {
    if (this.tooltipEl || !this.text) {
      return;
    }
    const el = this.renderer.createElement('div') as HTMLElement;
    this.renderer.addClass(el, 'ng-tooltip');
    this.renderer.setProperty(el, 'textContent', this.text);
    this.renderer.setStyle(el, 'position', 'absolute');
    this.renderer.appendChild(document.body, el);
    this.tooltipEl = el;
    this.position();
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  @HostListener('click')
  hide(): void {
    if (this.tooltipEl) {
      this.renderer.removeChild(document.body, this.tooltipEl);
      this.tooltipEl = null;
    }
  }

  ngOnDestroy(): void {
    this.hide();
  }

  private position(): void {
    if (!this.tooltipEl) {
      return;
    }
    const hostRect = this.host.nativeElement.getBoundingClientRect();
    const tipRect = this.tooltipEl.getBoundingClientRect();
    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;
    const gap = 8;

    let top =
      this.placement === 'bottom'
        ? hostRect.bottom + gap
        : hostRect.top - tipRect.height - gap;
    // Flip below if there isn't room above.
    if (this.placement === 'top' && top + scrollY < scrollY) {
      top = hostRect.bottom + gap;
    }
    const left = hostRect.left + hostRect.width / 2 - tipRect.width / 2;

    this.renderer.setStyle(this.tooltipEl, 'top', `${top + scrollY}px`);
    this.renderer.setStyle(this.tooltipEl, 'left', `${left + scrollX}px`);
  }
}
