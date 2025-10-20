import { Component, input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Record {
  href: string;
  image: string;
  title: string;
  artist: string;
}

export interface RecordSection {
  title: string;
  icon: string;
  records: Record[];
}

@Component({
  selector: 'app-record-carousel',
  imports: [CommonModule],
  templateUrl: './record-carousel.component.html',
  styleUrl: './record-carousel.component.scss',
})
export class RecordCarouselComponent {
  section = input.required<RecordSection>();

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