import { Component, input, ElementRef, ViewChild, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video } from '@shared/models/video';

export interface BBQRecap {
  slug: string;
  city: string;
  date: string;
  venue: string;
  image: string;
}

export interface BBQRecapSection {
  title: string;
  icon: string;
  data: Video[];
}

@Component({
  selector: 'app-bbq-recap-carousel',
  imports: [CommonModule],
  templateUrl: './bbq-recap-carousel.component.html',
  styleUrl: './bbq-recap-carousel.component.scss',
})
export class BBQRecapCarouselComponent {
  section = input.required<BBQRecapSection>();
  @Input({ required: true }) isLoadingVideo!: Signal<boolean>;

  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  scrollLeft() {
    const container = this.carousel.nativeElement;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }

  scrollRight() {
    const container = this.carousel.nativeElement;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}