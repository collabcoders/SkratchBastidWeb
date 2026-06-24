import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LegendsApiService } from './legends-api.service';

/**
 * LegendsOnly store products feed — replaces the old MixApps product feed
 * (previously ApiService.getSectionData('product')).
 *
 * GET /api/products  (X-App header identifies the tenant; no query params)
 * Returns the standard envelope: { error, msg, id, data } — the curated,
 * order-sorted set of store products to surface on the home carousel.
 */
@Injectable({
  providedIn: 'root'
})
export class LegendsProductsService {
  constructor(private api: LegendsApiService) {}

  getProducts(): Observable<any> {
    return this.api.get('/api/products');
  }
}
