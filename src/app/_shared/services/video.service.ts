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
  favoriteState = new BehaviorSubject<{ itemId: number; favId: number }>({ itemId: 0, favId: 0 });
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
    this.favoriteState.next({ itemId: id, favId: id > 0 ? id : 0 });
  }

  getFavId() {
    return this.favoriteState.asObservable();
  }

  setFavoriteState(itemId: number, favId: number) {
    this.favoriteState.next({ itemId, favId });
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
      favId: video.favId ?? 0,
      hls: video.hls,
      category: video.category
    } as Video;
    this.subject.next(_video);
  }

}
