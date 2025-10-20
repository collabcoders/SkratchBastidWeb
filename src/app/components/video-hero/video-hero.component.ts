import { Component, ElementRef, ViewChild, signal, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface VideoItem {
  src: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-video-hero',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './video-hero.component.html',
  styleUrl: './video-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoHeroComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  private router = Router;

  isMuted = signal(true);
  currentVideoIndex = signal(0);

  videos: VideoItem[] = [
    {
      src: '/videos/video1.mov',
      title: 'Latest Live Set',
      description: 'Watch the latest live performance'
    },
    {
      src: '/videos/video1.mov', // Using same video for demo
      title: 'Previous Live Set',
      description: 'Previous performance replay'
    }
  ];

  ngOnInit() {
    this.setupVideo();
  }

  ngOnDestroy() {
    // Clean up video if needed
  }

  setupVideo() {
    if (this.videoElement?.nativeElement) {
      const video = this.videoElement.nativeElement;
      video.muted = this.isMuted();
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
    }
  }

  toggleMute() {
    const video = this.videoElement.nativeElement;
    const newMutedState = !this.isMuted();
    this.isMuted.set(newMutedState);
    video.muted = newMutedState;
  }

  previousVideo() {
    const currentIndex = this.currentVideoIndex();
    const newIndex = currentIndex === 0 ? this.videos.length - 1 : currentIndex - 1;
    this.currentVideoIndex.set(newIndex);
    this.loadVideo();
  }

  nextVideo() {
    const currentIndex = this.currentVideoIndex();
    const newIndex = currentIndex === this.videos.length - 1 ? 0 : currentIndex + 1;
    this.currentVideoIndex.set(newIndex);
    this.loadVideo();
  }

  loadVideo() {
    if (this.videoElement?.nativeElement) {
      const video = this.videoElement.nativeElement;
      video.src = this.videos[this.currentVideoIndex()].src;
      video.load();
    }
  }

  getCurrentVideo(): VideoItem {
    return this.videos[this.currentVideoIndex()];
  }

  goToVideos() {
    window.location.href = '/videos';
  }
}