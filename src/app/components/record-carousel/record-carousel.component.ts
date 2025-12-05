import { Component, Input, ElementRef, ViewChild, input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video } from '@shared/models/video';
import { RouterLink } from '@angular/router';

export interface Record {
  href: string;
  image: string;
  title: string;
  artist: string;
}

export interface RecordSection {
  title: string;
  icon: string;
  data: Video[];
}

@Component({
  selector: 'app-record-carousel',
  imports: [CommonModule, RouterLink],
  templateUrl: './record-carousel.component.html',
  styleUrl: './record-carousel.component.scss',
})
export class RecordCarouselComponent {
  section = input.required<RecordSection>();
  @Input({ required: true }) isLoadingRecap!: Signal<boolean>;

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

  videoPoster = '/public/logo.png';
  
  checkImage(event: any, record: Video) {
    const target = event.target || event.srcElement || event.currentTarget;
    let imgElement = new Image();
    imgElement.src = target.src;
    imgElement.addEventListener('load', () => {
      if (record.source == 'vimeo' && imgElement.naturalHeight === 480 && imgElement.naturalWidth === 640) {
        target.src = this.videoPoster;
        imgElement.onload = null;
      }
      if (record.source == 'youtube' && imgElement.naturalHeight === 90 && imgElement.naturalWidth === 120) {
        target.src = this.videoPoster;
        imgElement.onload = null;
      }
    });
    imgElement.addEventListener('error', () => {
      target.src = this.videoPoster;
    });
  }

  errorImage(event: any, record: Video) {
    const target = event.target || event.srcElement || event.currentTarget;
    target.src = this.videoPoster;
  }


}