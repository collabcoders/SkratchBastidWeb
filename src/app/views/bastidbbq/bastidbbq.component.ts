import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AudioCarouselComponent, AudioSection } from '../../components/audio-carousel/audio-carousel.component';
import { BBQRecapCarouselComponent, BBQRecapSection } from '../../components/bbq-recap-carousel/bbq-recap-carousel.component';
import { BBQSignupFormComponent } from '../../components/bbq-signup-form/bbq-signup-form.component';
import { ApiService } from '@shared/services/api.service';
import { AlertService } from '@shared/services/alert.service';
import { Config } from '@shared/config';
import { environment } from '@env/environment';
import { AudioPlayerBarComponent } from 'src/app/components/audio-player-bar/audio-player-bar.component';

@Component({
  selector: 'app-bastidbbq',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    AudioCarouselComponent,
    BBQRecapCarouselComponent,
    BBQSignupFormComponent,
    AudioPlayerBarComponent,
  ],
  templateUrl: './bastidbbq.component.html',
  styleUrl: './bastidbbq.component.scss',
})
export class BastidBBQComponent {
    showYouTubeOverlay = false;
    youtubeVideoId = 'ZyCh60l7fr4';

    openYouTubeOverlay() {
      console.log('Opening YouTube overlay');
      this.showYouTubeOverlay = true;
    }

    closeYouTubeOverlay() {
      this.showYouTubeOverlay = false;
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
    constructor(private apiService: ApiService, private alertService: AlertService,) {
      this.isLoadingMusic.set(true);
      this.isLoadingVideo.set(true);
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
        this.apiService.getData('music', 'mixes&client=hls&sort=date&dir=desc', '').subscribe((data: any) => {
          this.appleMusicSection.data = data?.data;
          this.isLoadingMusic.set(false);
        }, (error) => {
          this.isLoadingMusic.set(false);
        });
        this.apiService.getData('videos', 'livestream-house&client=hls&sort=date&dir=desc', '').subscribe((data: any) => {
          this.bbqRecapsSection.data  = data?.data;
          this.isLoadingVideo.set(false);
        }, (error) => {
          this.isLoadingVideo.set(false);
        });
      }
    }
}