import { Injectable } from '@angular/core';
import { Member } from '@shared/models/member';
import { TokenService } from '@shared/services/token.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AppData {
    loginFromBeats = false;
    onFavoritesChanges: BehaviorSubject<any>;
    onBeatsChanges: BehaviorSubject<any>;

    favorites: any = [];
    checkFromMusic = false;

    isMobileDevice = false;
    isMobileDevices = false;

    shareURL = '';

    user: any;

    isLoggedIn$!: Observable<boolean>;
    isFree = false;
    isLogged = false;
    member!: Member;
    
    constructor(private token: TokenService,) {
        this.onFavoritesChanges = new BehaviorSubject(false);
        this.onBeatsChanges = new BehaviorSubject(false);
        this.isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
        this.isMobileDevices = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        this.isLoggedIn$ = this.token.isValid(undefined);
            this.isLoggedIn$.subscribe((res: boolean) => {
            if (res) {
                const member = this.token.getMember();
                this.member = member;
                this.isLogged = true;
                if (member.plan == 'free') {
                    this.isFree = true;
                }
            }
        })
    }
}
