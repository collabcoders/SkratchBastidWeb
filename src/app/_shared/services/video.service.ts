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
    // Pause any playing audio so it never overlaps the video that's opening.
    // Every video-open path (list, carousel, hero, favorites modal) funnels
    // through here, so this is the single place that guarantees no overlap.
    this.audioService.pause();
    const _video = {
      videoId: video.videoId,
      title: video.title,
      source: video.source,
      sourceId: video.sourceId,
      // All three recorded-audio tracks must survive to the modal so it can
      // offer the same No Mic (audio) / With Mic (audio1) chooser as the cards.
      audio: video.audio,
      audio1: video.audio1,
      audio2: video.audio2,
      duration: video.duration,
      featuring: video.featuring,
      image: video.image,
      screenshot: video.screenshot,
      date: video.date,
      favId: video.favId ?? 0,
      hls: video.hls,
      category: video.category
    } as Video;
    this.subject.next(_video);
  }

}
