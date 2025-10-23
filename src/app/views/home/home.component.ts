import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { VideoHeroComponent } from '../../components/video-hero/video-hero.component';
import {
  VideoCarouselComponent,
  VideoSection,
} from '../../components/video-carousel/video-carousel.component';
import {
  MixesSliderComponent,
  MixesSection,
} from '../../components/mixes-slider/mixes-slider.component';
import { StoreProductsComponent } from '../../components/store-products/store-products.component';
import { BbqCtaComponent } from '../../components/bbq-cta/bbq-cta.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FreeTrialFormComponent } from '../../components/free-trial-form/free-trial-form.component';
import { ApiService } from '@shared/services/api.service';
import { AlertService } from '@shared/services/alert.service';
import { Config } from '@shared/config';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    VideoHeroComponent,
    VideoCarouselComponent,
    MixesSliderComponent,
    StoreProductsComponent,
    BbqCtaComponent,
    FooterComponent,
    FreeTrialFormComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  // Featured Videos Section (top hero section)
  featuredVideosSection: VideoSection = {
    title: 'Latest Live Sets',
    icon: '/img/videosImg.png',
    data: [],
    signUpText: 'WATCH FREE',
    signUpLink: '/videos',
  };

  // New in Top Grillin Section
  topGrillinSection: VideoSection = {
    title: 'New in Top Grillin',
    icon: '/img/newintopgrillin.png',
    data: [],
    signUpText: 'Sign up',
    signUpLink: '/join',
  };

  // Mixes Section
  mixesSection: MixesSection = {
    title: 'Mixes',
    icon: '/img/latest_mixes.png',
    data: [],
    signUpText: 'Sign up',
    signUpLink: '/join',
  };

  constructor(private apiService: ApiService, private alertService: AlertService,) {
    this.apiService.getSectionData("video").subscribe((data) => {
      this.featuredVideosSection.data = data?.data?.filter((video: any) => video.category === 'Live Sets');
      this.topGrillinSection.data = data?.data?.filter((video: any) => video.category === 'Top Grillin');
    }, (error) => {
        this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
    });
    this.apiService.getSectionData("audio").subscribe((data) => {
      this.mixesSection.data = data?.data?.filter((d: any) => d.category === 'mix');
    }, (error) => {
        this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
    });
  }
}
