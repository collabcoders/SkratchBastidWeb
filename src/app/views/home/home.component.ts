import { Component, signal, WritableSignal } from '@angular/core';
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
import { environment } from '@env/environment';
import _ from 'lodash';
import { Ads } from '@shared/models/ads';
import { AppData } from 'src/app/app.data';
import { Video } from '@shared/models/video';
import { AudioPlayerBarComponent } from 'src/app/components/audio-player-bar/audio-player-bar.component';
import { mappingFavorites } from '@shared/services/video-access.service';
import { FavoritesService } from '@shared/services/favorites.service';

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
    AudioPlayerBarComponent,
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

  isLoadingMusic: WritableSignal<boolean> = signal(false);
  isLoadingVideo: WritableSignal<boolean> = signal(false);
  isLoadingVideoTop: WritableSignal<boolean> = signal(false);
  isLoadingBanner: WritableSignal<boolean> = signal(false);
  constructor(private apiService: ApiService, private alertService: AlertService, private appData: AppData, private favoritesService: FavoritesService) {
    this.isLoadingMusic.set(true);
    this.isLoadingVideo.set(true);
    this.isLoadingVideoTop.set(true);
    this.isLoadingBanner.set(true);
    if (environment.ismock) {
      this.apiService.getSectionData("video").subscribe((data) => {
        this.featuredVideosSection.data = data?.data?.filter((video: any) => video.category === 'Live Sets' && !video.summary);
        this.topGrillinSection.data = data?.data?.filter((video: any) => video.category === 'Top Grillin' && !video.summary);
        this.isLoadingVideo.set(false);
      }, (error) => {
          this.isLoadingVideo.set(false);
          this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
      });
      this.apiService.getSectionData("audio").subscribe((data) => {
        this.mixesSection.data = data?.data?.filter((d: any) => d.category === 'mix');
        this.isLoadingMusic.set(false);
      }, (error) => {
          this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
          this.isLoadingMusic.set(false);
      });
    } else {
        let filteredItems!: Array<any>;
        filteredItems = [];
        this.apiService.getData('ads', '', '').subscribe((data: any) => {
          let allBanners = data.data as Array<any>;
          allBanners = _.sortBy(allBanners, ['order', 'adId'], ['asc', 'desc']);
          let i = 0;
          allBanners.forEach(item => {
              item = item as Ads;
              item.order = i
              filteredItems.push(item);
              i += 1;
          })
          filteredItems = _.sortBy(filteredItems, ['order']);
          this.appData.banners.set(filteredItems as Ads[]);
          this.isLoadingBanner.set(false);
        },(error) => {
          this.isLoadingBanner.set(false);
        });
        
        this.apiService.getData('videos', 'pop-up&client=hls&sort=date&dir=desc', '').subscribe((data: any) => {
          this.appData.videosLive.set(data.data as Video[]);
          this.featuredVideosSection.data = this.appData.videosLive();
          this.featuredVideosSection.data = mappingFavorites(this.featuredVideosSection.data, this.favoritesService.favorites);
          this.isLoadingVideo.set(false);
        },(error) => {
          this.isLoadingVideo.set(false);
        });
        
        this.apiService.getData('videos', 'all&client=hls&sort=date&dir=desc&limit=10', '').subscribe((data: any) => {
          this.topGrillinSection.data = data?.data?.slice(0, 10);
          this.topGrillinSection.data = mappingFavorites(this.topGrillinSection?.data || [], this.favoritesService.favorites);
          this.isLoadingVideoTop.set(false);
        },(error) => {
          this.isLoadingVideoTop.set(false);
        });

        this.apiService.getData('music', 'mixcloud&client=hls&sort=date&dir=desc', '', '').subscribe((data: any) => {
          this.mixesSection.data = data?.data;
          this.isLoadingMusic.set(false);
        },(error) => {
          this.isLoadingMusic.set(false);
        });
    }
  }
}
