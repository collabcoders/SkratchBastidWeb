import { Component, input, ElementRef, ViewChild, Input, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '@shared/services/audio.service';
import { Music } from '@shared/models/music';
import { ImagePipe } from '@shared/pipes/image.pipe';

export interface AudioMix {
  image: string;
  link: string;
  title?: string;
}

export interface AudioSection {
  title: string;
  icon: string;
  data: Music[];
  backgroundColor?: string;
  decorativeStripes?: boolean;
  isLoading?: string;
}

@Component({
  selector: 'app-audio-carousel',
  imports: [CommonModule, ImagePipe],
  templateUrl: './audio-carousel.component.html',
  styleUrl: './audio-carousel.component.scss',
})
export class AudioCarouselComponent {
  section = input.required<AudioSection>();
  @Input({ required: true }) isLoadingMusic!: Signal<boolean>;

  @Input() titleColor = 'dark';

  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  audioService = inject(AudioService);

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

  isAudioFile(url: string): boolean {
    return url?.endsWith('.mp3') || url?.endsWith('.wav') || url?.endsWith('.m4a') || url?.endsWith('.ogg');
  }

  playAudio(mix: Music, event: Event): void {
    if (this.isAudioFile(mix.file)) {
      event.preventDefault();
      event.stopPropagation();

      // const track: AudioTrack = {
      //   id: mix.file,
      //   title: mix.title || 'Unknown Track',
      //   image: mix.image,
      //   url: mix.file
      // };

      this.audioService.playTrack(mix);
    }
  }

  isCurrentTrack(mix: Music): boolean {
    return this.audioService.currentTrack()?.file === mix.file;
  }
}