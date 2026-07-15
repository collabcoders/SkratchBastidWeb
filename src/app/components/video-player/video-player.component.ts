import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation, ElementRef, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef, AfterViewChecked, Input, Output, EventEmitter, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { Subscription, Observable, take } from 'rxjs';
import { finalize } from 'rxjs/operators';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
// @ts-ignore
import videojsqualityselector from 'videojs-hls-quality-selector';
import { Video } from '@shared/models/video';
import { Bookmark } from '@shared/models/bookmark';
import { VideoService } from '@shared/services/video.service';
import { AudioService } from '@shared/services/audio.service';
import { Music } from '@shared/models/music';
import { Comment } from '@shared/models/comment';
import { ApiService } from '@shared/services/api.service';
import { LegendsEngagementService } from '@shared/services/legends/engagement.service';
import { LegendsVideosService } from '@shared/services/legends/videos.service';
import { AlertService } from '@shared/services/alert.service';
import { TokenService } from '@shared/services/token.service';
import { Config } from '@shared/config';
import { environment } from '@env/environment';
import { VideoAccessService } from '@shared/services/video-access.service';
import { FavoriteId } from '@shared/models/favorite-id';
import { TooltipDirective } from '@shared/directives/tooltip.directive';

declare var $: any;
declare var bootbox: any;

@Component({
  selector: 'app-video-player',
  imports: [CommonModule, FormsModule, ImagePipe, TooltipDirective],
  standalone: true,
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges, AfterViewChecked {
    private isAlertOpen = false;
  isLoadingBookmark = signal(false);
  isLoadingRelated = signal(false);
  bookmarkSaving = signal(false);
  commentSaving = signal(false);
  video: Video | null = null;
  @Input() beats: boolean = false;
  @Output("isClose") isClose: EventEmitter<any> = new EventEmitter();
  videoId = 0;
  isLoggedIn$!: Observable<boolean>;
  alertOptions = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  videohls = '';
  videotitle = '';
  videoSubscription!: Subscription;
  memId = -1;
  isAdmin = false;
  hoverId = 0;
  classone: string = '';
  videozoom: string = '';
  isFirstTime: boolean = true;
  largescreen: boolean = true;
  videoPoster = '/assets/images/video-play.png';
  private player: any = null;
  isLoadVideo = false;
  isUserBeats = false;
  private playerInitialized = false;

  // Bookmarks
  bookmarkobj: Bookmark = new Bookmark();
  bookmarklst: Bookmark[] = [];
  delbookmarkId: any;

  // Comments
  commentobj: Comment = {
    comment: '', commentId: 0, itemId: 0, memberId: 0, section: 'videos',
    userId: 0,
    image: '',
    like: 0,
    date: new Date(),
    name: ''
  };
  commentlst: Comment[] = [];
  editablecomRow: number = 0;
  isLoadingComments = signal(false);

  // Related videos
  relatedvideos: Video[] = [];

  private viewReady = false;
  private pendingVideo: { data: Video; isrel: boolean } | null = null;

  @ViewChild('videoEl') videoElementRef!: ElementRef<HTMLVideoElement>;


  // Always bind distroyVideo to this instance in the constructor
  constructor(private apiService: ApiService, private alertService: AlertService,
    public videoService: VideoService,
    private token: TokenService,
    private videoAccessService: VideoAccessService,
    private legendsEngagement: LegendsEngagementService,
    private legendsVideos: LegendsVideosService,
    public audioService: AudioService,
    private cdr: ChangeDetectorRef) {
      this.distroyVideo = this.distroyVideo.bind(this);

      // Whenever the audio service starts playback (the player bar appears and
      // a track begins), pause the modal video so the two don't play over each
      // other. This fires on the real playback start, not just the note click,
      // so it covers the async audio load and any other audio source.
      effect(() => {
        if (this.audioService.isPlaying()) {
          this.pauseVideo();
        }
      });
  }

  // Pause the modal video robustly: through the Video.js handle, and — as a
  // fallback in case that handle is stale/disposed — the raw media element.
  private pauseVideo(): void {
    try {
      const player = this.getPlayerInstance();
      if (player && !player.isDisposed?.() && typeof player.pause === 'function' && !player.paused?.()) {
        player.pause();
      }
    } catch {}
    try {
      const el = document.querySelector('#videoModal video') as HTMLVideoElement | null;
      if (el && !el.paused) {
        el.pause();
      }
    } catch {}
  }

  // Audio version chooser (No Mic / With Mic), mirrors the video list cards.
  // Open only while both audio versions exist and the user taps the note icon.
  showAudioMenu = false;

  // True when the current video has at least one streamable audio track.
  hasAudio(video: Video | null): boolean {
    return !!(video?.audio?.trim() || video?.audio1?.trim());
  }

  // Note-icon click: play directly when one track exists, or open the
  // No Mic / With Mic chooser when both do.
  onAudioNoteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const video = this.video;
    if (!video) return;
    const noMic = video.audio?.trim();
    const withMic = video.audio1?.trim();
    if (noMic && withMic) {
      this.showAudioMenu = !this.showAudioMenu;
    } else if (noMic) {
      this.playAudio(video, noMic, 'No Mic');
    } else if (withMic) {
      this.playAudio(video, withMic, 'With Mic');
    }
  }

  chooseNoMic(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showAudioMenu = false;
    const video = this.video;
    if (video?.audio?.trim()) {
      this.playAudio(video, video.audio.trim(), 'No Mic');
    }
  }

  chooseWithMic(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showAudioMenu = false;
    const video = this.video;
    if (video?.audio1?.trim()) {
      this.playAudio(video, video.audio1.trim(), 'With Mic');
    }
  }

  closeAudioMenu(): void {
    this.showAudioMenu = false;
  }

  // Build a Music track from the video + audio url and hand it to the global
  // player bar. Pauses the video first so audio doesn't play over it.
  private playAudio(video: Video, url: string, label: string): void {
    // Pause immediately for snappy feedback; the audioService effect also
    // pauses once the track actually starts (covers the async audio load).
    this.pauseVideo();

    const title = label ? `${video.title} (${label})` : video.title;
    const poster = video.screenshot || video.image || this.videoPoster;
    const track = new Music(
      video.videoId,            // musicId (unique per card for play/pause toggle)
      video.featuring ?? '',    // artist
      title,                    // title
      '',                       // genre
      video.duration ?? '',     // duration
      poster,                   // image
      url,                      // file
      video.date ?? '',         // date
      '',                       // description
      video.category ?? '',     // category
      0,                        // index
      video.favId ?? 0,         // favId
      1,                        // featured
      '',                       // href
      true,                     // external (url is a full https link)
      url,                      // url
    );
    const a1 = video.audio1?.trim();
    const a2 = video.audio2?.trim();
    track.mediaRef = {
      type: 'video',
      id: video.videoId,
      version: url === a1 ? 'audio1' : url === a2 ? 'audio2' : 'audio',
    };
    this.audioService.playTrack(track, 'video-audio');
  }

  // Start playback, falling back to muted autoplay when the browser blocks
  // autoplay-with-sound. Opening the modal is a user gesture so sound usually
  // succeeds; the muted retry guarantees the video still starts either way.
  private attemptAutoplay(player: any): void {
    if (!player || player.isDisposed?.()) {
      return;
    }
    try {
      const result = player.play();
      if (result && typeof result.catch === 'function') {
        result.catch(() => {
          try {
            player.muted(true);
            const retry = player.play();
            if (retry && typeof retry.catch === 'function') {
              retry.catch(() => {});
            }
          } catch {}
        });
      }
    } catch {}
  }
  ngOnInit(): void {
    this.isLoggedIn$ = this.token.isValid(undefined);
    
    this.isLoggedIn$.subscribe(valid => {
      if (valid) {
        const member = this.token.getMember();
        this.memId = member?.memberId ?? -1;
        this.isAdmin = member?.role === 'admin';
        if (member?.beats) {
          this.isUserBeats = true;
        }
      }
    });
    
    $('#videoModal').on('hidden.bs.modal', () => {
      console.log("CLOSE a VIDEO");
      this.distroyVideo();
      this.cleanupModalArtifacts();
      this.isClose.next(this.video);
    });

    // When any Bootbox modal is closed, also close the video modal
    $(document).on('hidden.bs.modal', function(e: any) {
      if ($(e.target).hasClass('bootbox')) {
        if ($('#videoModal').hasClass('show')) {
          $('#videoModal').modal('hide');
        }
      }
    });

    this.videoService.subject.subscribe((i: any) => {
      if (i) {
        console.log("videoService1", i);
        this.video = i;
        if (!this.isLoggedIn$) this.isLoggedIn$ = this.token.isValid(undefined);
        if (this.isFirstTime) {
          this.showreldetails(this.video, true);
          this.isFirstTime = false;
        } else {
          this.showreldetails(this.video, false);
        }
      }
    });
    this.videoService.reset$.subscribe((i: any) => {
      if (i) {
        this.distroyVideo();
      }
    });
  }

  ngAfterViewInit(): void {
    // Initialize player only once to avoid conflicts
    setTimeout(() => {
      this.initializePlayer();
    }, 100);

    this.viewReady = true;
    if (this.pendingVideo) {
      const { data, isrel } = this.pendingVideo;
      this.pendingVideo = null;
      this.setPlayer(isrel, data);
    }

    const modalEl = document.getElementById('videoModal');
    if (modalEl) {
      modalEl.addEventListener('shown.bs.modal', () => {
        // Ensure player exists when modal opens
        const existing = this.getPlayerInstance();
        if (!existing) {
          this.initializePlayer();
        }

        const player = this.getPlayerInstance();
        if (player && this.videohls) {
          player.src({ src: this.videohls, type: 'application/x-mpegURL' });
          this.attemptAutoplay(player);
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("ngOnChanges", changes?.['video'])
    if (changes?.['video']?.currentValue?.videoId && changes?.['video']?.currentValue?.videoId != changes?.['video']?.previousValue?.videoId) {
      this.video = Object.assign({}, changes['video'].currentValue);
      console.log("this.isFirstTime", this.isFirstTime);
      if (this.isFirstTime) {
        this.showreldetails(this.video, true);
        this.isFirstTime = false;
      } else {
        this.showreldetails(this.video, false);
      }
    }

    if (changes?.['video']?.currentValue?.videoId === changes?.['video']?.previousValue?.videoId) {
      const player = this.getPlayerInstance();
      if (player && !player.isDisposed?.()) {
        this.attemptAutoplay(player);
      }
    }
  }

  ngAfterViewChecked() {
  }

  ngOnDestroy() {
    console.log("ngOnDestroy");
    this.isLoadVideo = false;
    this.distroyVideo();
    if (this.videoSubscription) {
      this.videoSubscription.unsubscribe();
    }
  }

  distroyVideo() {
    console.log("this.player", this.player);
    try {
      const player = this.getPlayerInstance();
      if (player && !player?.isDisposed?.()) {
        player.pause();
        player.currentTime(0);
        player.poster(this.videoPoster);
        console.log("PAUSE")
      }
    } catch(err) {

    }
    try {
      if (this.player && !this.player?.isDisposed_) {
        this.player.pause();
        this.player.currentTime(0);
        this.player.poster(this.videoPoster);
        console.log("PAUSE")
      }
    } catch(err) {

    }
    // const player = this.getPlayerInstance();
    // console.log("distroyVideo player", player);

    // if (player) {
    //   try {
    //     player.pause();
    //   } catch {}
    //   try {
    //     player.dispose();
    //   } catch {}
    //   this.player = null;
    // }

    // // Hard stop and clear the HTML video element to ensure audio does not persist
    // const el = document.getElementById('videoPlay') as HTMLVideoElement | null;
    // if (el) {
    //   try {
    //     el.pause();
    //     el.removeAttribute('src');
    //     el.load();
    //   } catch {
    //   }
    // }
  }

  closeModal() {
    this.distroyVideo();
    // Reset state for next video
    this.videohls = '';
    this.videotitle = '';
    this.videoId = 0;

    const modalEl = document.getElementById('videoModal');
    // Prefer the Bootstrap 5 native API and reuse the existing instance so
    // we don't leave stale backdrops / a frozen white screen behind.
    if (modalEl && typeof (window as any).bootstrap !== 'undefined') {
      const instance = (window as any).bootstrap.Modal.getOrCreateInstance(modalEl);
      instance.hide();
    } else if (typeof $ !== 'undefined' && typeof ($ as any).fn?.modal !== 'undefined') {
      $('#videoModal').modal('hide');
    }

    // Belt-and-suspenders cleanup in case Bootstrap left artifacts behind.
    this.cleanupModalArtifacts();
    this.isClose.next(this.video);
  }

  /**
   * Remove leftover Bootstrap modal artifacts. If multiple Modal instances
   * get created for the same element (older code path) or focus/hidden
   * events race with disposal, the body can end up stuck with the
   * `modal-open` class and one or more `.modal-backdrop` divs covering the
   * page — appearing as a blank white screen after the modal closes.
   */
  private cleanupModalArtifacts() {
    // Defer to next tick so Bootstrap finishes its own cleanup first and we
    // only remove genuinely stale artifacts (no other modal is open).
    setTimeout(() => {
      const anyOpenModal = document.querySelector('.modal.show');
      if (anyOpenModal) {
        return;
      }
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    }, 0);
  }

  selectedVideo(videoData: any, isrel: boolean, time?: number) {
    this.video = videoData;
    // Set the poster to use the video's screenshot while loading
    this.videoPoster = videoData.screenshot || videoData.image || '/assets/images/video-play.png';
    
    // Also set poster directly on the video element if it exists
    setTimeout(() => {
      const videoElement = this.videoElementRef?.nativeElement;
      if (videoElement) {
        videoElement.poster = this.videoPoster;
      }
    }, 100);
    
    console.log("selectedVideo", isrel);
    this.hoverId = 0;
    this.videohls = '';
    this.classone = 'v-small';
    this.videozoom = 'true';
    
    this.isLoggedIn$?.pipe(take(1)).subscribe(valid => {
      // Close any open bootbox dialogs before opening a new one
      if (typeof bootbox !== 'undefined' && $(".bootbox").length > 0) {
        $(".bootbox").modal('hide');
      }
      if (valid) {
        const member = this.token.getMember();
        if (!member.beats && this.beats) {
          this.alertBeats();
          return;
        }
        if (this.token.getMember().status == 'current' || this.token.getMember().status == 'canceled') {
          setTimeout(() => {
            this.setPlayer(isrel, videoData);
          }, 1000);
        } else if (this.beats && member.beats) {
          setTimeout(() => {
            this.setPlayer(isrel, videoData);
          }, 1000);
        } else if (this.beats && !member.beats) {
          this.alertBeats();
          return;
        } else {
          if (this.beats) {
            this.alertBeats();
            return;
          }
          if (!this.isAlertOpen && $(".bootbox").length === 0) {
            const hasAccess = this.videoAccessService.checkVideoAccess(true);

            if (!hasAccess) {
              // Dialog will be shown automatically by the service
              return;
            }
            // this.isAlertOpen = true;
            // bootbox.alert('<h4>VIP Member Only</h4><br>' + 'Sorry, access to MHP episodes are reserved for VIP Member subscribers only.  Please click the Upgrade button (link on the top-right) to get access.', () => {
            //   this.isAlertOpen = false;
            // });
          }
        }
      } else {
        if (this.beats) {
          this.alertBeats();
          return;
        }
        if (!this.isAlertOpen && $(".bootbox").length === 0) {
          // this.isAlertOpen = true;
          // bootbox.alert('<h4>VIP Member Only</h4><br>' + 'Sorry, access to MHP episodes are reserved for VIP Member members only.  Please Sign-In or Sign-Up (links are on the top-right) to get access.', () => {
          //   this.isAlertOpen = false;
          // });

          const hasAccess = this.videoAccessService.checkVideoAccess(true);

          if (!hasAccess) {
            // Dialog will be shown automatically by the service
            return;
          }
        }
      }
    });
  }

  setPlayer(isrel: boolean, videoData: Video) {
    const videoElement = this.videoElementRef?.nativeElement;
    if (!videoElement || !this.viewReady) {
      this.pendingVideo = { data: videoData, isrel };
      return;
    }

    if (this.video) {
      this.distroyVideo();
      this.videohls = this.resolveHlsUrl(this.video);
      const existing = this.getPlayerInstance();
      if (existing && !existing.isDisposed?.()) {
        this.player = existing;
        existing.src({ src: this.videohls, type: 'application/x-mpegURL' });
        this.attemptAutoplay(existing);
        if (!this.playerInitialized) {
          this.setupPlayerEvents(existing);
          this.playerInitialized = true;
        }
        return;
      }

      // Always create a new player with autoplay true
      const options = {
        autoplay: true,
        poster: this.videoPoster,
        sources: [{ src: this.videohls, type: 'application/x-mpegURL' }],
        fluid: true,
        children: ['bigPlayButton', 'controlBar']
      };
      const player = videojs(videoElement, options);
      this.player = player;
      player.src({
        src: this.videohls,
        type: 'application/x-mpegURL'
      });
      player.ready(() => {
        // Force set the poster to ensure screenshot shows
        player.poster(this.videoPoster);
        this.attemptAutoplay(player);
        if (!this.playerInitialized) {
          this.setupPlayerEvents(player);
          this.playerInitialized = true;
        }
      });
      setTimeout(() => {
        const active = this.getPlayerInstance();
        if (active && !active.isDisposed?.() && active.remainingTime && active.duration) {
          console.log("REMAINING", active.remainingTime());
          console.log("DURATION", active.duration());
        }
        this.cdr.detectChanges();
      }, 1000);
    }
  }

  initializePlayer() {
    const videoElement = this.videoElementRef?.nativeElement;
    if (!videoElement) {
      return;
    }

    // Don't dispose existing player here, just ensure it exists
    if (!videojs.getPlayers()['videoPlay']) {
      // Initialize new player only if it doesn't exist
      const player = videojs(videoElement, {
        controls: true,
        fluid: true,
        responsive: true,
        children: ['controlBar'], // Exclude big play button initially
        playbackRates: [0.5, 1, 1.5, 2]
      });

      this.player = player;

      player.ready(() => {
        console.log('Player is ready');
        if (!this.playerInitialized) {
          this.setupPlayerEvents(player);
          this.playerInitialized = true;
        }
      });
    } else {
      console.log('Player already exists');
      const existingPlayer = videojs.getPlayer('videoPlay');
      if (existingPlayer) {
        this.player = existingPlayer;
        if (!this.playerInitialized) {
          this.setupPlayerEvents(existingPlayer);
          this.playerInitialized = true;
        }
      }
    }
  }

  private getPlayerInstance() {
    if (this.player) {
      if (this.player.isDisposed?.()) {
        this.player = null;
        this.playerInitialized = false;
      } else {
        return this.player;
      }
    }

    try {
      const existing = videojs.getPlayer('videoPlay');
      if (existing && !existing.isDisposed?.()) {
        this.player = existing;
        return existing;
      }
    } catch {}

    try {
      const fallback = (videojs as any)?.players?.videoPlay;
      if (fallback && !fallback.isDisposed?.()) {
        this.player = fallback;
        return fallback;
      }
    } catch {}

    return null;
  }

  setupPlayerEvents(player: any) {
    // Initially hide big play button
    if (player.bigPlayButton) {
      player.bigPlayButton.hide();
    }
    
    player.on('loadedmetadata', () => {
      // Show big play button only after video metadata is loaded
      if (player.bigPlayButton && player.paused()) {
        player.bigPlayButton.show();
      }
      // Log a video view (once per load; best-effort).
      if (this.videoId) {
        this.legendsEngagement.logAccess(this.videoId, 'videos', 'view').subscribe({ error: () => {} });
      }
    });
    
    player.on('pause', () => {
      if (player.bigPlayButton) {
        player.bigPlayButton.show();
      }
      const pause = document.getElementsByClassName('vjs-icon-pause');
      if (pause && pause?.length > 0) {
        pause[0].className = 'vjs-play-control vjs-control vjs-button';
      }
    });
    
    player.on('play', () => {
      if (player.bigPlayButton) {
        player.bigPlayButton.hide();
      }
      const play = document.getElementsByClassName('vjs-play-control');
      if (play && play?.length > 0) {
        play[0].className = 'vjs-icon-pause vjs-control vjs-button';
      }
    });
    
    player.on('playing', () => {
      if (player.bigPlayButton) {
        player.bigPlayButton.hide();
      }
    });
    
    player.on('error', (e: any) => {
      const src = typeof player?.currentSrc === 'function' ? player.currentSrc() : this.videohls;
      const detail = typeof player?.error === 'function' ? player.error() : undefined;
      console.error('Video player error:', e, 'detail:', detail, 'source:', src);
    });
  }

  timeUpdate(val?: number) {
    // No-op: allow native Video.js controls to manage progress/duration
  }

  showreldetails(item: Video | null, isrel: boolean) {
    this.timeUpdate(0);
    if (item) {
      this.video = Object.assign({}, item);
      this.videoId = item.videoId;
      this.distroyVideo();
      setTimeout(() => {
        this.selectedVideo(this.video, isrel);
      }, 100);

      this.relatedvideos = [];
      this.videotitle = item.title;
      this.loadComments(item.videoId);
      this.loadBookmarks(item.videoId);
      this.loadRelatedVideos();
      $('#videoModal').scrollTop(0);
    }
  }

  showScreenshot(event: any, screenshot: string) {
    const target = event.target || event.srcElement || event.currentTarget;
    target.src = screenshot;
  }

  showGif(event: any, video: Video) {
    const target = event.target || event.srcElement || event.currentTarget;
    target.src = video.image;
  }

  checkImage(event: any, video: Video) {
    const target = event.target || event.srcElement || event.currentTarget;
    let imgElement = new Image();
    imgElement.src = target.src;
    imgElement.addEventListener('load', () => {
      if (video.source == 'vimeo' && imgElement.naturalHeight === 480 && imgElement.naturalWidth === 640) {
        target.src = this.videoPoster;
        imgElement.onload = null;
      }
      if (video.source == 'youtube' && imgElement.naturalHeight === 90 && imgElement.naturalWidth === 120) {
        target.src = this.videoPoster;
        imgElement.onload = null;
      }
    });
    imgElement.addEventListener('error', () => {
      target.src = this.videoPoster;
      imgElement.onload = null;
    });
  }

  errorImage(event: any, video: Video) {
    const target = event.target || event.srcElement || event.currentTarget;
    let imgElement = new Image();
    imgElement.src = target.src;
    target.src = target.src = this.videoPoster;
    imgElement.onload = null;
  }

  // Comment author avatar: fall back to the default user image when the member
  // has no profile photo or the thumbnail fails to load.
  avatarError(event: any) {
    const target = event.target || event.srcElement || event.currentTarget;
    const fallback = 'assets/images/user.png';
    if (!target.src.endsWith(fallback)) {
      target.src = fallback;
    }
  }

  ChangeVideoSize() {
    this.largescreen = !this.largescreen;
  }

  alertBeats() {
    const hasAccess = this.videoAccessService.checkVideoAccess(true);

    if (!hasAccess) {
      // Dialog will be shown automatically by the service
      return;
    }
    // bootbox.alert('<h4>Get The Course</h4><br>' + 'To purchase the entire the Beat Making Course, please click the "GET THE COURSE" button. Thank you.');
  }

  loadRelatedVideos() {
    this.isLoadingRelated.set(true);
    if (environment.ismock) {
    // Sample related videos matching the UI
      this.relatedvideos = [ ];

      this.apiService.getSectionData("relatedvideo").subscribe((data) => {
        this.relatedvideos = data?.data;
        this.isLoadingRelated.set(false);
      }, (error) => {
          this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
          this.isLoadingRelated.set(false);
      });
    } else {
      this.getrealtedvideos(this.video);
    }
  }

  getrealtedvideos(data: any) {
    console.log("getrealtedvideos", this.beats);
    if (!this.beats) {
      this.legendsVideos.getVideos({ category: data.category, sort: 'related', featuring: data.featuring }).subscribe(data => {
        try {
          if (data) {
            if (data._http != 200) {
              this.relatedvideos = data.data;
              console.log("getrealtedvideos", data.data);
              this.isLoadingRelated.set(false);
            }
          }
        } catch {
        }
      });
    } else {
      this.legendsVideos.getVideos({ category: data.category, sort: 'related', featuring: data.featuring }).subscribe(data => {
        try {
          if (data) {
            if (data._http != 200) {
              this.relatedvideos = data.data;
              console.log("getrealtedvideos", data.data);
             this.isLoadingRelated.set(false);
            }
          }
        } catch {
        }
      });
    }
  }

  // Load comments for a video
  loadComments(videoId: number) {
    this.isLoadingComments.set(true);
    if (environment.ismock) {
      // Use mock data
      this.commentlst = [
        {
          commentId: 1,
          name: 'John Doe',
          comment: 'Great video! Love the technique shown here.',
          date: new Date().toISOString(),
          image: 'https://picsum.photos/40/40?random=1',
          memberId: 1,
          userId: 0,
          itemId: 0,
          section: '',
          like: 0
        },
        {
          commentId: 2,
          name: 'Jane Smith',
          comment: 'This tutorial really helped me understand the basics.',
          date: new Date(Date.now() - 86400000).toISOString(),
          image: 'https://picsum.photos/40/40?random=1',
          memberId: 2,
          userId: 0,
          itemId: 0,
          section: '',
          like: 0
        }
      ];
      this.isLoadingComments.set(false);
    } else {
      this.getcomment(videoId);
    }
  }

  getcomment(videoId: number) {
    this.isLoadingComments.set(true);
    this.legendsEngagement.getComments(videoId, 'videos', 'desc').subscribe(data => {
      try {
        if (data) {
          this.commentobj.comment = '';
          this.commentlst = data.data;
        }
      } catch {
      }
      this.isLoadingComments.set(false);
    }, () => {
      this.isLoadingComments.set(false);
    });
  }

  // Load bookmarks for a video
  loadBookmarks(videoId: number) {
    if (environment.ismock) {
      this.bookmarklst = [];
      this.isLoadingBookmark.set(false);

      this.isLoadingBookmark.set(true);
      this.bookmarklst = [];
      this.apiService.getSectionData("bookmark").subscribe({
        next: (data) => {
          this.bookmarklst = data?.data;
          this.isLoadingBookmark.set(false);
        },
        error: (error) => {
          this.isLoadingBookmark.set(false);
          this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
        }
      });
      return;
    } else {
        this.getbookmarks(videoId);
    }
  }
  getbookmarks(videoId: number) {
    if ((environment as any).ismocl) {
      this.bookmarklst = [];
      this.isLoadingBookmark.set(false);
      return;
    }
    this.isLoadingBookmark.set(true);
    this.legendsEngagement.getBookmarks(videoId).subscribe({
      next: data => {
        try {
          if (data) {
            this.bookmarklst = data.data;
          }
        } catch {}
        this.isLoadingBookmark.set(false);
      },
      error: () => {
        this.isLoadingBookmark.set(false);
      }
    });
  }
  
  addupdatebookmark() {
    if (this.bookmarkSaving()) {
      return;
    }

    this.bookmarkSaving.set(true);

    this.isLoggedIn$
      .pipe(take(1))
      .subscribe(valid => {
        if (valid) {
          const member = this.token.getMember();
          console.log("member", member);
          this.bookmarkobj.time = this.getCurrentTime();
          this.bookmarkobj.memberId = member?.memberId;
          this.bookmarkobj.userId = member?.memberId;
          this.bookmarkobj.videoId = this.videoId;

          this.legendsEngagement
            .addBookmark({ videoId: this.videoId, time: this.bookmarkobj.time, title: this.bookmarkobj.title })
            .pipe(finalize(() => this.bookmarkSaving.set(false)))
            .subscribe(data => {
              try {
                if (data) {
                  this.bookmarkobj = new Bookmark();
                  this.getbookmarks(this.videoId);
                  this.selectedVideo(this.video, false);
                }
              } catch {}
            }, () => {
              this.bookmarkSaving.set(false);
            });
        } else {
          this.bookmarkSaving.set(false);
          const hasAccess = this.videoAccessService.checkVideoAccess(true);

          if (!hasAccess) {
            // Dialog will be shown automatically by the service
            return;
          }
          // bootbox.alert('<h4>VIP Member</h4><br>' + 'Sorry, the Bookmark feature is reserved for members only.  Please Sign-In or Sign-Up (links are on the top-right) to get access.');
        }
      });
  }

  editbookmark(item: any) {
    this.bookmarkobj.time = item;
    this.setCurrentTime(this.bookmarkobj.time);
  }

  deletebookmark() {
    this.legendsEngagement.deleteBookmark(this.delbookmarkId).subscribe(data => {
      try {
        if (data) {
          this.bookmarkobj = new Bookmark();
          this.getbookmarks(this.videoId);
          this.selectedVideo(this.video, false);
        }
      } catch {
      }
    });
  }

  addcomment() {
    const text = (this.commentobj.comment || '').trim();
    if (!text) {
      return;
    }

    if (this.commentSaving()) {
      return;
    }

    this.commentSaving.set(true);

    this.isLoggedIn$
      .pipe(take(1))
      .subscribe(valid => {
        if (!valid) {
          const hasAccess = this.videoAccessService.checkVideoAccess(true);
          if (!hasAccess) {
            this.commentSaving.set(false);
            return;
          }
          this.commentSaving.set(false);
          return;
        }

        const member = this.token.getMember();
        const payload: Comment = {
          commentId: 0,
          userId: 0,
          memberId: member?.memberId || 0,
          itemId: this.videoId,
          section: 'videos',
          comment: text,
          image: member?.image || '',
          name: member?.alias || `${member?.firstName || ''} ${member?.lastName || ''}`.trim(),
          like: 0,
          date: new Date().toISOString(),
        };

        this.legendsEngagement.addComment(payload)
          .pipe(finalize(() => this.commentSaving.set(false)))
          .subscribe({
            next: () => {
              this.commentobj = {
                comment: '',
                commentId: 0,
                itemId: 0,
                memberId: 0,
                section: 'videos',
                userId: 0,
                image: '',
                like: 0,
                date: new Date(),
                name: ''
              };
              this.loadComments(this.videoId);
            },
            error: (error) => {
              this.alertService.error('', error?.error?.message || error?.message || 'Unable to add comment.', Config.alertOptions);
            }
          });
      });
  }

  EditComment(id: any) {
    if (this.editablecomRow == 0) {
      this.editablecomRow = id;
    }
    else if (this.editablecomRow != id) {
      this.editablecomRow = id;
    }
    else {
      this.editablecomRow = 0;
    }
  }

  deleteComment(commentId: any) {
    this.commentlst = this.commentlst.filter(comment => comment.commentId !== commentId);
    console.log('Comment deleted:', commentId);
  }

  updatecomment(data: any) {
    const text = (data?.comment || '').trim();
    if (!text) {
      return;
    }

    if (this.commentSaving()) {
      return;
    }

    this.commentSaving.set(true);

    this.isLoggedIn$
      .pipe(take(1))
      .subscribe(valid => {
        if (!valid) {
          this.commentSaving.set(false);
          const hasAccess = this.videoAccessService.checkVideoAccess(true);
          if (!hasAccess) {
            return;
          }
          return;
        }

        const member = this.token.getMember();
        const payload: Comment = {
          commentId: data.commentId,
          userId: 0,
          memberId: member?.memberId || 0,
          itemId: this.videoId,
          section: 'videos',
          comment: text,
          image: member?.image || '',
          name: member?.alias || `${member?.firstName || ''} ${member?.lastName || ''}`.trim(),
          like: data.like || 0,
          date: new Date().toISOString(),
        };

        this.legendsEngagement.addComment(payload)
          .pipe(finalize(() => this.commentSaving.set(false)))
          .subscribe({
            next: () => {
              this.editablecomRow = 0;
              this.loadComments(this.videoId);
            },
            error: (error) => {
              this.alertService.error('', error?.error?.message || error?.message || 'Unable to update comment.', Config.alertOptions);
            }
          });
      });
  }

  setCurrentTime(time: number) {
    const player = this.getPlayerInstance();
    if (player && !player.isDisposed?.()) {
      player.currentTime(time);
    }
  }

  changetimeformate(time: number) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time - minutes * 60)
    var x = minutes < 10 ? "0" + minutes : minutes;
    var y = seconds < 10 ? "0" + seconds : seconds;
    return x + ":" + y;
  }

  getCurrentTime() {
    const player = this.getPlayerInstance();
    if (player && !player.isDisposed?.()) {
      return player.currentTime();
    }
    return 0;
  }

  changeTimeFormat(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);
    const x = minutes < 10 ? "0" + minutes : minutes;
    const y = seconds < 10 ? "0" + seconds : seconds;
    return x + ":" + y;
  }

  private resolveHlsUrl(video: Video): string {
    if (!video) {
      return '';
    }

    const decoded = this.decodeHls(video.hls);

    if (decoded && (decoded.startsWith('http://') || decoded.startsWith('https://') || decoded.includes('.m3u8'))) {
      return decoded;
    }

    const signature = encodeURIComponent(decoded || '');
    const sourceId = encodeURIComponent(video.sourceId || '');
    return sourceId ? `https://player.vimeo.com/external/${sourceId}.m3u8?s=${signature}` : '';
  }

  private decodeHls(hls?: string): string {
    if (!hls) {
      return '';
    }
    const unescaped = hls.replace(/&amp;/g, '&');
    try {
      return decodeURIComponent(unescaped);
    } catch {
      return unescaped;
    }
  }

  processingFav = false;
  fav(event: any, video: Video, itemId: number) {
    // Only respond to deliberate clicks
    if (!event || event.type !== 'click') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    console.log("FAV1", itemId, event);
    if (this.processingFav) {
      return;
    }

    this.processingFav = true;

    this.isLoggedIn$.pipe(take(1)).subscribe(valid => {
      if (valid) {
        if (this.token.getMember().status == 'current' || this.token.getMember().status == 'canceled') {
          const fav = {
            favId: video.favId,
            itemId: itemId,
            section: 'video'
          } as FavoriteId;
          this.legendsEngagement.toggleFavorite(fav.itemId, fav.section)
            .subscribe(data => {
              console.log("FAV1", data);
              if (data.error) {
                this.alertService.error('Error', data.msg, this.alertOptions);
              } else {
                console.log(data.id);
                if (data.id > 0) {
                  video.favId = data.id;
                  this.alertService.success('Favorites', 'Media added to your Favorites.', this.alertOptions);
                  console.log("Media Added");
                  this.videoService.setFavoriteState(itemId, data.id);
                } else {
                  video.favId = 0;
                  this.alertService.info('Favorites', 'Removed from Favorites.', this.alertOptions);
                  this.videoService.setFavoriteState(itemId, 0);
                }
              }
              setTimeout(() => {
                this.processingFav = false;
              }, 500);
            }, () => {
              this.processingFav = false;
            });
        } else {
          const hasAccess = this.videoAccessService.checkVideoAccess(true);

          if (!hasAccess) {
            // Dialog will be shown automatically by the service
            return;
          }
          // bootbox.alert('<h4>VIP Only</h4><br>' + 'Sorry, the Favorites feature is reserved for VIP subscribers only.  Please click the Upgrade button (link on the top-right) to get access.');
        }
      } else {
        const hasAccess = this.videoAccessService.checkVideoAccess(true);

        if (!hasAccess) {
          // Dialog will be shown automatically by the service
          return;
        }
        // bootbox.alert('<h4>Members Only</h4><br>' + 'Sorry, the Favorites feature is reserved for members only.  Please Sign-In or Sign-Up (links are on the top-right) to get access.');
      }
      setTimeout(() => {
        this.processingFav = false;
      }, 500);
    });
  }
}
