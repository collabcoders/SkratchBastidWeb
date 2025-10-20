import { HostListener, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigateService {
  @HostListener("window:scroll", [])
  track($event: any) {
    console.debug("Scroll Event", $event);
  }
  renderer!: Renderer2;
  constructor(private rendererFactory: RendererFactory2, 
    private viewportScroller: ViewportScroller) { 
      this.renderer = rendererFactory.createRenderer(null, null);
    }

  goto(page: string = '', offset: number = 0) {
    //$event.preventDefault()
    if (page.toLowerCase().indexOf('http') != -1) {
      // window.location.href = page;
      window.open(page, '_blank');
    } else {
      this.viewportScroller.scrollToAnchor(page);
      setTimeout(() => {
        if (document.body.classList.contains('show-menu')) {
          this.renderer.removeClass(document.body, 'show-menu');
        }
      }, 400);
    }
  }

}
