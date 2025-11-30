import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@shared/services/api.service';
import { AlertService } from '@shared/services/alert.service';
import { Config } from '@shared/config';
import { environment } from '@env/environment';
import { AppData } from 'src/app/app.data';

interface Product {
  title: string;
  price: string;
  image: string;
  link: string;
  zigzag: string;
}

@Component({
  selector: 'app-store-products',
  imports: [CommonModule],
  templateUrl: './store-products.component.html',
  styleUrl: './store-products.component.scss'
})
export class StoreProductsComponent {
  isLoadingProducts: WritableSignal<boolean> = signal(false);
  constructor(private apiService: ApiService, private alertService: AlertService, public appData: AppData) {
    this.isLoadingProducts.set(true);
    if (environment.ismock) {
      this.apiService.getSectionData("product").subscribe((data) => {
        this.appData.products.set(data?.data);
        this.isLoadingProducts.set(false);
      }, (error) => {
          this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
          this.isLoadingProducts.set(false);
      });
    } else {
        this.apiService.getData('product', '', '').subscribe((data: any) => {
          this.appData.products.set(data.data as Product[]);
          this.isLoadingProducts.set(false);
        }, (error) => {
           this.apiService.getSectionData("product", true).subscribe((data) => {
              this.appData.products.set(data?.data);
              this.isLoadingProducts.set(false);
            }, (error) => {
                this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
                this.isLoadingProducts.set(false);
            });
        });
    }
  }
}
