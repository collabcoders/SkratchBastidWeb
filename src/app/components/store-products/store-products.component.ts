import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@shared/services/api.service';
import { AlertService } from '@shared/services/alert.service';
import { Config } from '@shared/config';

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
  products: Product[] = [
  ];

  constructor(private apiService: ApiService, private alertService: AlertService) {
    this.apiService.getSectionData("product").subscribe((data) => {
      this.products = data?.data;
    }, (error) => {
        this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
    });
  }
}
