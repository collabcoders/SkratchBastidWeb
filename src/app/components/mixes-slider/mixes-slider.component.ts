import { Component, input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Mix {
  image: string;
  title: string;
  artist: string;
  href: string;
}

export interface MixesSection {
  title: string;
  icon: string;
  mixes: Mix[];
  signUpText?: string;
  signUpLink?: string;
}

@Component({
  selector: 'app-mixes-slider',
  imports: [CommonModule],
  templateUrl: './mixes-slider.component.html',
  styleUrl: './mixes-slider.component.scss'
})
export class MixesSliderComponent {
  section = input.required<MixesSection>();

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
