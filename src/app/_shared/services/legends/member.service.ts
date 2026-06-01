import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LegendsApiService } from './legends-api.service';

/**
 * LegendsOnly current-member read/update — replaces the MixApps
 * `App/GetMember` (member section) and `App/UpdateMember` endpoints
 * (previously ApiService.getItem('member') / post('UpdateMember', ...)).
 *
 * The member is identified by the JWT `memberId` claim (issued by member login),
 * NOT by an id parameter. The interceptor attaches the Bearer token.
 *
 *   GET /api/member        -> current member record
 *   PUT /api/member        -> update current member's profile fields
 *
 * NOTE: these require the member JWT, so call sites are repointed as part of the
 * coordinated auth cut (token.service switches to storing/sending the JWT).
 */
@Injectable({
  providedIn: 'root'
})
export class LegendsMemberService {
  constructor(private api: LegendsApiService) {}

  /** Member login (replaces MixApps MemberLogin). Returns { token, ...profile }. */
  login(payload: { username: string; password: string }): Observable<any> {
    return this.api.post('/api/member/login', payload);
  }

  /** Free registration (NewMember). Sends a verification email; no login token. */
  register(payload: any): Observable<any> {
    return this.api.post('/api/member/register', payload);
  }

  /** New paid subscription (NewSubscription). Expects a Stripe paymentMethodId. */
  subscribe(payload: any): Observable<any> {
    return this.api.post('/api/member/subscribe', payload);
  }

  /** Re-subscribe an existing (canceled/expired) member (UpdateSubscription). Authed. */
  resubscribe(payload: any): Observable<any> {
    return this.api.post('/api/member/resubscribe', payload);
  }

  getMember(): Observable<any> {
    return this.api.get('/api/member');
  }

  updateMember(payload: any): Observable<any> {
    // The profile form sends sms as 1/0; the API expects a boolean.
    const body = { ...payload, sms: !!payload?.sms };
    return this.api.put('/api/member', body);
  }

  /** Current member's subscription summary. GET /api/member/subscription */
  getSubscription(): Observable<any> {
    return this.api.get('/api/member/subscription');
  }

  /** Cancel the member's subscription (at period end). POST /api/member/subscription/cancel */
  cancelSubscription(): Observable<any> {
    return this.api.post('/api/member/subscription/cancel', {});
  }
}
