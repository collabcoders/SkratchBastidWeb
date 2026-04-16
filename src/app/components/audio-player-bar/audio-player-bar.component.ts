import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '@shared/services/audio.service';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { Config } from '@shared/config';
import { Music } from '@shared/models/music';

@Component({
  selector: 'app-audio-player-bar',
  imports: [CommonModule, ImagePipe],
  templateUrl: './audio-player-bar.component.html',
  styleUrl: './audio-player-bar.component.scss',
})
export class AudioPlayerBarComponent {
  audioService = inject(AudioService);

  private getTrackFileUrl(track: Music | null | undefined): string {
    const file = track?.file || track?.url || '';
    if (!file) {
      return '';
    }

    return file.toLowerCase().startsWith('http') ? file : `${Config.content}${file}`;
  }

  private getTrackFileName(track: Music | null | undefined): string {
    const source = track?.file || track?.url || track?.title || 'audio';
    const fileName = (source.split('/').pop() || 'audio').split('?')[0].split('#')[0];
    if (/\.[a-z0-9]+$/i.test(fileName)) {
      return fileName;
    }

    return `${fileName}.mp3`;
  }

  async downloadCurrentTrack(event: MouseEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    const track = this.audioService.currentTrack();
    if (!track) {
      return;
    }

    const fileUrl = this.getTrackFileUrl(track);
    if (!fileUrl) {
      return;
    }

    const fileName = this.getTrackFileName(track);

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to download audio: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const element = document.createElement('a');
      element.href = blobUrl;
      element.download = fileName;
      element.click();
      window.setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    } catch {
      const element = document.createElement('a');
      element.href = fileUrl;
      element.target = '_blank';
      element.rel = 'noopener noreferrer';
      element.download = fileName;
      element.click();
    }
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
