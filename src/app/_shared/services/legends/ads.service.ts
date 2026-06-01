import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LegendsApiService } from './legends-api.service';

/**
 * LegendsOnly Ads/banners feed — replaces the MixApps `App/ads` feed
 * (previously ApiService.getData('ads', ...)).
 *
 * GET /api/ads  (X-App header identifies the tenant; no query params)
 * Returns the standard envelope: { error, msg, id, data } — all visible ads,
 * ordered by order then newest.
 */
@Injectable({
  providedIn: 'root'
})
export class LegendsAdsService {
  constructor(private api: LegendsApiService) {}

  getAds(): Observable<any> {
    return this.api.get('/api/ads');
  }
}
