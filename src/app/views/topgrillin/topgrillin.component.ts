import { AfterViewInit, Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren, signal, WritableSignal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import {
  VideoCarouselComponent,
  VideoSection,
} from '../../components/video-carousel/video-carousel.component';
import { ApiService } from '@shared/services/api.service';
import { LegendsVideosService } from '@shared/services/legends/videos.service';
import { AlertService } from '@shared/services/alert.service';
import { Config } from '@shared/config';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { Observable } from 'rxjs';
import { TokenService } from '@shared/services/token.service';
import { AppData } from 'src/app/app.data';
import { environment } from '@env/environment';
import { Video } from '@shared/models/video';
import { mappingFavorites } from '@shared/services/video-access.service';
import { FavoritesService } from '@shared/services/favorites.service';

type PricingOption = {
  value: string;
  text: string;
};

@Component({
  selector: 'app-topgrillin',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    VideoCarouselComponent,
    PaymentSuccessComponent,
  ],
  templateUrl: './topgrillin.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './topgrillin.component.scss',
})
export class TopGrillinComponent implements AfterViewInit {
    isAnnual = false;

    parallaxOffset = 0;
    heroOpacity = 1;
    private scrollTicking = false;
    private prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    @ViewChildren('reveal') revealBlocks!: QueryList<ElementRef>;
    @ViewChildren('heroReveal') heroReveals!: QueryList<ElementRef>;
    @ViewChild('heroVideo') heroVideoRef?: ElementRef<HTMLVideoElement>;

    benefits = [
      {
        title: '2,000+ Hours of DJ Sets',
        description: "Stream Skratch Bastid's full archive of exclusive sets, Tuesday Morning Coffee sessions, and pop-up shows.",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>',
      },
      {
        title: 'VIP-Only Live Streams',
        description: 'Members-only broadcasts and intimate virtual performances you won’t catch anywhere else.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>',
      },
      {
        title: 'Full Community Access',
        description: 'Join the private WhatsApp community and connect directly with Bastid and fellow Top Grillers.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>',
      },
      {
        title: '10% Off the Store',
        description: 'A standing discount on everything in the Skratch Bastid online store — records, merch, and more.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>',
      },
      {
        title: 'First Access to Drops',
        description: 'Pre-sale and early access to new music and every merch drop before they go public.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>',
      },
      {
        title: "Bastid's BBQ Perks",
        description: 'Discounts and early access to events, including Skratch’s globally recognized Bastid’s BBQ.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>',
      },
    ];

    pricingFeatures = [
      'Free features.',
      'Stream over 2,000 hours of exclusive DJ sets.',
      'VIP-only streams.',
      'Discord Server.',
      'Pre-sale and first access to new merch drops.',
      '10% off entire online store.',
    ];

    togglePricing() {
      this.isAnnual = !this.isAnnual;
    }

    get currentPrice() {
      const option = this.isAnnual ? this.yearlyOption() : this.monthlyOption();
      const price = this.extractPriceNumber(option?.text);

      if (price) {
        const amount = this.isAnnual ? price / 12 : price;
        return this.formatPrice(amount);
      }

      return this.isAnnual ? '9.99' : '12.99';
    }

    get currentPeriod() {
      return this.isAnnual ? '/month (billed annually)' : '/month';
    }

    /** Percent saved by paying annually vs monthly (0 when unavailable). */
    get annualSavingsPercent(): number {
      const monthly = this.extractPriceNumber(this.monthlyOption()?.text) ?? 12.99;
      const yearly = this.extractPriceNumber(this.yearlyOption()?.text);
      const yearlyPerMonth = yearly ? yearly / 12 : 9.99;
      if (!monthly || yearlyPerMonth >= monthly) return 0;
      return Math.round((1 - yearlyPerMonth / monthly) * 100);
    }

    get signupLink() {
      return this.isAnnual
        ? 'https://wp.skratchbastid.com/register/top-grillin-annual/'
        : 'https://wp.skratchbastid.com/register/top-grillin-monthly/';
    }

    get selectedPlan(): 'monthly' | 'yearly' {
      return this.isAnnual ? 'yearly' : 'monthly';
    }

    videoSection: VideoSection = {
      title: 'New in Top Grillin',
      icon: '/img/newintopgrillin.png',
      signUpText: 'Join Now',
      signUpLink: '/join',
      signUpTargetId: 'topgrillin-pricing-section',
      data: []
    };

  isLoggedIn$!: Observable<boolean>;
  isLoadingVideo: WritableSignal<boolean> = signal(true);

  trustIcon(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

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

    // Hero headline + sub-content reveal on load; per-element transition-delay staggers them.
    requestAnimationFrame(() => {
      this.heroReveals?.forEach((el) => el.nativeElement.classList.add('is-visible'));
    });

    // Sections reveal once they're well into the viewport (bottom 30% excluded),
    // so they fire progressively as you scroll instead of all at once.
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

    const observeAll = () => this.revealBlocks?.forEach((el) => observer.observe(el.nativeElement));
    observeAll();
    // Re-observe when the login state swaps the template content in.
    this.revealBlocks?.changes.subscribe(observeAll);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    // Honour reduced-motion: skip parallax/opacity scroll effects entirely.
    if (this.prefersReducedMotion) return;
    // Throttle to one update per animation frame for smooth parallax.
    if (this.scrollTicking) return;
    this.scrollTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      this.parallaxOffset = y * 0.2;
      this.heroOpacity = Math.max(0, Math.min(1, 1 - y / 700));
      this.scrollTicking = false;
    });
  }

  constructor(private apiService: ApiService, private appData: AppData, private favoritesService: FavoritesService, private alertService: AlertService, private token: TokenService, private legendsVideos: LegendsVideosService, private sanitizer: DomSanitizer) {
      this.isLoadingVideo.set(true);
      if (environment.ismock) {
      this.apiService.getSectionData("video").subscribe((data) => {
        this.videoSection.data = data?.data?.filter((video: any) => video.category === 'Top Grillin');
        this.isLoadingVideo.set(false);
      }, (error) => {
          this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
          this.isLoadingVideo.set(false);
      });
      } else {
        this.legendsVideos.getVideos({ category: 'all' }).subscribe((data: any) => {
          data.data = mappingFavorites(data?.data?.slice(0, 10) || [], this.favoritesService.favorites);
          this.appData.videosLive.set(data.data as Video[]);
          this.videoSection.data = this.appData.videosLive();
          this.isLoadingVideo.set(false);
        },(error) => {
          this.isLoadingVideo.set(false);
        });
      }

      this.isLoggedIn$ = this.token.isValid(undefined);
      this.isLoggedIn$.subscribe((res: boolean) => {
        if (res) {
          if (this.token.getMember().plan == 'free') {
            // this.isFree = true;
          }
        }
      })
    }

    openSignup(plan: 'free' | 'monthly' | 'yearly' = this.selectedPlan) {
      this.appData.planOpen.set(plan);
      this.scrollToPricingSection();
    }

    openSignupModal(event?: Event) {
      event?.preventDefault();
      this.openSignup(this.selectedPlan);
    }

    scrollToPricingSection(event?: Event) {
      event?.preventDefault();
      const target = document.getElementById('topgrillin-pricing-section');
      if (!target) {
        return;
      }

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }

    private monthlyOption(): PricingOption | undefined {
      return this.appData.pricingOptions().find((option) => /monthly/i.test(option.text));
    }

    private yearlyOption(): PricingOption | undefined {
      return this.appData.pricingOptions().find((option) => /yearly/i.test(option.text));
    }

    private extractPriceNumber(text?: string): number | null {
      if (!text) return null;
      const [pricePart] = text.split('/');
      const numeric = (pricePart || '').replace(/[^0-9.]/g, '').trim();
      const value = parseFloat(numeric);
      return Number.isFinite(value) ? value : null;
    }

    private formatPrice(value: number): string {
      return value.toFixed(2).replace(/\.00$/, '');
    }
}
