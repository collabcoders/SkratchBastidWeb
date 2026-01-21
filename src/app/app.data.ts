import { Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService } from '@shared/services/api.service';
import { Ads } from '@shared/models/ads';
import { Member } from '@shared/models/member';
import { Video } from '@shared/models/video';
import { TokenService } from '@shared/services/token.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@env/environment';

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

    previewMusicId: WritableSignal<number | null> = signal(null);
    shareURL = '';

    user: any;

    isLoggedIn$!: Observable<boolean>;
    isFree = false;
    isLogged = false;
    member!: Member;

    planOpen: WritableSignal<'free' | 'monthly' | 'yearly'> = signal('free');
    pricingOptions: WritableSignal<PricingOption[]> = signal([]);
    monthlyPlanId: WritableSignal<string | null> = signal(null);
    yearlyPlanId: WritableSignal<string | null> = signal(null);
    
    banners: WritableSignal<Ads[]> = signal([]);
    videos: WritableSignal<Video[]> = signal([]);
    videosLive: WritableSignal<Video[]> = signal([]);
    products: WritableSignal<any[]> = signal([]);
    constructor(private token: TokenService, private apiService: ApiService) {
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

        this.loadProductPricing();
    }

    private loadProductPricing(): void {
        this.apiService.getData('ProductPricing', '', `&prodId=${environment.prodId}`, '').subscribe({
            next: (res) => {
                if (!res?.error && Array.isArray(res.data)) {
                    this.pricingOptions.set(res.data);

                    const monthly = res.data.find((item: PricingOption) => /monthly/i.test(item.text));
                    const yearly = res.data.find((item: PricingOption) => /yearly/i.test(item.text));

                    this.monthlyPlanId.set(monthly ? monthly.value : null);
                    this.yearlyPlanId.set(yearly ? yearly.value : null);
                }
            },
            error: (err) => {
                console.error('Failed to load product pricing', err);
            },
        });
    }
}

interface PricingOption {
    value: string;
    text: string;
}

interface PricingResponse {
    error: boolean;
    msg: string;
    id: number;
    data: PricingOption[];
    Errors: Record<string, unknown>;
}
