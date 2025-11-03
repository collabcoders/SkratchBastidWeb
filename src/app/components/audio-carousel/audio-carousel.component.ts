import { Component, input, ElementRef, ViewChild, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService, AudioTrack } from '@shared/services/audio.service';

export interface AudioMix {
  image: string;
  link: string;
  title?: string;
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

  playAudio(mix: AudioMix, event: Event): void {
    if (this.isAudioFile(mix.link)) {
      event.preventDefault();
      event.stopPropagation();

      const track: AudioTrack = {
        id: mix.link,
        title: mix.title || 'Unknown Track',
        image: mix.image,
        url: mix.link
      };

      this.audioService.playTrack(track);
    }
  }

  isCurrentTrack(mix: AudioMix): boolean {
    return this.audioService.currentTrack()?.id === mix.link;
  }
}