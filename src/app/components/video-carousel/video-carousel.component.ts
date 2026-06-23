import { ApiService } from '@shared/services/api.service';
import { LegendsEngagementService } from '@shared/services/legends/engagement.service';
import { Component, input, ElementRef, ViewChild, ViewChildren, QueryList, inject, Signal, Input, OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from '@shared/services/video.service';
import { Video } from '@shared/models/video';
import { VideoAccessService } from '@shared/services/video-access.service';
import { TokenService } from '@shared/services/token.service';
import { Observable, Subscription } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { FavoriteId } from '@shared/models/favorite-id';
import { Config } from '@shared/config';
import { AlertService } from '@shared/services/alert.service';
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
  data?: Video[];
  category?: string;
  type?: string;
  signUpText?: string;
  signUpLink?: string;
  signUpTargetId?: string;
}

@Component({
  selector: 'app-video-carousel',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './video-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './video-carousel.component.scss',
})
export class VideoCarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  section = input.required<VideoSection>();
  private videoService = inject(VideoService);
  @Input({ required: true }) isLoadingVideo!: Signal<boolean>;
  /** Opt-in: stagger-reveal each slide as the carousel scrolls into view. */
  @Input() reveal = false;

  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  @ViewChildren('revealCard') revealCards!: QueryList<ElementRef>;
  private revealObserver?: IntersectionObserver;
  private revealCardsSub?: Subscription;

  processingFav = false;
  alertOptions = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  isLoggedIn$!: Observable<boolean>;
  private favSub?: Subscription;
  constructor(private videoAccessService: VideoAccessService, 
    private token: TokenService,
    private apiService: ApiService,
    private alertService: AlertService,
    private legendsEngagement: LegendsEngagementService,) {

  }

  ngOnInit() {
    this.isLoggedIn$ = this.token.isValid(undefined);
    this.favSub = this.videoService.getFavId().subscribe(({ itemId, favId }) => {
      const section = this.section();
      if (!section?.data || section.data.length === 0 || !itemId) return;
      section.data = section.data.map(v => v.videoId === itemId ? { ...v, favId } : v);
    });
  }

  ngAfterViewInit(): void {
    if (!this.reveal) return;
    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    // Slides may render after the API data arrives, so (re)observe on changes.
    const observeNew = () => {
      this.revealCards?.forEach((el) => {
        const node = el.nativeElement as HTMLElement;
        if (!node.dataset['revealObserved']) {
          node.dataset['revealObserved'] = '1';
          this.revealObserver?.observe(node);
        }
      });
    };
    observeNew();
    this.revealCardsSub = this.revealCards.changes.subscribe(observeNew);
  }

  ngOnDestroy(): void {
    this.favSub?.unsubscribe();
    this.revealCardsSub?.unsubscribe();
    this.revealObserver?.disconnect();
  }
  
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

  playVideo(video: Video) {
    const hasAccess = this.videoAccessService.checkVideoAccess(true);

    if (!hasAccess) {
      // Dialog will be shown automatically by the service
      return;
    }

    // Convert VideoMix to Video format
    const videoData: Video = video;

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

  videoPoster = '/public/logo.png';
  checkImage(event: any, video: Video) {
    const target = event.target || event.srcElement || event.currentTarget;
    let imgElement = new Image();
    imgElement.src = target.src;
    imgElement.addEventListener('load', () => {
      //console.log(imgElement.naturalHeight + ' x ' + imgElement.naturalWidth);
      if (video.source == 'vimeo' && imgElement.naturalHeight === 480 && imgElement.naturalWidth === 640) {
        target.src = this.videoPoster;
        imgElement.onload = null;
      }
      if (video.source == 'youtube' && imgElement.naturalHeight === 90 && imgElement.naturalWidth === 120) {
        target.src = this.videoPoster;
        imgElement.onload = null;
      }
    });
    imgElement.addEventListener('error', () => {
      target.src = this.videoPoster;
      imgElement.onload = null;
    });
  }

  errorImage(event: any, video: Video) {
    const target = event.target || event.srcElement || event.currentTarget;
    let imgElement = new Image();
    imgElement.src = target.src;
    target.src = target.src = this.videoPoster;
    imgElement.onload = null;
  }

  showGif(event: any, video: Video) {
    const target = event.target || event.srcElement || event.currentTarget;
    const hoverSrc = this.getHoverMedia(video);
    if (hoverSrc) {
      target.src = hoverSrc;
    }
  }

  showScreenshot(event: any, video: Video) {
    const target = event.target || event.srcElement || event.currentTarget;
    const poster = this.getPoster(video);
    if (poster) {
      target.src = poster;
    }
  }

  getPoster(video: Video): string {
    const thumbnail = (video as any)?.thumbnail as string | undefined;
    const isGif = (src?: string) => !!src && src.toLowerCase().includes('.gif');

    if (video.screenshot) {
      return video.screenshot;
    }

    if (thumbnail) {
      return thumbnail;
    }

    if (video.source === 'youtube' && video.sourceId) {
      return `//img.youtube.com/vi/${video.sourceId}/mqdefault.jpg`;
    }

    if (video.image && !isGif(video.image)) {
      return video.image;
    }

    return this.videoPoster;
  }

  getHoverMedia(video: Video): string {
    const thumbnail = (video as any)?.thumbnail as string | undefined;
    return video.image || thumbnail || video.screenshot || this.getPoster(video);
  }

  formatDate(value?: string): string {
    if (!value) {
      return '';
    }

    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  onImageLoad(event: Event) {
    const target = event.target as HTMLElement | null;
    if (target && 'classList' in target) {
      target.classList.remove('blur-preview', 'shimmer');
    }
  }

  onImageError(event: Event) {
    const target = event.target as HTMLElement | null;
    if (target && 'classList' in target) {
      target.classList.remove('blur-preview', 'shimmer');
    }
  }

  scrollToSignup(event: MouseEvent) {
    event.preventDefault();
    const section = this.section();
    const targetId = section?.signUpTargetId;

    if (!targetId) {
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    const headerOffset = 90;
    const top = window.scrollY + target.getBoundingClientRect().top - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  fav(event: any, video: Video, itemId: number) {
    event?.preventDefault();
    event?.stopPropagation();
    console.log("FAV", itemId, event);
    this.isLoggedIn$
      .pipe(take(1))
      .subscribe(valid => {
      if (valid) {
        if (this.token.getMember().status == 'current' || this.token.getMember().status == 'canceled') {
          const fav = {
            favId: video.favId,
            itemId: itemId,
            section: 'video'
          } as FavoriteId;
          if (!this.processingFav) {
            this.processingFav = true;
            this.legendsEngagement.toggleFavorite(fav.itemId, fav.section)
              .pipe(finalize(() => {
                this.processingFav = false;
              }))
              .subscribe(data => {
                if (data.error) {
                  this.alertService.error('Error', data.msg, this.alertOptions);
                  return;
                }

                console.log(data.id);
                if (data.id > 0) {
                  video.favId = data.id;
                  this.alertService.success('Added', data.msg, this.alertOptions);
                } else {
                  video.favId = 0;
                  this.alertService.info('Removed', data.msg, this.alertOptions);
                }
              });
          }
        } else {
          const hasAccess = this.videoAccessService.checkVideoAccess(true);

          if (!hasAccess) {
            // Dialog will be shown automatically by the service
            return;
          }
          // bootbox.alert('<h4>VIP Only</h4><br>' + 'Sorry, the Favorites feature is reserved for VIP subscribers only.  Please click the Upgrade button (link on the top-right) to get access.');
        }
      } else {
        const hasAccess = this.videoAccessService.checkVideoAccess(true);

        if (!hasAccess) {
          // Dialog will be shown automatically by the service
          return;
        }
        // bootbox.alert('<h4>Members Only</h4><br>' + 'Sorry, the Favorites feature is reserved for members only.  Please Sign-In or Sign-Up (links are on the top-right) to get access.');
      }
    });
  }
}
