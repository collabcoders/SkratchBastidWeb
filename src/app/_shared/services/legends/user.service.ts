import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LegendsApiService } from './legends-api.service';

/**
 * LegendsOnly app-owner profile / livestream config — replaces the MixApps
 * `App/GetUser` endpoint (previously ApiService.getItem('user')).
 *
 * GET /api/user  (X-App header identifies the tenant)
 * Returns the standard envelope: { error, msg, id, data }, where data holds
 * the app profile (hlsUrl, chatUrl, memberChatUrl, etc.).
 */
@Injectable({
  providedIn: 'root'
})
export class LegendsUserService {
  constructor(private api: LegendsApiService) {}

  getUser(): Observable<any> {
    return this.api.get('/api/user');
  }
}
