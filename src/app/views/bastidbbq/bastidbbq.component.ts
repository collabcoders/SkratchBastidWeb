import { AfterViewInit, Component, ElementRef, HostListener, QueryList, ViewChildren, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AudioCarouselComponent, AudioSection } from '../../components/audio-carousel/audio-carousel.component';
import { VideoCarouselComponent, VideoSection } from '../../components/video-carousel/video-carousel.component';
import { BBQRecapCarouselComponent, BBQRecapSection } from '../../components/bbq-recap-carousel/bbq-recap-carousel.component';
import { BBQSignupFormComponent } from '../../components/bbq-signup-form/bbq-signup-form.component';
import { ApiService } from '@shared/services/api.service';
import { AlertService } from '@shared/services/alert.service';
import { Config } from '@shared/config';
import { environment } from '@env/environment';
import { AudioPlayerBarComponent } from 'src/app/components/audio-player-bar/audio-player-bar.component';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { Event } from '@shared/models/event';

@Component({
  selector: 'app-bastidbbq',
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    AudioCarouselComponent,
    BBQSignupFormComponent,
    AudioPlayerBarComponent,
    VideoCarouselComponent,
    EventCardComponent,
  ],
  templateUrl: './bastidbbq.component.html',
  styleUrl: './bastidbbq.component.scss',
})
export class BastidBBQComponent implements AfterViewInit {
    showYouTubeOverlay = false;
    youtubeVideoId = 'ZyCh60l7fr4';
    showSignupModal = false;
    upcomingEvents: Event[] = [];
    parallaxOffset = 0;
    imageLoadingState = signal<Record<string, boolean>>({
      signup: true,
      platform: true,
    });
    @ViewChildren('reveal') revealBlocks!: QueryList<ElementRef>;

    ngAfterViewInit(): void {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      this.revealBlocks.forEach((el) => observer.observe(el.nativeElement));
    }
    topGrillinSection: VideoSection = {
      title: 'New in Top Grillin',
      icon: '/img/newintopgrillin.png',
      data: [],
      signUpText: 'Sign up',
      signUpLink: '/join',
    };

    openYouTubeOverlay() {
      console.log('Opening YouTube overlay');
      this.showYouTubeOverlay = true;
    }

    closeYouTubeOverlay() {
      this.showYouTubeOverlay = false;
    }

    openSignupModal() {
      this.showSignupModal = true;
    }

    closeSignupModal() {
      this.showSignupModal = false;
    }

    goToTopGrillin() {
      this.router.navigate(['/topgrillin']);
    }

    onImageLoaded(key: string) {
      this.imageLoadingState.update((state) => ({
        ...state,
        [key]: false,
      }));
    }

    isImageLoading(key: string): boolean {
      return this.imageLoadingState()[key] ?? true;
    }

    @HostListener('window:scroll')
    onWindowScroll() {
      this.parallaxOffset = window.scrollY * 0.2;
    }

    appleMusicSection: AudioSection = {
      title: 'Listen on Apple Music',
      icon: '/img/audiosImg.png',
      backgroundColor: 'bg-[#142129]',
      data: [
      ],
    };

    bbqRecapsSection: BBQRecapSection = {
      title: 'BBQ Recaps',
      icon: '/img/videosImg.png',
      data: [],
    };

    isLoadingMusic: WritableSignal<boolean> = signal(false);
    isLoadingVideo: WritableSignal<boolean> = signal(false);
    isLoadingVideoTop: WritableSignal<boolean> = signal(false);
    isLoadingEvent: WritableSignal<boolean> = signal(false);
    constructor(private apiService: ApiService, private alertService: AlertService, private router: Router,) {
      this.isLoadingMusic.set(true);
      this.isLoadingVideo.set(true);
      this.isLoadingVideoTop.set(true);
      this.isLoadingEvent.set(true);
      if (environment.ismock) {
        this.apiService.getSectionData("audio").subscribe((data) => {
          if (this.appleMusicSection) {
            this.appleMusicSection.data = data?.data?.filter((d: any) => d.category === 'apple');
            this.isLoadingMusic.set(false);
          }
        }, (error) => {
            this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
            this.isLoadingMusic.set(false);
        });

        this.apiService.getSectionData("video").subscribe((data) => {
          this.topGrillinSection.data = data?.data?.filter((video: any) => video.category === 'Top Grillin' && !video.summary);
          this.isLoadingVideoTop.set(false);
        }, (error) => {
            this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
            this.isLoadingVideoTop.set(false);
        });

        this.apiService.getSectionData("event").subscribe((data) => {
          const events = (data?.data || []).slice(0, 5);
          this.upcomingEvents = events.length ? events : this.upcomingEvents;
          this.isLoadingEvent.set(false);
        }, (error) => {
            this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
            this.isLoadingEvent.set(false);
        });

        this.apiService.getSectionData("recap").subscribe((data) => {
          if (this.bbqRecapsSection) {
            this.bbqRecapsSection.data = data?.data?.filter((d: any) => d.category === 'bbq');
            this.isLoadingVideo.set(false);
          }
        }, (error) => {
            this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
            this.isLoadingVideo.set(false);
        });
      } else {
        this.apiService.getData('music', 'apple-music&client=hls&sort=date&dir=desc', '').subscribe((data: any) => {
          this.appleMusicSection.data = data?.data;
          this.isLoadingMusic.set(false);
        }, (error) => {
          this.isLoadingMusic.set(false);
        });

        this.apiService.getData('videos', 'all&client=hls&sort=date&dir=desc&limit=10', '').subscribe((data: any) => {
          this.topGrillinSection.data = data?.data?.slice(0, 10);
          this.isLoadingVideoTop.set(false);
        }, (error) => {
          this.isLoadingVideoTop.set(false);
        });

        this.apiService.getData('videos', 'livestream-house&client=hls&sort=date&dir=desc', '').subscribe((data: any) => {
          this.bbqRecapsSection.data  = data?.data;
          this.isLoadingVideo.set(false);
        }, (error) => {
          this.isLoadingVideo.set(false);
        });

        this.apiService.getData('events', '', '').subscribe((data: any) => {
          const events = (data?.data || []).slice(0, 5);
          this.upcomingEvents = events.length ? events : this.upcomingEvents;
          this.isLoadingEvent.set(false);
        }, (error) => {
          this.isLoadingEvent.set(false);
        });
      }
    }
}
