import { Injectable } from '@angular/core';
import { VipDialogService } from './vip-dialog.service';
import { TokenService } from './token.service';
import { Observable } from 'rxjs';
import { FavoriteId } from '@shared/models/favorite-id';
import { Video } from '@shared/models/video';
import { Favorite } from '@shared/models/favorite';

@Injectable({
  providedIn: 'root'
})
export class VideoAccessService {

  isLoggedIn$!: Observable<boolean>;
  isLoggedIn!: boolean;

  constructor(
    // private authService: AuthService,
    private token: TokenService,
    private vipDialogService: VipDialogService
  ) {}

  /**
   * Check if user can access video content
   * If not, show the VIP login dialog
   * @param requiresVip - Whether the video requires VIP membership
   * @returns true if user can access, false if dialog was shown
   */
  checkVideoAccess(requiresVip: boolean = true): boolean {
    // For testing - allow all video access without VIP dialog
    this.isLoggedIn$ = this.token.isValid(undefined);
    this.isLoggedIn = this.token.isValid(undefined)?.value;

    // For non-VIP content, just check if user is logged in
    // if (!requiresVip) {
    //   if (!this.authService.isLoggedIn) {
    //     this.vipDialogService.showDialog();
    //     return false;
    //   }
    //   return true;
    // }

    // For VIP content, check if user is logged in AND is VIP member
    if (!this.isLoggedIn) {
      this.vipDialogService.showDialog();
      return false;
    }

    return true;
  }

  /**
   * Handle video click events
   * @param videoElement - The video element or video data
   * @param requiresVip - Whether this video requires VIP access
   * @param onSuccess - Callback to execute if access is granted
   */
  handleVideoClick(
    videoElement: any,
    requiresVip: boolean = true,
    onSuccess?: () => void
  ): void {
    if (this.checkVideoAccess(requiresVip)) {
      // User has access, proceed with video play
      if (onSuccess) {
        onSuccess();
      }
    }
    // If no access, dialog will be shown automatically
  }
}

export function mappingFavorites(videos: Video[], favorites: Favorite[]) {
    if (favorites.length > 0) {
      for (var i = 0; i < videos?.length; i++) {
        if (favorites.some((item: any) => item.itemId === videos[i].videoId)) {
          videos[i].favId = 1;
        } else {
          videos[i].favId = 0;
        }
      }
    }
    return videos;
}