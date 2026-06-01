import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LegendsApiService } from './legends-api.service';

/**
 * LegendsOnly Categories feed — replaces the MixApps `App/categories` feed
 * (previously ApiService.getData('categories', section, ...)).
 *
 * GET /api/categories/{section}   (X-App header identifies the tenant)
 * Returns the standard envelope: { error, msg, id, data }, where data is a list
 * of { value, name, subTitle, description }.
 */
@Injectable({
  providedIn: 'root'
})
export class LegendsCategoriesService {
  constructor(private api: LegendsApiService) {}

  getCategories(section: string): Observable<any> {
    return this.api.get(`/api/categories/${section}`);
  }
}
