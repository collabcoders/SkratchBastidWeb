import { Component, ElementRef, ViewChild, signal, ChangeDetectionStrategy, OnInit, OnDestroy, Signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Ads } from '@shared/models/ads';
import { Observable } from 'rxjs';
import { TokenService } from '@shared/services/token.service';
import { UtilitiesService } from '@shared/services/utilities.service';
import { VideoService } from '@shared/services/video.service';
import { AudioService } from '@shared/services/audio.service';
import { ApiService } from '@shared/services/api.service';
import { Video } from '@shared/models/video';
import { Music } from '@shared/models/music';
import { NavigateService } from '@shared/services/navigate.service';
import { AppData } from 'src/app/app.data';
import { VideoAccessService } from '@shared/services/video-access.service';

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
  @Input({ required: true }) isLoadingBanner!: Signal<boolean>;

  private router = Router;

  isMuted = signal(true);
  currentVideoIndex = signal(0);

  get videos(): Ads[] {
    return this.appData.banners();
  }

  isLoggedIn$!: Observable<boolean>;

  constructor(private token: TokenService, private appData: AppData, private nav: NavigateService, private util: UtilitiesService, private videoService: VideoService, private audioService: AudioService, private api: ApiService, private videoAccessService: VideoAccessService) {

  }

  ngOnInit() {
    this.setupVideo();
    this.isLoggedIn$ = this.token.isValid(undefined);
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
      video.src = this.videos[this.currentVideoIndex()].image;
      video.load();
    }
  }

  getCurrentVideo(): Ads {
    return this.videos[this.currentVideoIndex()];
  }

  // goToVideos() {
  //   window.location.href = '/videos';
  // }

  showMedia(id: number, category: string) {
    if (category == 'video') {
      this.api.getItem('videos', Number(id), '', true).subscribe((data: any) => {
        const video = {
          videoId: id,
          title: data.data.title,
          source: data.data.source,
          sourceId: data.data.sourceId,
          audio1: data.data.audio1,
          duration: data.data.duration,
          featuring: data.data.featuring,
          image: data.data.image,
          date: data.data.date,
          favId: data.data.favId ?? 0,
          hls: data.data.hls,
          category: data.data.category
        } as Video;
        this.videoService.showPlayer(video);
      });
    } else {
      this.api.getItem('music', id, '', true).subscribe((data: any) => {
        const music = {
          musicId: id,
          artist: data.data.artist,
          title: data.data.title,
          genre: data.data.type,
          duration: data.data.duration,
          image: data.data.image,
          file: data.data.file,
          date: data.data.date,
          description: '',
          category: '',
          index: 0,
          favId: data.data.favId,
          featured: 1
        } as Music;
        this.audioService.showPlayer(music);
      });
    }
  }

  goToVideos($event: any, page: string = '', category = '') {
    $event.preventDefault();
    this.isLoggedIn$.subscribe(valid => {
      if (this.util.isNumber(page)) {
        this.showMedia(Number(page), category);
      } else if (page.toLowerCase().indexOf('http') != -1) {
        if (page.indexOf('zoom') != -1) {
          if (valid) {
            window.location.href = page;
          } else {
            const hasAccess = this.videoAccessService.checkVideoAccess(true);

            if (!hasAccess) {
              // Dialog will be shown automatically by the service
              return;
            }
            // bootbox.alert('<h4>SkratchBashID</h4><br>' + 'Sorry, VIP access and streaming is reserved for SkratchBashID members only.  Please Sign-In or Sign-Up (links are on the top-right) to get access.');
          }
        } else {
          window.location.href = page;
        }
      } else {
        this.nav.goto(page, -120);
      }
    });
  }
}