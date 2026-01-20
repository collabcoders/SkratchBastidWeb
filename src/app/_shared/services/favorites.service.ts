import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Favorite } from '@shared/models/favorite';
import { ApiService } from './api.service';
import { environment } from '@env/environment';
import { Config } from '@shared/config';
import { FavoriteId } from '@shared/models/favorite-id';
import { AlertService } from './alert.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private isModalVisibleSubject = new BehaviorSubject<boolean>(false);
  public isModalVisible$ = this.isModalVisibleSubject.asObservable();

  private favoritesSubject = new BehaviorSubject<Favorite[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private apiService: ApiService, private alertService: AlertService, private token: TokenService,) {
    this.loadFavorites();
  }

  showModal() {
    this.isModalVisibleSubject.next(true);
  }

  hideModal() {
    this.isModalVisibleSubject.next(false);
  }

  get isModalVisible(): boolean {
    return this.isModalVisibleSubject.value;
  }

  get favorites(): Favorite[] {
    return this.favoritesSubject.value;
  }

  loadFavorites() {
    // Skip fetching favorites when not logged in
    const token = this.token.getToken();
    if (!token) {
      this.favoritesSubject.next([]);
      return;
    }

    if (environment.ismock) {
      this.apiService.getSectionData("favorite").subscribe({
        next: (data) => {
          const favorites = data?.data?.map((item: any) => new Favorite(
            item.favId || 0,
            item.itemId || item.videoId || 0,
            item.section || 'video',
            item.title || 'Untitled',
            item.artist || item.featuring || '',
            item.image || item.thumbnail || '/img/video-placeholder.jpg',
            item.duration || '0:00',
            item.type || 'video',
            item.hls || '',
            item.file || '',
            item.date || new Date().toISOString(),
            item.dateAdded || new Date().toISOString()
          )) || [];
          this.favoritesSubject.next(favorites);
        },
        error: (error) => {
          console.error('Failed to load favorites', error);
          // Set empty array on error
          this.favoritesSubject.next([]);
        }
      });
    } else {
      this.apiService.get('Favorites?app=' + Config.app, false, false).subscribe({
        next: (data) => {
          if (data.error) {
          this.alertService.error('Error', data.msg, Config.alertOptions)
          } else {
            console.log(this.favorites);
          }
          this.favoritesSubject.next(data.data);
        },
        error: (error) => {
          console.error('Failed to load favorites', error);
          // Set empty array on error
          this.favoritesSubject.next([]);
        }
      });
    }
  }

  addFavorite(fav: Favorite) {
    // e.preventDefault();
    const _fav = {
      favId: fav.favId,
      itemId: fav.itemId,
      section: fav.type || 'video'
    } as FavoriteId;

    console.log(_fav);
    this.apiService.post('UpdateFavorites?app=' + Config.app, _fav, false, false)
      .subscribe(data => {
        if (data.error) {
          this.alertService.error('Error', data.msg, Config.alertOptions);
        } else {
          if (data.id > 0) {
            this.alertService.success('Added', data.msg, Config.alertOptions);
            try {
              document.querySelector<HTMLElement>('#' + fav.section + '-fav-icon-' + fav.itemId)!.style.visibility = 'visible';
            } catch (err) {
            }
          } else {
            this.alertService.info('Removed', data.msg, Config.alertOptions);
            try {
              document.querySelector<HTMLElement>('#' + fav.section + '-fav-icon-' + fav.itemId)!.style.visibility = 'hidden';
            } catch (err) {
            }
          }
          this.loadFavorites();
        }
      });
  }

  removeFav(e: any, fav: Favorite) {
    e.preventDefault();
    const _fav = {
      favId: fav.favId,
      itemId: fav.itemId,
      section: fav.type
    } as FavoriteId;

    console.log(_fav);
    this.apiService.post('UpdateFavorites?app=' + Config.app, _fav, false, false)
      .subscribe(data => {
        if (data.error) {
          this.alertService.error('Error', data.msg, Config.alertOptions);
        } else {
          if (data.id > 0) {
            this.alertService.success('Added', data.msg, Config.alertOptions);
            try {
              document.querySelector<HTMLElement>('#' + fav.section + '-fav-icon-' + fav.itemId)!.style.visibility = 'visible';
            } catch (err) {
            }
          } else {
            this.alertService.info('Removed', data.msg, Config.alertOptions);
            try {
              document.querySelector<HTMLElement>('#' + fav.section + '-fav-icon-' + fav.itemId)!.style.visibility = 'hidden';
            } catch (err) {
            }
          }
          this.apiService.get('Favorites?app=' + Config.app, false, false)
            .subscribe(data => {
              if (data.error) {
                this.alertService.error('Error', data.msg, Config.alertOptions)
                this.favoritesSubject.next([]);
              } else {
                this.favoritesSubject.next(this.favorites);
              }
            });
        }
      });
  }

  isFavorited(itemId: number): boolean {
    return this.favorites.some(f => f.itemId === itemId);
  }

  toggleFavorite(item: any) {
    const existingFavorite = this.favorites.find(f => f.itemId === (item.videoId || item.id));

    if (existingFavorite) {
      this.removeFavorite(existingFavorite);
    } else {
      this.addFavorite(item);
    }
  }

  removeFavorite(fav: Favorite) {
    // e.preventDefault();
    const _fav = {
      favId: fav.favId,
      itemId: fav.itemId,
      section: fav.type || 'video'
    } as FavoriteId;

    console.log(_fav);
    this.apiService.post('UpdateFavorites?app=' + Config.app, _fav, false, false)
      .subscribe(data => {
        if (data.error) {
          this.alertService.error('Error', data.msg, Config.alertOptions);
        } else {
          if (data.id > 0) {
            this.alertService.success('Added', data.msg, Config.alertOptions);
            try {
              document.querySelector<HTMLElement>('#' + fav.section + '-fav-icon-' + fav.itemId)!.style.visibility = 'visible';
            } catch (err) {
            }
          } else {
            this.alertService.info('Removed', data.msg, Config.alertOptions);
            try {
              document.querySelector<HTMLElement>('#' + fav.section + '-fav-icon-' + fav.itemId)!.style.visibility = 'hidden';
            } catch (err) {
            }
          }
          this.loadFavorites();
        }
      });
  }

}