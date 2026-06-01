import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LegendsApiService } from './legends-api.service';

/**
 * LegendsOnly engagement endpoints — favorites, comments, bookmarks
 * (replaces the MixApps App/Favorites, UpdateFavorites, Comments, UpdateComment,
 * Bookmarks, AddBookmark, DeleteBookmark endpoints).
 *
 * The member is identified by the JWT memberId claim (interceptor attaches the token).
 * Returns the standard envelope: { error, msg, id, data }.
 */
@Injectable({
  providedIn: 'root'
})
export class LegendsEngagementService {
  constructor(private api: LegendsApiService) {}

  // ---- Favorites ----
  getFavorites(section?: string): Observable<any> {
    let params = new HttpParams();
    if (section) { params = params.set('section', section); }
    return this.api.get('/api/favorites', params);
  }

  /** Toggle a favorite. Response id: >0 = added (favId), 0 = removed. */
  toggleFavorite(itemId: number, section: string): Observable<any> {
    return this.api.post('/api/favorites/toggle', { itemId, section });
  }

  // ---- Comments ----
  getComments(itemId: number, section: string = 'videos', dir: string = 'desc'): Observable<any> {
    const params = new HttpParams().set('section', section).set('dir', dir);
    return this.api.get(`/api/comments/${itemId}`, params);
  }

  addComment(payload: { itemId: number; section?: string; comment: string; image?: string }): Observable<any> {
    return this.api.post('/api/comments', payload);
  }

  // ---- Bookmarks ----
  getBookmarks(videoId: number): Observable<any> {
    return this.api.get(`/api/bookmarks/${videoId}`);
  }

  addBookmark(payload: { videoId: number; time: number; title?: string }): Observable<any> {
    return this.api.post('/api/bookmarks', payload);
  }

  deleteBookmark(bookmarkId: number): Observable<any> {
    return this.api.delete(`/api/bookmarks/${bookmarkId}`);
  }

  // ---- View/play logging ----
  /** Log a view/play. contentType: 'videos' | 'music'; action: 'view' | 'play'. */
  logAccess(contentId: number, contentType: string, action: string): Observable<any> {
    return this.api.post('/api/log', { contentId, contentType, action });
  }
}
