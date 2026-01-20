import { Component, ElementRef, ViewChild, signal, ChangeDetectionStrategy, OnInit, OnDestroy, Signal, Input, effect, EffectRef, runInInjectionContext, EnvironmentInjector, inject } from '@angular/core';
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

  readonly transitionMs = 600;
  readonly lastDirection = signal<'next' | 'prev'>('next');

  private router = Router;
  private environmentInjector = inject(EnvironmentInjector);
  private autoRotateTimeout: ReturnType<typeof setTimeout> | null = null;
  private rotationEffect?: EffectRef;
  private progressInterval: ReturnType<typeof setInterval> | null = null;
  private progressRaf: number | null = null;

  isMuted = signal(true);
  currentVideoIndex = signal(0);
  isTransitioning = signal(false);
  progress = signal(0);

  get videos(): Ads[] {
    return this.appData.banners();
  }

  isLoggedIn$!: Observable<boolean>;

  constructor(private token: TokenService, private appData: AppData, private nav: NavigateService, private util: UtilitiesService, private videoService: VideoService, private audioService: AudioService, private api: ApiService, private videoAccessService: VideoAccessService) {

  }

  ngOnInit() {
    this.setupVideo();
    this.isLoggedIn$ = this.token.isValid(undefined);
    this.setupAutoRotate();
  }

  ngOnDestroy() {
    // Clean up video if needed
    this.clearAutoRotateTimer();
    this.clearProgressTimer();
    this.cancelProgressRaf();
    this.rotationEffect?.destroy();
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
    this.setIndexAndSchedule(newIndex, 'prev');
  }

  nextVideo() {
    const currentIndex = this.currentVideoIndex();
    const newIndex = currentIndex === this.videos.length - 1 ? 0 : currentIndex + 1;
    this.setIndexAndSchedule(newIndex, 'next');
  }

  loadVideo() {
    const video = this.videoElement?.nativeElement;
    if (!video) {
      return;
    }
    video.src = this.videos[this.currentVideoIndex()].image;
    video.load();
  }

  goToIndex(index: number) {
    if (index < 0 || index >= this.videos.length) {
      return;
    }
    const currentIndex = this.currentVideoIndex();
    const direction: 'next' | 'prev' = index === currentIndex
      ? 'next'
      : index > currentIndex
        ? 'next'
        : 'prev';
    this.setIndexAndSchedule(index, direction);
  }

  private setupAutoRotate() {
    if (this.rotationEffect) {
      return;
    }

    this.rotationEffect = runInInjectionContext(this.environmentInjector, () =>
      effect(() => this.handleAutoRotateEffect())
    );
  }

  private clearAutoRotateTimer() {
    if (this.autoRotateTimeout) {
      clearTimeout(this.autoRotateTimeout);
      this.autoRotateTimeout = null;
    }
  }

  private startProgress(seconds: number) {
    const durationMs = Math.max(1, seconds) * 1000;
    const start = performance.now();

    this.progress.set(0);
    this.clearProgressTimer();
    this.cancelProgressRaf();

    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      this.progress.set(pct);

      if (pct < 100) {
        this.progressRaf = requestAnimationFrame(tick);
      } else {
        this.cancelProgressRaf();
      }
    };

    // Fallback interval in case RAF is throttled heavily
    this.progressInterval = setInterval(() => {
      const elapsed = performance.now() - start;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      this.progress.set(pct);
      if (pct >= 100) {
        this.clearProgressTimer();
      }
    }, 250);

    this.progressRaf = requestAnimationFrame(tick);
  }

  private clearProgressTimer() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  private cancelProgressRaf() {
    if (this.progressRaf !== null) {
      cancelAnimationFrame(this.progressRaf);
      this.progressRaf = null;
    }
  }

  private setIndexAndSchedule(newIndex: number, direction: 'next' | 'prev') {
    if (this.isTransitioning() || newIndex === this.currentVideoIndex()) {
      return;
    }

    this.clearAutoRotateTimer();
    this.clearProgressTimer();
    this.cancelProgressRaf();
    this.progress.set(0);

    this.lastDirection.set(direction);
    this.isTransitioning.set(true);
    this.currentVideoIndex.set(newIndex);
    this.loadVideo();

    setTimeout(() => {
      this.isTransitioning.set(false);
      this.scheduleRotationForCurrent();
    }, this.transitionMs);
  }

  private scheduleRotationForCurrent() {
    if (this.isTransitioning()) {
      return;
    }

    this.clearAutoRotateTimer();
    this.clearProgressTimer();
    this.cancelProgressRaf();
    this.progress.set(0);

    if (!this.videos.length) {
      return;
    }

    const current = this.videos[this.currentVideoIndex()];
    const seconds = Number(current?.seconds) || 5;
    const delayMs = Math.max(1, seconds) * 1000;

    this.startProgress(seconds);

    this.autoRotateTimeout = setTimeout(() => {
      if (this.videos.length > 1) {
        this.nextVideo();
      }
    }, delayMs);
  }

  private handleAutoRotateEffect() {
    const banners = this.appData.banners();
    const loading = this.isLoadingBanner ? this.isLoadingBanner() : false;

    if (!banners.length || loading || this.isTransitioning()) {
      this.clearAutoRotateTimer();
      this.clearProgressTimer();
      this.cancelProgressRaf();
      this.progress.set(0);
      return;
    }

    // Re-run scheduling when banners change or index changes
    this.scheduleRotationForCurrent();
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