import { Component, input, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from '@shared/services/video.service';
import { Video } from '@shared/models/video';
// import { VideoService } from '../../services/video.service';
// import { Video } from '../../models/video.model';

declare var $: any;

export interface VideoMix {
  thumbnail: string;
  title: string;
  link?: string;
  // Video player data
  videoId?: number;
  source?: string;
  sourceId?: string;
  hls?: string;
  duration?: string;
  category?: string;
  featuring?: string;
  image?: string;
  date?: string;
}

export interface VideoSection {
  title: string;
  icon: string;
  videos?: VideoMix[];
  data?: VideoMix[];
  category?: string;
  type?: string;
  signUpText?: string;
  signUpLink?: string;
}

@Component({
  selector: 'app-video-carousel',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './video-carousel.component.html',
  styleUrl: './video-carousel.component.scss',
})
export class VideoCarouselComponent {
  section = input.required<VideoSection>();
  private videoService = inject(VideoService);

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

  playVideo(video: VideoMix) {
    // Convert VideoMix to Video format
    const videoData: Video= {
      videoId: video.videoId || 0,
      title: video.title,
      source: video.source || 'vimeo',
      sourceId: video.sourceId || '',
      hls: video.hls || '',
      duration: video.duration || '0:00',
      category: video.category || '',
      featuring: video.featuring || '',
      image: video.image || video.thumbnail,
      screenshot: video.thumbnail,
      date: video.date || new Date().toISOString(),
      audio1: '',
      favId: 0,
      featured: 0
    };

    console.log(72, 'here,', video);
    // Show the video player
    this.videoService.showPlayer(videoData);

    // Open the Bootstrap modal using Bootstrap 5 native API
    setTimeout(() => {
      const modalElement = document.getElementById('videoModal');
      if (modalElement) {
        // Check if Bootstrap is loaded
        if (typeof (window as any).bootstrap !== 'undefined') {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        } else if (typeof $ !== 'undefined' && typeof ($ as any).fn.modal !== 'undefined') {
          // Fallback to jQuery if available
          ($('#videoModal') as any).modal('show');
        } else {
          console.error('Bootstrap modal is not available');
        }
      }
    }, 100);
  }
}
