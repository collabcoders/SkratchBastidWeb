import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AudioCarouselComponent, AudioSection } from '../../components/audio-carousel/audio-carousel.component';
import { BBQRecapCarouselComponent, BBQRecapSection } from '../../components/bbq-recap-carousel/bbq-recap-carousel.component';
import { BBQSignupFormComponent } from '../../components/bbq-signup-form/bbq-signup-form.component';
import { ApiService } from '@shared/services/api.service';
import { AlertService } from '@shared/services/alert.service';
import { Config } from '@shared/config';

@Component({
  selector: 'app-bastidbbq',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    AudioCarouselComponent,
    BBQRecapCarouselComponent,
    BBQSignupFormComponent,
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

    constructor(private apiService: ApiService, private alertService: AlertService,) {
      this.apiService.getSectionData("audio").subscribe((data) => {
        if (this.appleMusicSection) {
          this.appleMusicSection.data = data?.data?.filter((d: any) => d.category === 'apple');
        }
      }, (error) => {
          this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
      });

      this.apiService.getSectionData("recap").subscribe((data) => {
        if (this.bbqRecapsSection) {
          this.bbqRecapsSection.data = data?.data?.filter((d: any) => d.category === 'bbq');
        }
      }, (error) => {
          this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
      });
    }
}