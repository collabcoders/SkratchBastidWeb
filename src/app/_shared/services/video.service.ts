import { Injectable } from '@angular/core';
import { Video } from '@shared/models/video';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { AudioService } from './audio.service';

@Injectable({
  providedIn: 'root'
})

export class VideoService {
  subject = new Subject<Video>();
  private play = new BehaviorSubject<boolean>(false);
  play$ = this.play.asObservable();
  private reset = new BehaviorSubject<boolean>(false);
  reset$ = this.reset.asObservable();
  favoriteId = new BehaviorSubject<number>(0);
  isLoggedIn$!: Observable<boolean>;

  constructor(private api: ApiService,
    private token: TokenService,
    private audioService: AudioService,
    ) { }

  // enable subscribing to alerts observable
  onLoad(): Observable<Video> {
    this.isLoggedIn$ = this.token.isValid(undefined);
    this.play.next(true);
    return this.subject.asObservable();
  }

  setFavId(id: number) {
    this.favoriteId.next(id);
  }

  getFavId() {
    return this.favoriteId;
  }

  stopVideo() {
    this.reset?.next(true);
  }
 
  showPlayer(video: Video) {
    $('#favoritesModal1').modal('hide');
    this.audioService.resetPlayer();
    const _video = {
      videoId: video.videoId,
      title: video.title,
      source: video.source,
      sourceId: video.sourceId,
      audio1: video.audio1,
      duration: video.duration,
      featuring: video.featuring,
      image: video.image,
      date: video.date,
      favId: 0,
      hls: video.hls,
      category: video.category
    } as Video;
    this.subject.next(_video);
  }

}
