import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-bbq-cta',
  imports: [],
  templateUrl: './bbq-cta.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './bbq-cta.component.scss'
})
export class BbqCtaComponent implements AfterViewInit {
  @ViewChild('ctaVideo') ctaVideo!: ElementRef<HTMLVideoElement>;

  // Angular doesn't reflect the static `muted` attribute to the property, which
  // makes the browser block muted-autoplay. Set it imperatively and kick off
  // playback once the element exists.
  ngAfterViewInit() {
    const video = this.ctaVideo?.nativeElement;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => { /* autoplay may still be deferred until interaction */ });
  }
}
