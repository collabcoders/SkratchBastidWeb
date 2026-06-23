import { Component, OnInit, input, output } from '@angular/core';

import { Favorite } from '@shared/models/favorite';
import { VideoService } from '@shared/services/video.service';
import { ApiService } from '@shared/services/api.service';
import { FavoritesService } from '@shared/services/favorites.service';

@Component({
  selector: 'app-favorites-modal',
  imports: [],
  templateUrl: './favorites-modal.component.html',
  styleUrl: './favorites-modal.component.scss',
  standalone: true,
})
export class FavoritesModalComponent implements OnInit {
  isVisible = input<boolean>(false);
  closeModal = output<void>();

  favorites: Favorite[] = [];
  loading = false;
  private readonly videoPoster = '/public/logo.png';

  constructor(
    private videoService: VideoService,
    private favoriteService: FavoritesService,
    private apiService: ApiService
  ) {
    this.loadFavorites();
  }

  ngOnInit() {
  }

  loadFavorites() {
    this.favoriteService.favorites$?.subscribe((favs) => {
      this.favorites = favs;
    })
  }

  onClose() {
    this.closeModal.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  getPoster(favorite: Favorite): string {
    const isGif = (src?: string) => !!src && src.toLowerCase().includes('.gif');
    if (favorite.image && !isGif(favorite.image)) {
      return favorite.image;
    }
    return favorite.image;
  }

  getHoverMedia(favorite: Favorite): string {
    return favorite.image || this.videoPoster;
  }

  showGif(event: any, favorite: Favorite) {
    const target = event.target || event.srcElement || event.currentTarget;
    const hoverSrc = this.getHoverMedia(favorite);
    if (hoverSrc) {
      target.src = hoverSrc;
    }
  }

  showScreenshot(event: any, favorite: Favorite) {
    const target = event.target || event.srcElement || event.currentTarget;
    const poster = this.getPoster(favorite);
    if (poster) {
      target.src = poster;
    }
  }

  checkImage(event: any, favorite: Favorite) {
    const target = event.target || event.srcElement || event.currentTarget;
    const imgElement = new Image();
    imgElement.src = target.src;
    imgElement.addEventListener('error', () => {
      target.src = this.videoPoster;
      imgElement.onload = null;
    });
  }

  errorImage(event: any, favorite: Favorite) {
    const target = event.target || event.srcElement || event.currentTarget;
    target.src = this.videoPoster;
  }

  playVideo(favorite: Favorite) {
    // Convert Favorite to Video format for the video service
    const videoData = {
      videoId: favorite.itemId,
      title: favorite.title,
      source: 'vimeo',
      sourceId: '',
      hls: favorite.hls,
      duration: favorite.duration,
      category: '',
      featuring: favorite.artist,
      image: favorite.image,
      screenshot: favorite.image,
      date: favorite.date,
      audio1: '',
      favId: favorite.favId,
      featured: 0
    };

    // Close favorites modal first
    this.onClose();

    // Play the video
    this.videoService.showPlayer(videoData);

    // Show video modal
    setTimeout(() => {
      const modalElement = document.getElementById('videoModal');
      if (modalElement) {
        if (typeof (window as any).bootstrap !== 'undefined') {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        }
      }
    }, 100);
  }

  removeFavorite(favorite: Favorite) {
    // Remove from local array
    this.favorites = this.favorites.filter(f => f.favId !== favorite.favId);

    // TODO: Call API to remove from backend
    // this.apiService.delete(`favorite/${favorite.favId}`).subscribe();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit'
    }) + ' ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}