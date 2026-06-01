import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LegendsApiService } from './legends-api.service';

export interface VideoFeedParams {
  /** Category value, or 'all'/omitted for no filter. 'featured' is a virtual category. */
  category?: string;
  /** Override sort field (default: date). */
  sort?: string;
  /** Override direction (default: desc). */
  dir?: string;
  /** Cap the number of results. */
  limit?: number;
  /** For sort=related: comma-separated featured-artist names to prefer. */
  featuring?: string;
}

/**
 * LegendsOnly Videos feed — replaces the MixApps `App/videos` feed
 * (previously ApiService.getData('videos', ...)).
 *
 * GET /api/videos  (X-App header identifies the tenant)
 * Returns the MixApps-compatible envelope: { error, msg, id, data }.
 * HLS-ready, non-hidden videos only; newest first by default.
 */
@Injectable({
  providedIn: 'root'
})
export class LegendsVideosService {
  constructor(private api: LegendsApiService) {}

  getVideos(params: VideoFeedParams = {}): Observable<any> {
    let httpParams = new HttpParams();
    if (params.category) { httpParams = httpParams.set('category', params.category); }
    if (params.sort) { httpParams = httpParams.set('sort', params.sort); }
    if (params.dir) { httpParams = httpParams.set('dir', params.dir); }
    if (params.limit != null) { httpParams = httpParams.set('limit', params.limit); }
    if (params.featuring) { httpParams = httpParams.set('featuring', params.featuring); }
    return this.api.get('/api/videos', httpParams);
  }

  /** Single video record (replaces getItem('videos', id)). GET /api/videos/{id} */
  getVideo(id: number): Observable<any> {
    return this.api.get(`/api/videos/${id}`);
  }
}
