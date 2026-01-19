import { Component, input, ElementRef, ViewChild, Signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { Music } from '@shared/models/music';
import { AudioService } from '@shared/services/audio.service';
import { AppData } from 'src/app/app.data';
import { Observable, take } from 'rxjs';
import { TokenService } from '@shared/services/token.service';
import { VideoAccessService } from '@shared/services/video-access.service';

export interface Mix {
  image: string;
  title: string;
  artist: string;
  href: string;
  external?: boolean;
}

export interface MixesSection {
  title: string;
  icon: string;
  data: Music[];
  signUpText?: string;
  signUpLink?: string;
}

@Component({
  selector: 'app-mixes-slider',
  imports: [CommonModule, ImagePipe],
  templateUrl: './mixes-slider.component.html',
  styleUrl: './mixes-slider.component.scss'
})
export class MixesSliderComponent {
  section = input.required<MixesSection>();
  @Input({ required: true }) isLoadingMusic!: Signal<boolean>;


  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  isLoggedIn$!: Observable<boolean>;

  constructor(public appData: AppData, private audioService: AudioService, private token: TokenService, private videoAccessService: VideoAccessService) {
    this.isLoggedIn$ = this.token.isValid(undefined);
  }
  scrollLeft() {
    const container = this.carousel.nativeElement;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }

  scrollRight() {
    const container = this.carousel.nativeElement;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  initMusic(i: Music) {
    console.log("initMusic", i);
    this.isLoggedIn$?.pipe(take(1)).subscribe(valid => {
      if (valid) {
      this.appData.previewMusicId.set(i.musicId);
        this.audioService.showPlayer(i);
      } else {
        const hasAccess = this.videoAccessService.checkVideoAccess(true);

        if (!hasAccess) {
          // Dialog will be shown automatically by the service
          return;
        }
        // bootbox.alert('<h4>Member Only</h4><br>' + 'Sorry, music streaming is reserved for members only.  Please Sign-In or Sign-Up (links are on the top-right) to get access.');
      }
    });
  }

  isAudioFile(url: string): boolean {
    return url?.endsWith('.mp3') || url?.endsWith('.wav') || url?.endsWith('.m4a') || url?.endsWith('.ogg');
  }
  
  playAudio(mix: Music, event: Event): void {
    if ((mix)?.external) {
      return;
    }

    if (this.isAudioFile(mix.file)) {
      event.preventDefault();
      event.stopPropagation();

      // const track: AudioTrack = {
      //   id: mix.file,
      //   title: mix.title || 'Unknown Track',
      //   image: mix.image,
      //   url: mix.file
      // };

      this.audioService.playTrack(mix);
    }
  }

  initMusicFromURL(i: Music) {
    console.log("initMusic", i);
    if ((i)?.external) {
      window.open(i.file || i.url || i.href || i.image, '_blank', 'noopener');
      return;
    }

    const valid = i?.featured > 0;
    if (valid) {
      this.appData.previewMusicId.set(i.musicId);
      if (this.appData.isMobileDevice) {
        console.log("OPEN MODAL");
        // $('#audioModal').modal('show');
      } else {
      }
      this.audioService.showPlayerURL(i);
    } else {
        const hasAccess = this.videoAccessService.checkVideoAccess(true);

        if (!hasAccess) {
          // Dialog will be shown automatically by the service
          return;
        }
        // bootbox.alert('<h4>MMember Only</h4><br>' + 'Sorry, music streaming is reserved for members only.  Please Sign-In or Sign-Up (links are on the top-right) to get access.');
    }
  }

}
