import { Component, input, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AudioMix {
  image: string;
  link: string;
  title?: string;
  category: string;
}

export interface AudioSection {
  title: string;
  icon: string;
  data: AudioMix[];
  backgroundColor?: string;
  decorativeStripes?: boolean;
}

@Component({
  selector: 'app-audio-carousel',
  imports: [CommonModule],
  templateUrl: './audio-carousel.component.html',
  styleUrl: './audio-carousel.component.scss',
})
export class AudioCarouselComponent {
  section = input.required<AudioSection>();

  @Input() titleColor = 'dark';

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
