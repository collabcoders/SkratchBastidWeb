import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LegendsApiService } from './legends-api.service';

/**
 * LegendsOnly contact form submission — replaces the MixApps `App/Contact`
 * endpoint (previously ApiService.post('Contact?app=...', ...)).
 *
 * Tenant is sent via the X-App header by LegendsApiService.
 *
 *   POST /api/contact -> emails the form to the app's support recipient
 */
@Injectable({
  providedIn: 'root'
})
export class LegendsContactService {
  constructor(private api: LegendsApiService) {}

  send(payload: {
    name: string;
    phone: string;
    email: string;
    topic: string;
    subject: string;
    message: string;
  }): Observable<any> {
    return this.api.post('/api/contact', payload);
  }
}
