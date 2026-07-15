import { computed, Injectable, signal } from '@angular/core';
import { Music } from '@shared/models/music';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { AppData } from 'src/app/app.data';
import { Config } from '@shared/config';
import { environment } from '@env/environment';
import { VideoAccessService } from './video-access.service';
import { LegendsEngagementService } from './legends/engagement.service';

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
  // True while a track is loading and still intends to autoplay. Cleared when a
  // video opens (pause) so a not-yet-started audio load can't start playing
  // over the video after its `loadedmetadata` fires.
  private pendingAutoplay = false;

  // Signals for reactive state management
  currentTrack = signal<Music | null>(null);
  isPlaying = signal<boolean>(false);
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  volume = signal<number>(1);
  isLoading = signal<boolean>(false);
  // True from the moment a download is requested until the server responds and
  // the browser download begins. Drives the "Processing download..." overlay.
  isDownloadProcessing = signal<boolean>(false);

  // Computed values
  progress = computed(() => {
    const dur = this.duration();
    return dur > 0 ? (this.currentTime() / dur) * 100 : 0;
  });

  formattedCurrentTime = computed(() => this.formatTime(this.currentTime()));
  formattedDuration = computed(() => this.formatTime(this.duration()));

  // Equalizer data for visualization
  equalizerData = signal<number[]>([0, 0, 0, 0, 0, 0, 0, 8]);

  playTrack(music: Music, logContentType: string = 'music'): void {
    this.isLoggedIn$?.pipe(take(1)).subscribe(valid => {
      console.log("valid", valid, music)
      if (valid) {
        if (this.currentTrack()?.musicId === music.musicId) {
          this.togglePlayPause();
          return;
        }

        this.stopCurrentTrack();
        this.currentTrack.set(music);
        this.isLoading.set(true);
        this.pendingAutoplay = true;

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
          // A video opened while this track was still loading — don't start
          // playing over it.
          if (!this.pendingAutoplay) {
            this.isLoading.set(false);
            return;
          }
          this.audio!.volume = this.volume();
          this.audio!.muted = false;

          this.audio!.play().then(() => {
            this.isLoading.set(false);
            // If a video opened (pause) between play() and this resolving, don't
            // flip the indicator back to "playing" — that would strand the bar
            // showing playback while the element is actually paused.
            if (!this.pendingAutoplay || !this.audio || this.audio.paused) {
              return;
            }
            this.isPlaying.set(true);
            // Log an audio play (once per track load; best-effort).
            if (music?.musicId) {
              this.legendsEngagement.logAccess(music.musicId, logContentType, 'play').subscribe({ error: () => {} });
            }
          }).catch(err => {
            console.log("Autoplay blocked:", err);
          });
        });
        this.setupAudioListeners();
      } else {
        const hasAccess = this.videoAccessService.checkVideoAccess(true);

        if (!hasAccess) {
          // Dialog will be shown automatically by the service
          return;
        }
        // bootbox.alert('<h4>Membership Only</h4><br>' + 'Sorry, music streaming is reserved for members only.  Please Sign-In or Sign-Up (links are on the top-right) to get access.');
      }
    });
  }

  /**
   * Download a track through the LegendsOnly /api/download endpoint, which
   * fetches the file, renames it (title with underscores), logs the download
   * to logContentAccess, and increments the play/view count.
   *
   * Video audio-versions carry a `mediaRef` (type=video + real videoId +
   * version); ordinary music tracks default to type=audio by their musicId.
   * The request goes through a hidden iframe so the SPA never navigates — the
   * API's Content-Disposition header supplies the downloaded filename.
   */
  downloadTrack(track: Music | null | undefined): void {
    if (!track) { return; }
    const ref = track.mediaRef ?? { type: 'audio' as const, id: track.musicId };
    if (!ref.id) { return; }

    const memberId = this.token.getMember()?.memberId ?? 0;
    const params = new URLSearchParams({
      id: String(ref.id),
      type: ref.type,
      memberId: String(memberId),
      app: Config.app,
    });
    if (ref.version) { params.set('version', ref.version); }

    // Show a "Processing download..." overlay while the server prepares the
    // file (it fetches, renames, logs, and increments the count before the
    // download begins). Clear it when the iframe response arrives (download
    // starting), with a fallback timeout in case a browser suppresses the
    // iframe `load` event for attachment downloads — so it can never stick.
    this.isDownloadProcessing.set(true);
    let settled = false;
    const done = () => {
      if (settled) { return; }
      settled = true;
      this.isDownloadProcessing.set(false);
    };

    const url = `${environment.legendsApi}/api/download?${params.toString()}`;
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.addEventListener('load', done);
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(done, 10000);
    setTimeout(() => iframe.remove(), 60000);
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

  // Pause playback without tearing down the track, so the player bar stays
  // visible (paused). Called when a video opens so audio never overlaps video.
  // Also cancels a still-loading track's pending autoplay.
  pause(): void {
    this.pendingAutoplay = false;
    if (this.audio && this.isPlaying()) {
      this.audio.pause();
      this.isPlaying.set(false);
    }
  }

  stopCurrentTrack(): void {
    this.pendingAutoplay = false;
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
    private videoAccessService: VideoAccessService,
    private legendsEngagement: LegendsEngagementService,
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
    this.isLoggedIn$?.pipe(take(1)).subscribe(valid => {
      console.log("valid", valid, music)
        if (valid) {
      console.log("showPlayer", this.isLoggedIn$);
        if (music.featured > 0) { 
          this.subject.next(music);
          this.loadMusic(music);
        } else if (this.token.getMember().status == 'current' || this.token.getMember().status == 'canceled') {
          this.subject.next(music);
          this.loadMusic(music);
        } else {
          const hasAccess = this.videoAccessService.checkVideoAccess(true);

          if (!hasAccess) {
            // Dialog will be shown automatically by the service
            return;
          }
          // bootbox.alert('<h4>Member VIP Only</h4><br>' + 'Sorry, access to and streaming is reserved for Member VIP subscribers only.  Please click the Upgrade button (link on the top-right) to get access.');
        }
      } else {
          const hasAccess = this.videoAccessService.checkVideoAccess(true);

          if (!hasAccess) {
            // Dialog will be shown automatically by the service
            return;
          }
          // bootbox.alert('<h4>Membership Only</h4><br>' + 'Sorry, VIP access and streaming is reserved for Membership only.  Please Sign-In or Sign-Up (links are on the top-right) to get access.');
      }
    });
  }

  showPlayer(music: Music) {
    console.log("showPlayer", this.isLoggedIn$);
    this.isLoggedIn$?.pipe(take(1)).subscribe(valid => {
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
          const hasAccess = this.videoAccessService.checkVideoAccess(true);

          if (!hasAccess) {
            // Dialog will be shown automatically by the service
            return;
          }
          // bootbox.alert('<h4>Membership VIP Only</h4><br>' + 'Sorry, access to and streaming is reserved for Membership VIP subscribers only.  Please click the Upgrade button (link on the top-right) to get access.');
        }
      } else {
        if (music.featured > 0) { 
          const hasAccess = this.videoAccessService.checkVideoAccess(true);

          if (!hasAccess) {
            // Dialog will be shown automatically by the service
            return;
          }
          // bootbox.alert('<h4>Stream Now</h4><br>' + 'To enjoy this mix, please sign-in or sign-up for free!');
        } else {
          const hasAccess = this.videoAccessService.checkVideoAccess(true);

          if (!hasAccess) {
            // Dialog will be shown automatically by the service
            return;
          }
          // bootbox.alert('<h4>Membership Only</h4><br>' + 'Sorry, VIP access and streaming is reserved for Membership only.  Please Sign-In or Sign-Up (links are on the top-right) to get access.');
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