import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation, ElementRef, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef, AfterViewChecked, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, Observable, take } from 'rxjs';
import { finalize } from 'rxjs/operators';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
// @ts-ignore
import videojsqualityselector from 'videojs-hls-quality-selector';
import { Video } from '@shared/models/video';
import { Bookmark } from '@shared/models/bookmark';
import { VideoService } from '@shared/services/video.service';
import { Comment } from '@shared/models/comment';
import { ApiService } from '@shared/services/api.service';
import { AlertService } from '@shared/services/alert.service';
import { TokenService } from '@shared/services/token.service';
import { Config } from '@shared/config';
import { environment } from '@env/environment';
import { VideoAccessService } from '@shared/services/video-access.service';
import { FavoriteId } from '@shared/models/favorite-id';

declare var $: any;
declare var bootbox: any;

@Component({
  selector: 'app-video-player',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
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
  hoverId = 0;
  classone: string = '';
  videozoom: string = '';
  isFirstTime: boolean = true;
  largescreen: boolean = true;
  videoPoster = '/assets/images/video.png';
  private player: any = null;
  isLoadVideo = false;
  isUserBeats = false;

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


  // Always bind distroyVideo to this instance in the constructor
  constructor(private apiService: ApiService, private alertService: AlertService,
    public videoService: VideoService,
    private token: TokenService,
    private videoAccessService: VideoAccessService,
    private cdr: ChangeDetectorRef) {
      this.distroyVideo = this.distroyVideo.bind(this);
  }
  ngOnInit(): void {
    this.isLoggedIn$ = this.token.isValid(undefined);
    
    this.isLoggedIn$.subscribe(valid => {
      if (valid) {
        const member = this.token.getMember();
        if (member?.beats) {
          this.isUserBeats = true;
        }
      }
    });
    
    $('#videoModal').on('hidden.bs.modal', () => {
      console.log("CLOSE a VIDEO");
      this.distroyVideo();
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
      if (videojs.getPlayers()['videoPlay']) {
        var player = videojs('videoPlay');
        console.log("player", player);
        if (player) {
          player.play();
        }
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
      console.log("distroyVideo", videojs.getPlayers()['videoPlay'])
      if (videojs.getPlayers()['videoPlay']) {
        const player = videojs.getPlayer('videoPlay');
        console.log("player", player);
        if (player  && !player?.isDisposed) {
          player.pause();
          player.dispose();
          console.log("PAUSE")
        }
      }
    } catch(err) {

    }
    try {
      if (this.player && !this.player?.isDisposed_) {
        this.player?.pause();
        this.player?.dispose();
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
    // Clear video source to force reload next time
    if (videojs.getPlayers()['videoPlay']) {
      const player = videojs.getPlayer('videoPlay');
      if (player) {
        player.src('');
      }
    }
    $('#videoModal').modal('hide');
    this.isClose.next(this.video);
  }

  selectedVideo(videoData: any, isrel: boolean, time?: number) {
    this.video = videoData;
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
    const videoElement = document.getElementById('videoPlay') as HTMLVideoElement | null;
    if (!videoElement) {
      console.error('videoPlay element not found');
      return;
    }

    if (this.video) {
      this.distroyVideo();
      const getVideoUrl = (video: Video) => {
        if (video.hls && (video.hls.startsWith('http://') || video.hls.startsWith('https://') || video.hls.includes('.m3u8'))) {
          return video.hls;
        }
        return 'https://player.vimeo.com/external/' + video.sourceId + '.m3u8?s=' + video.hls;
      };
      this.videohls = getVideoUrl(this.video);
      // Remove any existing player instance
     if (videojs.getPlayers()['videoPlay']) {
        const oldPlayer = videojs.getPlayer('videoPlay');
        if (oldPlayer) {
          oldPlayer.dispose();
        }
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
        player.play();
        this.setupPlayerEvents(player);
      });
      setTimeout(() => {
        if (videojs('videoPlay').remainingTime && videojs('videoPlay').duration) {
          console.log("REMAINING", videojs('videoPlay').remainingTime());
          console.log("DURATION", videojs('videoPlay').duration());
        }
        this.cdr.detectChanges();
      }, 1000);
    }
  }

  initializePlayer() {
    const videoElement = document.getElementById('videoPlay');
    if (!videoElement) {
      console.error('Video element not found');
      // Try again after a short delay
      setTimeout(() => {
        this.initializePlayer();
      }, 500);
      return;
    }

    // Don't dispose existing player here, just ensure it exists
    if (!videojs.getPlayers()['videoPlay']) {
      // Initialize new player only if it doesn't exist
      const player = videojs('videoPlay', {
        controls: true,
        fluid: true,
        responsive: true,
        children: ['controlBar'], // Exclude big play button initially
        playbackRates: [0.5, 1, 1.5, 2]
      });

      this.player = player;

      player.ready(() => {
        console.log('Player is ready');
        this.setupPlayerEvents(player);
      });
    } else {
      console.log('Player already exists');
      const existingPlayer = videojs.getPlayer('videoPlay');
      if (existingPlayer) {
        this.player = existingPlayer;
        this.setupPlayerEvents(existingPlayer);
      }
    }
  }

  private getPlayerInstance() {
    if (this.player) {
      return this.player;
    }

    try {
      const existing = videojs.getPlayer('videoPlay');
      if (existing) {
        this.player = existing;
        return existing;
      }
    } catch {}

    try {
      const fallback = (videojs as any)?.players?.videoPlay;
      if (fallback) {
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
    
    player.on('timeupdate', () => {
      this.timeUpdate();
    });
    
    player.on('error', (e: any) => {
      console.error('Video player error:', e);
    });
  }

  timeUpdate(val?: number) {
    const time = document.getElementsByClassName('vjs-remaining-time');
    const duration = document.getElementsByClassName('vjs-remaining-time-display');
    const widthDuration: any = document.getElementsByClassName('vjs-play-progress');
    if (!val) {
      if (time?.length > 0) {
        if (time[time?.length - 1].children?.length > 1) {
          time[time?.length - 1].children[1].setAttribute('class', 'hidden-time');
        }
      }
      if (widthDuration?.length > 0) {
        // const result = (100 - ((videojs(`videoPlay`).remainingTime() / videojs(`videoPlay`)?.duration() || 0) * 100));
        const result = 70
        widthDuration[widthDuration?.length - 1].style.width = result + '%';
      }
      if (duration && duration?.length > 0) {
        var toHHMMSS = (secs: any) => {
          var sec_num = parseInt(secs);
          var hours   = Math.floor(sec_num / 3600)
          var minutes = Math.floor(sec_num / 60) % 60
          var seconds = sec_num % 60

          return [hours,minutes,seconds]
              .map(v => v < 10 ? "0" + v : v)
              .filter((v,i) => v !== "00" || i > 0)
              .join(":")
        }
        duration[duration.length - 1].innerHTML = "" + toHHMMSS(videojs(`videoPlay`).remainingTime());
      }
    } else {
        if (time?.length > 0) {
          if (time[time?.length - 1].children?.length > 1) {
            time[time?.length - 1].children[1].setAttribute('class', 'hidden-time');
          }
        }
        if (widthDuration?.length > 0) {
          widthDuration[widthDuration?.length - 1].style.width = 0 + '%';
        }
        if (duration && duration?.length > 0) {
          duration[duration.length - 1].innerHTML = "" + '00:00:00';
      }
    }
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
      this.apiService.get(`Videos?app=${environment.projectid}&sort=related&category=`+ data.category + '&client=hls' + data.featuring).subscribe(data => {
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
      this.apiService.get(`Videos?app=${environment.projectid}&sort=related&category=` + data.category + '&client=hls' + data.featuring).subscribe(data => {
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
    this.apiService.get('Comments/' + videoId + `?app=${environment.projectid}&category=videos&sort=date&dir=desc`).subscribe(data => {
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
    this.apiService.get('Bookmarks/' + videoId + `?app=${environment.projectid}`, false, false).subscribe({
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
          this.bookmarkobj.time = this.getCurrentTime();
          this.bookmarkobj.memberId = member?.memberId;
          this.bookmarkobj.videoId = this.videoId;

          this.apiService
            .post(`AddBookmark?app=${environment.projectid}`, this.bookmarkobj, false, false)
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
          // bootbox.alert('<h4>VIP Member</h4><br>' + 'Sorry, the Bookmark feature is reserved for Mag Mob members only.  Please Sign-In or Sign-Up (links are on the top-right) to get access.');
        }
      });
  }

  editbookmark(item: any) {
    this.bookmarkobj.time = item;
    this.setCurrentTime(this.bookmarkobj.time);
  }

  deletebookmark() {
    this.apiService.delete('DeleteBookmark/' + this.delbookmarkId + `?app=${environment.projectid}`).subscribe(data => {
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

        this.apiService.post(`UpdateComment?app=${environment.projectid}`, payload, false, false)
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

        this.apiService.post(`UpdateComment?app=${environment.projectid}`, payload, false, false)
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
    let player = videojs('videoPlay');
    player.currentTime(time);
  }

  changetimeformate(time: number) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time - minutes * 60)
    var x = minutes < 10 ? "0" + minutes : minutes;
    var y = seconds < 10 ? "0" + seconds : seconds;
    return x + ":" + y;
  }

  getCurrentTime() {
    let player = videojs('videoPlay');
    return player.currentTime();
  }

  changeTimeFormat(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);
    const x = minutes < 10 ? "0" + minutes : minutes;
    const y = seconds < 10 ? "0" + seconds : seconds;
    return x + ":" + y;
  }

  processingFav = false;
  fav(event: any, video: Video, itemId: number) {
    event?.preventDefault();
    event?.stopPropagation();
    console.log("FAV", itemId, event);
    this.isLoggedIn$.subscribe(valid => {
      if (valid) {
        if (this.token.getMember().status == 'current' || this.token.getMember().status == 'canceled') {
          const fav = {
            favId: video.favId,
            itemId: itemId,
            section: 'video'
          } as FavoriteId;
          if (!this.processingFav) {
            this.processingFav = true;
            this.apiService.post('UpdateFavorites?app=' + Config.app, fav, false, false)
              .subscribe(data => {
                if (data.error) {
                  this.alertService.error('Error', data.msg, this.alertOptions);
                } else {
                  console.log(data.id);
                  if (data.id > 0) {
                    video.favId = data.id;
                    this.alertService.success('Added', data.msg, this.alertOptions);
                  } else {
                    video.favId = 0;
                    this.alertService.info('Removed', data.msg, this.alertOptions);
                  }
                }
                setTimeout(() => {
                  this.processingFav = false;
                }, 1000);
              });
          }
        } else {
          const hasAccess = this.videoAccessService.checkVideoAccess(true);

          if (!hasAccess) {
            // Dialog will be shown automatically by the service
            return;
          }
          // bootbox.alert('<h4>Mag Mob VIP Only</h4><br>' + 'Sorry, the Favorites feature is reserved for Mag Mob VIP subscribers only.  Please click the Upgrade button (link on the top-right) to get access.');
        }
      } else {
        const hasAccess = this.videoAccessService.checkVideoAccess(true);

        if (!hasAccess) {
          // Dialog will be shown automatically by the service
          return;
        }
        // bootbox.alert('<h4>Mag Mob Only</h4><br>' + 'Sorry, the Favorites feature is reserved for Mag Mob members only.  Please Sign-In or Sign-Up (links are on the top-right) to get access.');
      }
    });
  }
}
