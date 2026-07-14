import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { AudioService } from '@shared/services/audio.service';
import { ImagePipe } from '@shared/pipes/image.pipe';

@Component({
  selector: 'app-audio-player-bar',
  imports: [ImagePipe],
  templateUrl: './audio-player-bar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './audio-player-bar.component.scss',
})
export class AudioPlayerBarComponent {
  audioService = inject(AudioService);

  // Download the currently-playing track via the LegendsOnly /api/download
  // endpoint (server renames + logs + increments the play count). Handles both
  // ordinary music and video audio-versions (which carry a mediaRef).
  downloadCurrentTrack(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.audioService.downloadTrack(this.audioService.currentTrack());
  }

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
