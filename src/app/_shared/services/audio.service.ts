import { Injectable } from '@angular/core';
import { Music } from '@shared/models/music';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { AppData } from 'src/app/app.data';

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

  constructor(private api: ApiService,
    private token: TokenService,
    private appData: AppData,
    ) {
      this.onLoad();
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
        bootbox.alert('<h4>Mag Mob VIP Only</h4><br>' + 'Sorry, access to and streaming is reserved for Mag Mob VIP subscribers only.  Please click the Upgrade button (link on the top-right) to get access.');
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
          bootbox.alert('<h4>Mag Mob VIP Only</h4><br>' + 'Sorry, access to and streaming is reserved for Mag Mob VIP subscribers only.  Please click the Upgrade button (link on the top-right) to get access.');
        }
      } else {
        if (music.featured > 0) { 
          bootbox.alert('<h4>Stream Now</h4><br>' + 'To enjoy this mix, please sign-in or sign-up for free!');
        } else {
          bootbox.alert('<h4>Mag Mob Only</h4><br>' + 'Sorry, VIP access and streaming is reserved for Mag Mob members only.  Please Sign-In or Sign-Up (links are on the top-right) to get access.');
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