import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LegendsApiService } from './legends-api.service';

export interface EventFeedParams {
  /** 'current' (upcoming, default), 'expired' (past), or 'all'. */
  status?: string;
  /** Category value, or 'all'/omitted for no filter. */
  category?: string;
  /** Override sort field (default: date). */
  sort?: string;
  /** Override direction (default: asc). */
  dir?: string;
  /** Cap the number of results. */
  limit?: number;
}

/**
 * LegendsOnly Events feed — replaces the MixApps `App/events` feed
 * (previously ApiService.getData('events', ...)).
 *
 * GET /api/events  (X-App header identifies the tenant)
 * Returns the MixApps-compatible envelope: { error, msg, id, data }.
 * Defaults to upcoming (status=current), soonest first.
 */
@Injectable({
  providedIn: 'root'
})
export class LegendsEventsService {
  constructor(private api: LegendsApiService) {}

  getEvents(params: EventFeedParams = {}): Observable<any> {
    let httpParams = new HttpParams();
    if (params.status) { httpParams = httpParams.set('status', params.status); }
    if (params.category) { httpParams = httpParams.set('category', params.category); }
    if (params.sort) { httpParams = httpParams.set('sort', params.sort); }
    if (params.dir) { httpParams = httpParams.set('dir', params.dir); }
    if (params.limit != null) { httpParams = httpParams.set('limit', params.limit); }
    return this.api.get('/api/events', httpParams);
  }
}
