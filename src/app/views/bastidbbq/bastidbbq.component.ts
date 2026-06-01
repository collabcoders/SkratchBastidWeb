import { AfterViewInit, Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AudioCarouselComponent, AudioSection } from '../../components/audio-carousel/audio-carousel.component';
import { VideoCarouselComponent, VideoSection } from '../../components/video-carousel/video-carousel.component';
import { BBQRecapCarouselComponent, BBQRecapSection } from '../../components/bbq-recap-carousel/bbq-recap-carousel.component';
import { BBQSignupFormComponent } from '../../components/bbq-signup-form/bbq-signup-form.component';
import { ApiService } from '@shared/services/api.service';
import { LegendsVideosService } from '@shared/services/legends/videos.service';
import { LegendsMusicService } from '@shared/services/legends/music.service';
import { LegendsEventsService } from '@shared/services/legends/events.service';
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
    upcomingEvents: Event[] = [];

    // Bastid's BBQ 2026 tour dates — matches skratchbastid.live/bastidsbbq.
    // TODO: set the real per-event ticket URLs (Dice FM / Ticketmaster) and promo images.
    tourDates = [
      { city: 'Calgary',   date: 'July 4',    venue: 'Whiskey Rose',               address: '1012 17 Ave SW',     time: '3PM–11PM', ticketUrl: 'https://dice.fm/partner/tickets/event/v3d6gl-bastids-bbq-calgary-26-4th-jul-whiskey-rose-calgary-tickets?dice_id=9027424&dice_channel=web&dice_tags=organic&dice_campaign=First+Things+First+Entertainment+Inc.+&dice_feature=mio_marketing&utm_campaign=CALGARY+-+WEBSITE&utm_medium=organic&utm_source=bastidsbbq-website&_branch_match_id=1542931506660977838&_branch_referrer=H4sIAAAAAAAAAx3KyQrCMBRA0a%2Bxuw5YoUEI0pYiBVcqiKuS4bV9aJL6ktCd3%2B6wuJvDnUNY%2FD7Pn2gfmUYF2WjyvmKlLHZMs6o8xGAGJcwicLK8rU%2FH%2BnzfbIv0261rLv21S36LAY3RcEeTsKj%2B5F0kBVwKH1B7KV%2FpCtJjgORNMAIR2mmQ5FYPxNuZnIEPeCUtCY8AAAA%3D', image: '/assets/images/bbq/bbq_cal.jpg' },
      { city: 'Vancouver', date: 'July 19',   venue: 'City Center Artists Lodge',  address: '62 W 4th Ave',       time: '3PM–10PM', ticketUrl: 'https://dice.fm/partner/tickets/event/53ld7d-bastids-bbq-vancouver-26-19th-jul-city-center-artist-lodge-vancouver-tickets?dice_id=9027398&dice_channel=web&dice_tags=organic&dice_campaign=First+Things+First+Entertainment+Inc.+&dice_feature=mio_marketing&utm_campaign=VANCOUVER+-+WEBSITE&utm_medium=organic&utm_source=bastidsbbq-website&_branch_match_id=1542931506660977838&_branch_referrer=H4sIAAAAAAAAAx3KuwrCMBSA4aexW5uiUEEIoqWDi4KXOpZcTtKDJqknCd18di%2FDv3z8Y0pT3DD2RP%2BoNCqojGOjNmq1roXRTbPNyQ1KuEmg9bzfHdvTre%2FOi2Vdfrt3%2B8vh2hW%2FyYHG7HggKzyqP8WQSQGXIibUUcpXOYOMmKB4ExggQm8HSWGOQLwdKTj4AFkRSaaRAAAA', image: '/assets/images/bbq/bbq_van.jpg' },
      { city: 'Toronto',   date: 'July 25',   venue: 'Harbourfront Stage',         address: '235 Queens Quay W',  time: '2PM–10PM', ticketUrl: 'https://www.ticketmaster.ca/event/100064A18A8471F4?utm_source=bastidsbbq-website&utm_medium=organic&utm_campaign=TORONTO+-+WEBSITE', image: '/assets/images/bbq/bbq_tor.jpg' },
      { city: 'New York',  date: 'August 8',  venue: 'The Seaport',                address: '19 Fulton St',       time: '3PM–10PM', ticketUrl: 'https://dice.fm/partner/tickets/event/yoek7r-bastids-bbq-new-york-26-8th-aug-the-seaport-new-york-city-tickets?dice_id=9064959&dice_channel=web&dice_tags=organic&dice_campaign=First+Things+First+Entertainment+Inc.+&dice_feature=mio_marketing&utm_campaign=NEW+YORK+-+WEBSITE&utm_medium=organic&utm_source=bastidsbbq-website&_branch_match_id=1542931506660977838&_branch_referrer=H4sIAAAAAAAAAx2KywrCMBAAv8be%2BrBoESEIlR5EUVCheCp5bNpFk9RNQm9%2Bu9XDMDDMEMLot3n%2BQvvMFErItMlPel2sSg2balntYjCd5Gbk2Ft2btpFWTwu1%2BOsdKZt6tvh3iS%2Fy4DCaJijnluU%2F%2BRdJAlMcB9QeSHe6QTCY4DkQ6CBCG3fCXKTB2L7gZyBL0Q8tTuSAAAA', image: '/assets/images/bbq/bbq_ny.jpg' },
    ];
    parallaxOffset = 0;
    heroOpacity = 1;
    private scrollTicking = false;
    imageLoadingState = signal<Record<string, boolean>>({});
    @ViewChildren('reveal') revealBlocks!: QueryList<ElementRef>;
    @ViewChildren('heroReveal') heroReveals!: QueryList<ElementRef>;
    @ViewChild('heroVideo') heroVideoRef?: ElementRef<HTMLVideoElement>;

    ngAfterViewInit(): void {
      // Force muted autoplay — Angular only sets the `muted` attribute, not the
      // property, so Chrome's autoplay policy blocks playback on a fresh load.
      const video = this.heroVideoRef?.nativeElement;
      if (video) {
        video.muted = true;
        const tryPlay = () => video.play().catch(() => {});
        tryPlay();
        video.addEventListener('canplay', tryPlay, { once: true });
      }

      // Hero titles reveal on load — their per-line transition-delay (1000ms+)
      // staggers them, so the first appears ~1s in.
      requestAnimationFrame(() => {
        this.heroReveals?.forEach((el) => el.nativeElement.classList.add('is-visible'));
      });

      // Sections reveal only once they're well into the viewport (bottom 30%
      // excluded), so on this short page they fire progressively as you scroll
      // instead of all at once.
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: '0px 0px -30% 0px' }
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
      // Throttle to one update per animation frame for smooth parallax.
      if (this.scrollTicking) return;
      this.scrollTicking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        this.parallaxOffset = y * 0.2;
        // Fade the hero content as it scrolls away.
        this.heroOpacity = Math.max(0, Math.min(1, 1 - y / 700));
        this.scrollTicking = false;
      });
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
    constructor(private apiService: ApiService, private alertService: AlertService, private router: Router, private legendsVideos: LegendsVideosService, private legendsMusic: LegendsMusicService, private legendsEvents: LegendsEventsService) {
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
        this.legendsMusic.getMusic({ category: 'apple-music' }).subscribe((data: any) => {
          this.appleMusicSection.data = data?.data;
          this.isLoadingMusic.set(false);
        }, (error) => {
          this.isLoadingMusic.set(false);
        });

        this.legendsVideos.getVideos({ category: 'all', limit: 10 }).subscribe((data: any) => {
          this.topGrillinSection.data = data?.data?.slice(0, 10);
          this.isLoadingVideoTop.set(false);
        }, (error) => {
          this.isLoadingVideoTop.set(false);
        });

        this.legendsVideos.getVideos({ category: 'livestream-house' }).subscribe((data: any) => {
          this.bbqRecapsSection.data  = data?.data;
          this.isLoadingVideo.set(false);
        }, (error) => {
          this.isLoadingVideo.set(false);
        });

        this.legendsEvents.getEvents().subscribe((data: any) => {
          const events = (data?.data || []).slice(0, 5);
          this.upcomingEvents = events.length ? events : this.upcomingEvents;
          this.isLoadingEvent.set(false);
        }, (error) => {
          this.isLoadingEvent.set(false);
        });
      }
    }
}
