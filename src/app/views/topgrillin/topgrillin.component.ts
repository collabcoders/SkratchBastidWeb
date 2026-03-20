import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FreeTrialFormComponent } from '../../components/free-trial-form/free-trial-form.component';
import {
  VideoCarouselComponent,
  VideoSection,
} from '../../components/video-carousel/video-carousel.component';
import { ApiService } from '@shared/services/api.service';
import { AlertService } from '@shared/services/alert.service';
import { Config } from '@shared/config';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { Observable } from 'rxjs';
import { TokenService } from '@shared/services/token.service';
import { Router } from '@angular/router';
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
    FreeTrialFormComponent,
    PaymentSuccessComponent,
  ],
  templateUrl: './topgrillin.component.html',
  styleUrl: './topgrillin.component.scss',
})
export class TopGrillinComponent {
    isAnnual = false;
    imageLoadingState = signal<Record<string, boolean>>({
      heroPrimary: true,
      heroSecondary: true,
      platform: true,
      footer: true,
    });

    vipFeatures = [
      'Stream over 2,000 hours of exclusive DJ sets',
      'VIP-only streams',
      'Full WhatsApp Community Access',
      '10% off entire online store',
      'Pre-sale and first access to new merch drops',
    ];

    platformFeatures = [
      {
        number: '1',
        title: 'Videos',
        description: 'Stream private performances and 500+ hours of archived content.',
      },
      {
        number: '2',
        title: 'Audios',
        description: 'Enjoy exclusive mixes and curated playlists.',
      },
      {
        number: '3',
        title: "Bastid's BBQ",
        description: 'Score discounts and early access to events.',
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
      signUpText: 'Sign up',
      signUpLink: '/join',
      data: []
    };

  isLoggedIn$!: Observable<boolean>;
  isLoadingVideo: WritableSignal<boolean> = signal(true);
    constructor(private apiService: ApiService, private appData: AppData, private favoritesService: FavoritesService, private alertService: AlertService, private token: TokenService, private router: Router) {
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
        this.apiService.getData('videos', 'all&client=hls&sort=date&dir=desc', '').subscribe((data: any) => {
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
      const planId =
        plan === 'monthly'
          ? this.monthlyOption()?.value || this.appData.monthlyPlanId()
          : plan === 'yearly'
            ? this.yearlyOption()?.value || this.appData.yearlyPlanId()
            : 'free';

      this.router.navigate(['/join'], {
        queryParams: {
          id: planId || plan,
        },
      });
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
