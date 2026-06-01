import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LegendsApiService } from './legends-api.service';

export interface MusicFeedParams {
  /** Category value, or 'all'/omitted for no filter. */
  category?: string;
  /** Override sort field (default: date). */
  sort?: string;
  /** Override direction (default: desc). */
  dir?: string;
  /** Cap the number of results. */
  limit?: number;
}

/**
 * LegendsOnly Music feed — replaces the MixApps `App/music` feed
 * (previously ApiService.getData('music', ...)).
 *
 * GET /api/music  (X-App header identifies the tenant)
 * Returns the MixApps-compatible envelope: { error, msg, id, data }.
 * Non-hidden tracks, newest first by default; members-only tracks are included
 * when the user is signed in (the interceptor attaches the auth token).
 */
@Injectable({
  providedIn: 'root'
})
export class LegendsMusicService {
  constructor(private api: LegendsApiService) {}

  getMusic(params: MusicFeedParams = {}): Observable<any> {
    let httpParams = new HttpParams();
    if (params.category) { httpParams = httpParams.set('category', params.category); }
    if (params.sort) { httpParams = httpParams.set('sort', params.sort); }
    if (params.dir) { httpParams = httpParams.set('dir', params.dir); }
    if (params.limit != null) { httpParams = httpParams.set('limit', params.limit); }
    return this.api.get('/api/music', httpParams);
  }

  /** Single music record (replaces getItem('music', id)). GET /api/music/{id} */
  getMusicItem(id: number): Observable<any> {
    return this.api.get(`/api/music/${id}`);
  }
}
