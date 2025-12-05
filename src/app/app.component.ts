import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '@shared/services/favorites.service';
import { VipDialogService } from '@shared/services/vip-dialog.service';
@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  showVipDialog = false;
  showFavoritesModal = false;

  constructor(
    private vipDialogService: VipDialogService,
    private favoritesService: FavoritesService,
  ) {

  }
  
  ngOnInit(): void {
      console.log("FROM APP COMPONENT");

    // Subscribe to dialog visibility changes
    this.vipDialogService.isDialogVisible$.subscribe(isVisible => {
      this.showVipDialog = isVisible;
    });

    // Subscribe to favorites modal visibility changes
    this.favoritesService.isModalVisible$.subscribe(isVisible => {
      this.showFavoritesModal = isVisible;
    });
  }

  onCloseVipDialog() {
    this.vipDialogService.hideDialog();
  }

  onCloseFavoritesModal() {
    this.favoritesService.hideModal();
  }
}