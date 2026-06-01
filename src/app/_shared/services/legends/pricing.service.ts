import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LegendsApiService } from './legends-api.service';

/**
 * LegendsOnly product pricing — replaces the MixApps `App/ProductPricing` feed
 * (previously ApiService.getData('ProductPricing', ...)).
 *
 * GET /api/pricing?prodId=<stripe product>   (X-App header identifies the tenant)
 * Anonymous (shown pre-login). Returns the standard envelope; data is a list of
 * { value: "amount-interval-priceId", text: "$X/Monthly" } from Stripe.
 */
@Injectable({
  providedIn: 'root'
})
export class LegendsPricingService {
  constructor(private api: LegendsApiService) {}

  getProductPricing(prodId: string): Observable<any> {
    const params = new HttpParams().set('prodId', prodId);
    return this.api.get('/api/pricing', params);
  }
}
