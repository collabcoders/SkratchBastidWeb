import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
    constructor() {
        this.onFavoritesChanges = new BehaviorSubject(false);
        this.onBeatsChanges = new BehaviorSubject(false);
        this.isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
        this.isMobileDevices = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
}
