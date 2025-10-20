import { Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Music } from '@shared/models/music';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { tap, throttleTime } from 'rxjs/operators';
import { Config } from '@shared/config';
import { ApiService } from '@shared/services/api.service';
import { UtilitiesService } from '@shared/services/utilities.service';
import { AudioService } from '@shared/services/audio.service';
import { FavoriteId } from '@shared/models/favorite-id';
import { AlertService } from '@shared/services/alert.service';
import { TokenService } from '@shared/services/token.service';
import { WaveService } from '@shared/angular-wavesurfer-service-global';
import { ActivatedRoute, Router } from '@angular/router';
import { AppData } from 'src/app/app.data';
import { Location } from '@angular/common';


@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  standalone: false,
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, OnDestroy, OnChanges {
  music: Music | null = null as any;
  // @ViewChild('container', { static: false }) public container!: ElementRef;
  @ViewChild('waveform', { static: false }) public waveform!: ElementRef;

  private waveLoaded = new BehaviorSubject<number>(0);
  waveLoaded$ = this.waveLoaded.asObservable();
  public playerState = new BehaviorSubject<string>('stopped');
  public playerState$ = this.playerState.asObservable();
  public currentTime = new BehaviorSubject<number>(0);
  public currentTime$ = this.currentTime.asObservable();
  public currentFormattedTime = new BehaviorSubject<any>('');
  public currentFormattedTime$ = this.currentFormattedTime.asObservable();
  public currentTimeThrottled$: any;
  wave!: WaveSurfer;
  peaks: any = '';
  totalTime: any;
  audioSubscription!: Subscription;
  play = false;
  processingFav = false;
  alertOptions = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  favoriteId$!: Observable<number>;
  isLoggedIn$!: Observable<boolean>;

  isMobileDevice = false;
  isMobileDevices = false;

  loadFav = false;

  constructor(public api: ApiService,
    public util: UtilitiesService,
    public waveService: WaveService,
    public router: Router,
    public appData: AppData,
    public route: ActivatedRoute,
    public token: TokenService,
    public audioService: AudioService,
    private location: Location,
    public alertService: AlertService
  ) { }
    
  ngOnInit(): void {
    if (!this.isLoggedIn$) this.isLoggedIn$ = this.token.isValid(undefined);
    this.audioService.reset$?.subscribe((i) => {
      if (!i) {
        this.resetPlayer();
      } 
    });
    this.audioService.play$?.subscribe((i) => {
      if (!i) {
        this.audioService.resetPlayer();
      } 
    });
    this.audioService.subject$.subscribe((i) => {
      if (i) {
        this.music = i;
        this.music.genre = 'music';
        this.initMusic(this.music);
      } else {
        this.music = null;
        this.resetPlayer();
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("ngOnChanges", changes?.['music'])
    if (!this.isLoggedIn$) this.isLoggedIn$ = this.token.isValid(undefined);
    if (changes?.['music']?.currentValue?.musicId && changes?.['music']?.currentValue?.musicId != changes?.['music']?.previousValue?.musicId) {
      this.initMusic(changes?.['music']?.currentValue);
    }
  }

  initMusic(selectedMusic: Music) {
    this.loadFav = false;
    this.isMobileDevice = this.appData.isMobileDevice;
    this.isMobileDevices = this.appData.isMobileDevices;
    try {
      (<HTMLElement>document.querySelector('#tidio-chat iframe')).style.visibility = 'hidden';
    } catch (err) {
    }
    this.resetPlayer();
    setTimeout(() => {
      this.loadFav = true;
      this.music = selectedMusic;
      this.favoriteId$ = this.audioService.getFavId();
      this.waveLoaded.next(0);
      this.peaks = '';
      this.wave = this.waveService.create({
        container: '#waveform',
        hideScrollbar: true,
        backend: 'MediaElement',
        waveColor: '#15c0ad',
        progressColor: '#2891b1',
        cursorColor: '#cb034b',
        responsive: true,
        height: this.isMobileDevice ? 60 : 100,
        normalize: true,
      });
      let url = this.music.file;
      if (url.toLocaleLowerCase().indexOf('http') === -1) {
        url = Config.content + this.music.file;
      }
      let fileName = this.music.file.substring(this.music.file.lastIndexOf('/') + 1);
      let pos = fileName.lastIndexOf(".");
      fileName = fileName.substr(0, pos < 0 ? fileName.length : pos) + ".txt";
      this.api.getText(fileName).subscribe(
        data => {
          this.peaks = data;
          this.loadWave(url);
        },
        error => {
          //console.log('oops', error);
          this.peaks = '';
          this.loadWave(url);
        }
      );

      if (this.appData.favorites?.includes((this.music?.musicId))) {
        this.audioService.setFavId(this.music?.musicId);
      }
      console.log("this.audioService.getFavId().getValue()", this.audioService.getFavId().getValue())
      if (this.audioService.getFavId().getValue() > 0) {
        try {
          if (!this.isMobileDevice) document.querySelector<HTMLElement>('#fav-audio-icon')!.style.visibility = 'visible';
          if (this.isMobileDevice) document.querySelector<HTMLElement>('#fav-audio-icon-mobile')!.style.visibility = 'visible';
        } catch (err) {
        }
      } else {
        try {
          if (!this.isMobileDevice) document.querySelector<HTMLElement>('#fav-audio-icon')!.style.visibility = 'hidden';
          if (this.isMobileDevice) document.querySelector<HTMLElement>('#fav-audio-icon-mobile')!.style.visibility = 'hidden';
        } catch (err) {
        }
      }
    }, 500);
  }
  
  loadWave(url: string) {
    if (this.peaks == '') {
      this.wave.load(url);
    } else {
      this.wave.load(url, JSON.parse(this.peaks), 'auto');
    }
    this.generateWaveform();
  }

  formatTime(time: number) {
    return this.util.formatTime(time * 1000, 'HH:mm:ss')
  }

  generateWaveform() {
    this.wave?.setMute(true);
    Promise.resolve(null).then(() => {
      this.wave.on('ready', () => {
        this.wave.setMute(true);
        this.wave['drawBuffer']();
          if (this.appData.checkFromMusic) {
            this.appData.checkFromMusic = false;
            this.wave?.setMute(true);
            this.wave?.backend?.setVolume(0);
            console.log("AUTOPLAY");
            setTimeout(() => {
              this.wave?.pause();
            }, 1000);
            setTimeout(() => {
              if (this.wave) {
                this.playerState.next('paused');
                this.waveLoaded.next(98);
                this.wave?.backend?.setVolume(1);
                this.wave?.setMute(false);
              }
            }, 1000);
          } else {
            this.wave?.setMute(true);
            this.wave.play();
            console.log("AUTOPLAY");
            setTimeout(() => {
              if (this.wave) {
                this.playerState.next('playing');
                this.waveLoaded.next(98);
                this.wave?.setMute(false);
              }
            }, 1000);
          }
      });
      this.wave.on('loading', (x: any, evt: any) => {
        if (x < 96) {
          this.playerState.next('loading');
          this.waveLoaded.next(x);
        }
      });
      this.wave.on('waveform-ready', () => {
        console.log('waveform ready');
        this.wave.setMute(true);
        if (this.peaks == '') {
          let tt = this.wave.backend.getDuration();
          this.peaks = this.wave.backend.getPeaks(tt, 0, tt);
        }
        setTimeout(() => {
          this.waveLoaded.next(100);
        }, 1000);
      });
      this.wave.on('play', () => this.playerState.next('playing'));
      this.wave.on('pause', () => this.playerState.next('paused'));
      this.wave.on('stop', () => this.playerState.next('stopped'));
      this.wave.on('audioprocess', t => {
        this.currentTime.next(t);
        let formattedTime = this.util.formatTime(t * 1000, 'HH:mm:ss') as any;
        this.currentFormattedTime.next(formattedTime);
        let tt = this.wave.getDuration();
        this.totalTime = this.util.formatTime(tt * 1000, 'HH:mm:ss');
      });
      this.currentTimeThrottled$ = this.currentTime$.pipe(
        throttleTime(500),
        tap(console.log)
      );
      this.wave.on('finish', () => this.wave.seekTo(0));
    });
  }

  ngOnDestroy() {
    this.wave.destroy();
    this.audioSubscription.unsubscribe();
  }

  playPause($event?: any) {
    $event?.preventDefault();
    if (this.wave?.backend?.isPaused()) {
      this.wave?.play();
    } else {
      this.wave?.pause();
    }
    console.log(this.playerState?.getValue());
  }


  checkFromMusic() {
    const url =  window.location.href || this.router?.url;
    const idParams = this.route.snapshot.params['id'];
    const matchURL = url?.includes("music");
    if (matchURL && idParams) {
      this.location.replaceState("/");
    }
  }

  previewClose(event: any) {
    this.checkFromMusic();
    event.preventDefault();
    try {
      (<HTMLElement>document.querySelector('#tidio-chat iframe')).style.visibility = 'visible';
    } catch (err) {
    }
    this.resetPlayer();
  }

  resetPlayer() {
    try {
      if (this.waveform && this.waveform?.nativeElement) this.waveform.nativeElement.innerHTML = '';
      this.waveLoaded.next(0);
      this.music = null as any;
      if (this.wave) {
        if (this.wave?.isPlaying()) this.wave?.stop();
        this.wave?.destroy();
      }
    } catch (err) {
      console.log(err);
    }
  }

  errorImage(event: any) {
    const target = event.target || event.srcElement || event.currentTarget;
    let imgElement = new Image();
    imgElement.src = target.src;
    target.src = '/assets/images/audio.png';
    imgElement.onload = null;
  }

  seekTo(event: any, jump: string) {
    event.preventDefault();
    const currentSecs = this.currentTime.value;
    let jumpSecs = currentSecs + 30;
    if (jump == 'back') {
      jumpSecs = currentSecs - 30;
      if (jumpSecs < 0) {
        jumpSecs = 0;
      }
    } else {
      if (jumpSecs > this.wave.getDuration()) {
        jumpSecs = currentSecs;
      }
    }
    this.wave.play(jumpSecs);
  }

  fav(event: any, section: string, id: number) {
    event.preventDefault();
    this.isLoggedIn$.subscribe(valid => {
      if (valid) {
        if (this.token.getMember().status == 'current' || this.token.getMember().status == 'canceled') {
          const _fav = {
            favId: this.audioService.getFavId().getValue(),
            itemId: id,
            section: section
          } as FavoriteId;
          if (!this.processingFav) {
            this.processingFav = true;
            this.api.post('UpdateFavorites?app=' + Config.app, _fav, false, false)
              .subscribe(data => {
                if (data.error) {
                  this.audioService.setFavId(0);
                  this.appData.favorites = this.appData.favorites?.filter((a: any) => a != _fav.itemId);
                  this.favoriteId$ = this.audioService.getFavId();
                  if (this.music) this.music.favId = 0;
                  this.alertService.error('Error', data.msg, this.alertOptions);
                } else {
                  this.audioService.setFavId(data.id);
                  this.favoriteId$ = this.audioService.getFavId();
                  if (this.music) this.music.favId = data.id;
                  if (this.audioService.getFavId().getValue() > 0) {
                    if (!this.isMobileDevice) document.querySelector<HTMLElement>('#fav-audio-icon')!.style.visibility = 'visible';
                    if (this.isMobileDevice) document.querySelector<HTMLElement>('#fav-audio-icon-mobile')!.style.visibility = 'visible';
                    this.alertService.success('Added', data.msg, this.alertOptions);
                    this.appData.favorites.push(_fav.itemId);
                    try {
                      document.querySelector<HTMLElement>('#' + section + '-fav-icon-' + id)!.style.visibility = 'visible';
                    } catch (err) {
                    }
                  } else {
                    if (!this.isMobileDevice) document.querySelector<HTMLElement>('#fav-audio-icon')!.style.visibility = 'hidden';
                    if (this.isMobileDevice) document.querySelector<HTMLElement>('#fav-audio-icon-mobile')!.style.visibility = 'hidden';
                    this.audioService.setFavId(0);
                    this.appData.favorites = this.appData.favorites?.filter((a: any) => a != _fav.itemId);
                    this.favoriteId$ = this.audioService.getFavId();
                    this.alertService.info('Removed', data.msg, this.alertOptions);
                    try {
                      document.querySelector<HTMLElement>('#' + section + '-fav-icon-' + id)!.style.visibility = 'hidden';
                    } catch (err) {
                    }
                  }
                }
                setTimeout(() => {
                  this.processingFav = false;
                }, 1000);
              });
          }
        } else { 
          bootbox.alert('<h4>Mag Mob VIP Only</h4><br>' + 'Sorry, the Favorites feature is reserved for Mag Mob VIP subscribers only. Please click the Upgrade button (link on the top-right) to get access.');
        }
      } else {
        bootbox.alert('<h4>Mag Mob Only</h4><br>' + 'Sorry, the Favorites feature is reserved for Mag Mob members only.  Please Sign-In or Sign-Up (links are on the top-right) to get access.');
      }
    });

  }

  private setting = {
    element: {
      dynamicDownload: null as any
    }
  }

  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);
    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

  getPeaks() {
    return of(this.peaks);
  }

  downloadPeaks($event: any) {
    $event.preventDefault();
    this.getPeaks().subscribe((res: any) => {
      if (this.music) {
        this.dyanmicDownloadByHtmlTag({
          fileName: this.music.file.replace('https://storage.googleapis.com/dj-jazzy-jeff.appspot.com/', '').replace('.m4a', '.txt').replace('.mp3', '.txt'),
          text: JSON.stringify(res)
        });
      }
    });
  }

  openShare(music: Music) {
    console.log("openShare");
    // this.isLoggedIn$.subscribe(valid => {
    //   if (valid) {
        this.appData.shareURL = `https://magmob.skratchbastid.com/DJ?id=${music.musicId}&app=skratchbastid`;
        $('#urlShareSocialMediaModal').modal('show');
    //   } else {
    //     bootbox.alert('<h4>Mag Mob Only</h4><br>' + 'Sorry, the Share feature is reserved for Mag Mob members only.  Please Sign-In or Sign-Up (links are on the top-right) to get access.');
    //   }
    // });
  }
}
