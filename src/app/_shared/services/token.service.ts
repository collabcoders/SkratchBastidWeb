import { Injectable } from '@angular/core';
import { Config } from '@shared/config';
import { Member } from '@shared/models/member';
import { BehaviorSubject } from 'rxjs';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private memberId = new BehaviorSubject<number>(0);

  constructor(private util: UtilitiesService) { }

  get(expireHours: number = 0): any {
    if (expireHours > 0) {
      const setupTime = localStorage.getItem(Config.tokenString + '-time');
      if (setupTime == null || setupTime === undefined) {
        return null;
      }
      const now = new Date().getTime();
      console.log(Config.tokenString + ' setup time:' + (now - +setupTime).toString() + ' - ' + Config.tokenString +
        ' expire time:' + (expireHours * 60 * 60 * 1000).toString());
      if (now - +setupTime > expireHours * 60 * 60 * 1000) {
        return null;
      } else {
        return localStorage.getItem(Config.tokenString);
      }
    } else {
      return localStorage.getItem(Config.tokenString);
    }
  }

  set(data: any) {
    const now = new Date().getTime();
    const setupTime = localStorage.getItem(Config.tokenString + '-time');
    if (setupTime == null || setupTime === undefined) {
      localStorage.setItem(Config.tokenString + '-time', now.toString());
    } else {
      localStorage.removeItem(Config.tokenString + '-time');
      localStorage.setItem(Config.tokenString + '-time', now.toString());
    }
    localStorage.setItem(Config.tokenString, JSON.stringify(data));
  }

  remove(): void {
    try {
      localStorage.removeItem(Config.tokenString);
      localStorage.removeItem(Config.tokenString + '-time');
    } catch (ex) {
    }
  }

  isValid(val?: boolean) {
    if (val == undefined) {
      let valid = true;
      const setupTime = localStorage.getItem(Config.tokenString + '-time');
      if (setupTime == null || setupTime === undefined) {
        valid = false;
        //console.log('no setupTime');
      } else {
        const now = new Date().getTime();
        // console.log(Config.tokenString + ' setup time:' + (now - +setupTime).toString() + ' - ' + Config.tokenString +
        //   ' expire time:' + (Config.expireHours * 60 * 60 * 1000).toString());
        if (now - +setupTime > Config.expireHours * 60 * 60 * 1000) {
          valid = false;
          //console.log('token exp');
        // } else {
        //   try {
        //     let now = new Date();
        //     let today = now.getTime();
        //     let mem = this.getMember();
        //     let renewal = new Date(mem.renewal);
        //     //console.log('mem exp', renewal.getTime() + '-' + today);
        //     if (renewal.getTime() < today) {
        //       valid = false;
        //     }
        //   } catch (err) {
        //     valid = false;
        //   }
        }
      }
      this.loggedIn.next(valid);
      console.log(this.loggedIn.getValue());
      return this.loggedIn;
    } else {
      this.loggedIn.next(val);
      console.log('valid set', this.loggedIn.getValue());
      return this.loggedIn;
    }
  }

  isExpired() {
    const setupTime = localStorage.getItem(Config.tokenString + '-time');
    if (setupTime == null || setupTime === undefined) {
      return true;
      //return null;
    }
    const now = new Date().getTime();
    console.log(Config.tokenString + ' setup time:' + (now - +setupTime).toString() + ' - ' + Config.tokenString +
      ' expire time:' + (Config.expireHours * 60 * 60 * 1000).toString());
    if (now - +setupTime > Config.expireHours * 60 * 60 * 1000) {
      return true;
      //return null;
    } else {
      return false;
      //return localStorage.getItem(Config.tokenString);
    }
  }

  getToken(): string {
    let _token: any = '';
    try {
      if (!this.util.isJsonEmpty(this.getMember())) {
        const cu: Member = this.getMember() as Member;
        _token = cu.token;
      }
      return _token;
    } catch (ex) {
      return '';
    }
  }

  getMember(): Member {
    let currentUser: Member = {} as any;
    try {
      const cu: any = localStorage.getItem(Config.tokenString);
      currentUser = JSON.parse(cu) as Member;
    } catch (err) {
      currentUser = {} as any;
    }
    return currentUser;
  }

  getMemberId() {
    this.memberId.next(this.getMember().memberId);
  }

}
