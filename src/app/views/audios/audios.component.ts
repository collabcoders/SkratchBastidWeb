import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FreeTrialFormComponent } from '../../components/free-trial-form/free-trial-form.component';
import {
  AudioCarouselComponent,
  AudioSection,
} from '../../components/audio-carousel/audio-carousel.component';
import { ApiService } from '@shared/services/api.service';
import { AlertService } from '@shared/services/alert.service';
import { Config } from '@shared/config';

@Component({
  selector: 'app-audios',
  imports: [HeaderComponent, FooterComponent, AudioCarouselComponent, FreeTrialFormComponent],
  templateUrl: './audios.component.html',
  styleUrl: './audios.component.scss',
})
export class AudiosComponent {
  audioSections: AudioSection[] = [
    {
      title: 'Listen on Apple Music',
      icon: '/img/audiosImg.png',
      backgroundColor: 'bg-white',
      data: [
      ],
    },
    {
      title: 'More Mixes',
      icon: '/img/audiosImg.png',
      backgroundColor: 'bg-gray-200',
      decorativeStripes: true,
      data: [],
    },
    {
      title: 'Songs We Listened To A Lot In...',
      icon: '/img/audiosImg.png',
      backgroundColor: 'bg-white',
      data: [
      ],
    },
  ];
  
    constructor(private apiService: ApiService, private alertService: AlertService,) {
      this.apiService.getSectionData("audio").subscribe((data) => {
        const appleSection = this.audioSections.find(section => section.title === 'Listen on Apple Music');
        if (appleSection) {
          appleSection.data = data?.data?.filter((d: any) => d.category === 'apple');
        }

        const mixesSection = this.audioSections.find(section => section.title === 'More Mixes');
        if (mixesSection) {
          mixesSection.data = data?.data?.filter((d: any) => d.category === 'mix');
        }

        const mixcloudSection = this.audioSections.find(section => section.title === 'Songs We Listened To A Lot In...');
        if (mixcloudSection) {
          mixcloudSection.data = data?.data?.filter((d: any) => d.category === 'mixcloud');
        }

        console.log("mixcloudSection", mixcloudSection, mixesSection, appleSection);
      }, (error) => {
          this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
      });
    }
}
