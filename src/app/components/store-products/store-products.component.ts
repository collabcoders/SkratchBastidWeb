import { Component, signal, WritableSignal, ViewChild, ElementRef } from '@angular/core';
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
  allowedTitles: string[] = [
    'Skratch Bastid x OBEY: Serato Control Vinyl',
    "Bastid's BBQ Ball Cap - Available in Black or White",
    "Bastid's BBQ 2024 Short Sleeve T-Shirt Black",
    "Bastid's BBQ 2024 Short Sleeve T-Shirt White",
    'OBEYxBastid - Tee  - Limited Capsule Drop',
    'OBEYxBastid - Hoodie  - Limited Capsule Drop',
    'OBEYxBastid - Hat  - Limited Capsule Drop',
    "Skratch Bastid Socks"
  ];
  isLoadingProducts: WritableSignal<boolean> = signal(false);
  @ViewChild('storeCarousel') storeCarousel!: ElementRef<HTMLDivElement>;

  constructor(private apiService: ApiService, private alertService: AlertService, public appData: AppData) {
    this.isLoadingProducts.set(true);
    this.apiService.getSectionData("product").subscribe((data) => {
      const zigzags = [
        '/img/zigzag/zigzag1.png',
        '/img/zigzag/zigzag2.png',
        '/img/zigzag/zigzag3.png',
        '/img/zigzag/zigzag4.png',
        '/img/zigzag/zigzag1.png',
        '/img/zigzag/zigzag2.png',
        '/img/zigzag/zigzag3.png',
        '/img/zigzag/zigzag4.png',
      ];

      const filtered = (data?.data || []).filter((p: Product) =>
        this.allowedTitles.includes(p.title)
      );

      const mapped = filtered.map((p: Product, index: number) => ({
        ...p,
        zigzag: index < zigzags.length ? zigzags[index] : null,
      }));

      this.appData.products.set(mapped);
      this.isLoadingProducts.set(false);
    }, (error) => {
        this.alertService.error('', error?.error?.message || error?.message || "Something went wrong!", Config.alertOptions);
        this.isLoadingProducts.set(false);
    });
  }

  scrollLeft() {
    if (!this.storeCarousel) return;
    this.storeCarousel.nativeElement.scrollBy({ left: -260, behavior: 'smooth' });
  }

  scrollRight() {
    if (!this.storeCarousel) return;
    this.storeCarousel.nativeElement.scrollBy({ left: 260, behavior: 'smooth' });
  }
}
