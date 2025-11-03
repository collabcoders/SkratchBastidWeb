import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation, ElementRef, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
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
import { Config } from '@shared/config';

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
  video: Video = null as any;
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
  private player: any;
  isLoadVideo = false;
  isUserBeats = false;

  // Bookmarks
  bookmarkobj: Bookmark = {
    title: '', time: 0, bookmarkId: 0,
    userId: 0,
    memberId: 0,
    videoId: 0,
    featured: 0,
    dateAdded: new Date()
  };
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

  // Related videos
  relatedvideos: any[] = [];


  constructor(private apiService: ApiService, private alertService: AlertService,
    public videoService: VideoService,
    private cdr: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    $('#videoModal').on('hidden.bs.modal', () => {
      console.log("CLOSE a VIDEO");
      this.distroyVideo();
      this.isClose.next(this.video);
    });

    this.videoService.subject.subscribe((i: any) => {
      if (i) {
        console.log("videoService1", i);
        this.video = i;
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
    this.newPlayer();
    setInterval(() => {
      this.newPlayer();
    }, 1000);
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

  distryVideo() {
    var player = videojs('videoPlay');
    player.pause();
  }

  distroyVideo() {
    console.log("distroyVideo", videojs.getPlayers()['videoPlay'])
    if (videojs.getPlayers()['videoPlay']) {
      var player = videojs('videoPlay');
      console.log("player", player);
      if (player) {
        player.pause();
      }
    }
  }

  closeModal() {
    this.distroyVideo();
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

    this.setPlayer(isrel, videoData);
  }

  setPlayer(isrel: boolean, videoData: any) {
    if (!isrel) {
      this.videohls = 'https://player.vimeo.com/external/' + this.video.sourceId + '.m3u8?s=' + this.video.hls;
      if (videojs.getPlayers()[`videoPlay`]) {
        videojs(`videoPlay`).src({
          src: 'https://player.vimeo.com/external/' + videoData.sourceId + '.m3u8?s=' + videoData.hls,
          type: "application/x-mpegURL",
        });
      }
    } else {
      this.videohls = 'https://player.vimeo.com/external/' + this.video.sourceId + '.m3u8?s=' + this.video.hls;
      this.videohls='//vjs.zencdn.net/v/oceans.mp4'
      console.log("videoData", videoData?.sourceId);
      console.log("videoData", videoData?.hls);
      const options = {
        autoplay: true,
        poster: this.videoPoster,
        sources: [{ src: this.videohls, type: 'application/x-mpegURL' }],
        fluid: true,
        children: ['bigPlayButton', 'controlBar']
      };
      videojs(`videoPlay`, options).src({
        src: 'https://player.vimeo.com/external/' + videoData.sourceId + '.m3u8?s=' + videoData.hls,
        type: "application/x-mpegURL"
      });
    }
    setTimeout(() => {
      console.log("REMAINING", videojs(`videoPlay`).remainingTime());
      console.log("DURATION", videojs(`videoPlay`).duration());
      this.cdr.detectChanges();
    }, 1000);
  }

  newPlayer() {
    const player: any = videojs('videoPlay');
    player.on('ready', () => {
      player.play();
    });
    player.on('pause', () => {
      player.bigPlayButton.show();
      const pause = document.getElementsByClassName('vjs-icon-pause');
      if (pause && pause?.length > 0) {
        pause[0].className = 'vjs-play-control vjs-control vjs-button';
      }
    });
    player.on('play', () => {
      player.bigPlayButton.hide();
      const play = document.getElementsByClassName('vjs-play-control');
      if (play && play?.length > 0) {
        play[0].className = 'vjs-icon-pause vjs-control vjs-button';
      }
    });
    player.on('playing', () => {
      player.bigPlayButton.hide();
    });
    player.on('loadedmetadata', () => {

    });
    player.on('timeupdate', () => {
      this.timeUpdate();
    });
    player.on('loadeddata', () => {

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

  showreldetails(item: Video, isrel: boolean) {
    this.timeUpdate(0);
    this.video = Object.assign({}, item);
    this.videoId = item.videoId;
    this.distryVideo();
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

  loadRelatedVideos() {
    // Sample related videos matching the UI
    this.relatedvideos = [ ];

    this.apiService.getSectionData("relatedvideo").subscribe((data) => {
      this.relatedvideos = data?.data;
    }, (error) => {
        this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
    });
  }

  // Load comments for a video
  loadComments(videoId: number) {
    // Sample comments data - replace with actual API call
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
  }

  // Load bookmarks for a video
  loadBookmarks(videoId: number) {
    // Sample bookmarks data - replace with actual API call
    this.bookmarklst = [];

    this.apiService.getSectionData("bookmark").subscribe((data) => {
      this.bookmarklst = data?.data;
    }, (error) => {
        this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
    });
  }

  addupdatebookmark() {
    this.bookmarkobj.time = this.getCurrentTime() || 0;
    this.bookmarkobj.videoId = this.videoId;
    const newBookmark: Bookmark = {
      bookmarkId: Date.now(),
      title: this.bookmarkobj.title,
      time: this.bookmarkobj.time,
      memberId: 1,
      userId: 0,
      videoId: 0,
      featured: 0,
      dateAdded: undefined
    };
    this.bookmarklst.push(newBookmark);
    this.bookmarkobj = { title: '', time: 0, bookmarkId: 0, userId: 0, memberId: 0, videoId: 0, featured: 0, dateAdded: new Date() };
    console.log('Bookmark added:', newBookmark);
  }

  editbookmark(item: any) {
    this.bookmarkobj.time = item;
    this.setCurrentTime(this.bookmarkobj.time);
  }

  deletebookmark() {
    if (this.delbookmarkId) {
      this.bookmarklst = this.bookmarklst.filter(item => item.bookmarkId !== this.delbookmarkId);
      this.delbookmarkId = null;
      console.log('Bookmark deleted');
    }
  }

  addcomment() {
    if (this.commentobj.comment != '' && this.commentobj.comment != undefined && this.commentobj.comment != null) {
      this.commentobj.itemId = this.videoId;
      this.commentobj.memberId = 1;
      this.commentobj.section = 'videos';

      const newComment: Comment = {
        commentId: Date.now(),
        name: 'Current User',
        comment: this.commentobj.comment,
        date: new Date().toISOString(),
        image: 'https://picsum.photos/40/40?random=1',
        memberId: 1,
        userId: 0,
        itemId: 0,
        section: '',
        like: 0
      };
      this.commentlst.unshift(newComment);
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
      console.log('Comment added:', newComment);
    }
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
    this.commentobj.itemId = this.videoId;
    this.commentobj.section = 'videos';
    this.commentobj.comment = data.comment;
    this.commentobj.commentId = data.commentId;
    this.editablecomRow = 0;
    console.log('Comment updated:', data);
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
}
