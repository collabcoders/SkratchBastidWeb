import { Component, signal, WritableSignal } from '@angular/core';
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
import { AudioPlayerBarComponent } from 'src/app/components/audio-player-bar/audio-player-bar.component';
import { environment } from '@env/environment';

@Component({
  selector: 'app-audios',
  imports: [HeaderComponent, FooterComponent, AudioCarouselComponent, FreeTrialFormComponent, AudioPlayerBarComponent],
  templateUrl: './audios.component.html',
  styleUrl: './audios.component.scss',
})
export class AudiosComponent {
  audioSections: AudioSection[] = [
    {
      title: 'Listen on Apple Music',
      icon: '/img/audiosImg.png',
      backgroundColor: 'bg-white',
      isLoading: 'isLoadingAppleMusic',
      data: [
      ],
    },
    {
      title: 'More Mixes',
      icon: '/img/audiosImg.png',
      backgroundColor: 'bg-gray-200',
      decorativeStripes: true,
      isLoading: 'isLoadingAppleMusic',
      data: [],
    },
    {
      title: 'Songs We Listened To A Lot In...',
      icon: '/img/audiosImg.png',
      backgroundColor: 'bg-white',
      isLoading: 'isLoadingAppleMusic',
      data: [
      ],
    },
  ];

  isLoadingAppleMusic: WritableSignal<boolean> = signal(false);
  isMixesMusic: WritableSignal<boolean> = signal(false);
  isMixcloudMusic: WritableSignal<boolean> = signal(false);
  constructor(private apiService: ApiService, private alertService: AlertService,) {
    this.isLoadingAppleMusic.set(true);
    this.isMixesMusic.set(true);
    this.isMixcloudMusic.set(true);
    if (environment.ismock) {
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

        this.isLoadingAppleMusic.set(false);
        this.isMixesMusic.set(false);
        this.isMixcloudMusic.set(false);

        console.log("mixcloudSection", mixcloudSection, mixesSection, appleSection);
      }, (error) => {
          this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
          this.isLoadingAppleMusic.set(false);
          this.isMixesMusic.set(false);
          this.isMixcloudMusic.set(false);
      });
    } else {
      this.apiService.getData('music', 'mixes&client=hls&sort=date&dir=desc', '').subscribe((data: any) => {
        const appleSection = this.audioSections.find(section => section.title === 'Listen on Apple Music');
        if (appleSection) {
          appleSection.data = data?.data;
           this.isLoadingAppleMusic.set(false);
        }
      }, (error) => {
           this.isLoadingAppleMusic.set(false);
      });
      this.apiService.getData('music', 'mixes&client=hls&sort=date&dir=desc', '').subscribe((data: any) => {
        const mixesSection = this.audioSections.find(section => section.title === 'More Mixes');
        if (mixesSection) {
          mixesSection.data = data?.data;
          this.isMixesMusic.set(false);
        }
      }, (error) => {
           this.isMixesMusic.set(false);
      });
      this.apiService.getData('music', 'mixes&client=hls&sort=date&dir=desc', '').subscribe((data: any) => {
        const mixcloudSection = this.audioSections.find(section => section.title === 'Songs We Listened To A Lot In...');
        if (mixcloudSection) {
          mixcloudSection.data = data?.data;
          this.isMixcloudMusic.set(false);
        }
      }, (error) => {
           this.isMixcloudMusic.set(false);
      });
    }
  }

  onChange(section: AudioSection) {
    if (section.title === 'Listen on Apple Music') {
      return this.isLoadingAppleMusic;
    } else if (section.title === 'More Mixes') {
      return this.isMixesMusic;
    } else if (section.title === 'Songs We Listened To A Lot In...') {
      return this.isMixcloudMusic;
    } else {
      return this.isMixcloudMusic;
    }
  }
}
