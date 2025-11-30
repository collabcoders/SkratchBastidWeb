import { computed, Injectable, signal } from '@angular/core';
import { Music } from '@shared/models/music';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { AppData } from 'src/app/app.data';
import { Config } from '@shared/config';

// export interface AudioTrack {
//   id: string;
//   title: string;
//   image: string;
//   url: string;
// }

@Injectable({
  providedIn: 'root'
})

export class AudioService {
  private subject = new Subject<Music | null>();
  private play = new BehaviorSubject<boolean>(false);
  private reset = new BehaviorSubject<boolean>(false);
  reset$ = this.reset.asObservable();
  play$ = this.play.asObservable();
  subject$ = this.subject.asObservable();
  favoriteId = new BehaviorSubject<number>(0);
  isLoggedIn$!: Observable<boolean>;

  private audio: HTMLAudioElement | null = null;

  // Signals for reactive state management
  currentTrack = signal<Music | null>(null);
  isPlaying = signal<boolean>(false);
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  volume = signal<number>(1);
  isLoading = signal<boolean>(false);

  // Computed values
  progress = computed(() => {
    const dur = this.duration();
    return dur > 0 ? (this.currentTime() / dur) * 100 : 0;
  });

  formattedCurrentTime = computed(() => this.formatTime(this.currentTime()));
  formattedDuration = computed(() => this.formatTime(this.duration()));

  // Equalizer data for visualization
  equalizerData = signal<number[]>([0, 0, 0, 0, 0, 0, 0, 8]);

  playTrack(music: Music): void {
    if (this.currentTrack()?.musicId === music.musicId) {
      this.togglePlayPause();
      return;
    }

    this.stopCurrentTrack();
    this.currentTrack.set(music);
    this.isLoading.set(true);

    let url = music.file;
    if (url.toLocaleLowerCase().indexOf('http') === -1) {
      url = Config.content + music.file;
    }
    let fileName = music.file.substring(music.file.lastIndexOf('/') + 1);
    let pos = fileName.lastIndexOf(".");
    fileName = fileName.substr(0, pos < 0 ? fileName.length : pos) + ".txt";
      this.api.getText(fileName).subscribe((data) => {
        console.log("Got text file", data);
      }
    );
      
    console.log("url", url);
    this.audio = new Audio(url);
    setTimeout(() => {
      if (this.audio) {
        this.audio.volume = this.volume(); // Ensure volume is set
        this.audio.muted = false; // Explicitly unmute
        console.log('Audio volume:', this.audio.volume, 'Muted:', this.audio.muted);
      }
    }, 500);

    this.audio.addEventListener('loadedmetadata', () => {
      this.audio!.volume = this.volume();
      this.audio!.muted = false;

      this.audio!.play().then(() => {
        this.isPlaying.set(true);
        this.isLoading.set(false);
      }).catch(err => {
        console.log("Autoplay blocked:", err);
      });
    });
    this.setupAudioListeners();
  }

  togglePlayPause(): void {
    if (!this.audio) return;

    if (this.isPlaying()) {
      this.audio.pause();
      this.isPlaying.set(false);
    } else {
      this.audio.play().then(() => {
        this.isPlaying.set(true);
      });
    }
  }

  stopCurrentTrack(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    this.currentTrack.set(null);
    this.isPlaying.set(false);
    this.currentTime.set(0);
    this.duration.set(0);
    this.isLoading.set(false);
  }

  seekTo(percentage: number): void {
    if (this.audio && this.duration() > 0) {
      const newTime = (percentage / 100) * this.duration();
      this.audio.currentTime = newTime;
      this.currentTime.set(newTime);
    }
  }

  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
      this.volume.set(this.audio.volume);
    }
  }

  private setupAudioListeners(): void {
    if (!this.audio) return;

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio) {
        this.duration.set(this.audio.duration);
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        this.currentTime.set(this.audio.currentTime);
      }
    });

    this.audio.addEventListener('ended', () => {
      this.stopCurrentTrack();
    });

    this.audio.addEventListener('error', () => {
      this.isLoading.set(false);
      this.stopCurrentTrack();
    });
  }

  private formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private startEqualizerAnimation(): void {
    setInterval(() => {
      if (this.isPlaying()) {
        const newData = Array.from({ length: 8 }, () =>
          Math.random() * 40 + 10
        );
        this.equalizerData.set(newData);
      } else {
        this.equalizerData.set([0, 0, 0, 0, 0, 0, 0, 0]);
      }
    }, 150);
  }

  constructor(private api: ApiService,
    private token: TokenService,
    private appData: AppData,
    ) {
      this.onLoad();
      this.startEqualizerAnimation();
    }

  // enable subscribing to alerts observable
  onLoad(): Observable<Music | null> {
    this.isLoggedIn$ = this.token.isValid(undefined);
    this.play.next(true);
    return this.subject?.asObservable();
  }

  setFavId(id: number) {
    this.favoriteId.next(id);
  }

  getFavId() {
    return this.favoriteId;
  }
 
  resetPlayer() {
    this.reset.next(true);
  }

  showPlayerURL(music: Music) {
    console.log("showPlayer", this.isLoggedIn$);
      if (music.featured > 0) { 
        this.subject.next(music);
        this.loadMusic(music);
      } else if (this.token.getMember().status == 'current' || this.token.getMember().status == 'canceled') {
        this.subject.next(music);
        this.loadMusic(music);
      } else {
        bootbox.alert('<h4>Member VIP Only</h4><br>' + 'Sorry, access to and streaming is reserved for Member VIP subscribers only.  Please click the Upgrade button (link on the top-right) to get access.');
      }
  }

  showPlayer(music: Music) {
    console.log("showPlayer", this.isLoggedIn$);
    this.isLoggedIn$.subscribe(valid => {
      console.log("valid", valid, music)
      if (valid) {
        if (music.featured > 0) { 
          if (this.appData.isMobileDevice) {
            // $('#audioModal').modal('show');
          }
          this.subject.next(music);
          this.loadMusic(music);
        } else if (this.token.getMember().status == 'current' || this.token.getMember().status == 'canceled') {
          if (this.appData.isMobileDevice) {
            // $('#audioModal').modal('show');
          }
          this.subject.next(music);
          this.loadMusic(music);
        } else {
          bootbox.alert('<h4>Membership VIP Only</h4><br>' + 'Sorry, access to and streaming is reserved for Membership VIP subscribers only.  Please click the Upgrade button (link on the top-right) to get access.');
        }
      } else {
        if (music.featured > 0) { 
          bootbox.alert('<h4>Stream Now</h4><br>' + 'To enjoy this mix, please sign-in or sign-up for free!');
        } else {
          bootbox.alert('<h4>Membership Only</h4><br>' + 'Sorry, VIP access and streaming is reserved for Membership only.  Please Sign-In or Sign-Up (links are on the top-right) to get access.');
        }
      }
    });
  }

  stopMusic() {
    this.subject.next(null);
    this.play.next(false);
  }

  loadMusic(music: Music) {
    this.play.next(true);
  }
}