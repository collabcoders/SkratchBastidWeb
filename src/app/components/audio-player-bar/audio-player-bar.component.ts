import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '@shared/services/audio.service';

@Component({
  selector: 'app-audio-player-bar',
  imports: [CommonModule],
  templateUrl: './audio-player-bar.component.html',
  styleUrl: './audio-player-bar.component.scss',
})
export class AudioPlayerBarComponent {
  audioService = inject(AudioService);

  seekTo(event: MouseEvent, progressBar: HTMLElement): void {
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    this.audioService.seekTo(percentage);
  }

  setVolume(event: MouseEvent, volumeBar: HTMLElement): void {
    const rect = volumeBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const volume = clickX / rect.width;
    this.audioService.setVolume(volume);
  }
}