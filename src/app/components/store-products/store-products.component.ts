import { Component, signal, WritableSignal, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';

import { ApiService } from '@shared/services/api.service';
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
  imports: [],
  templateUrl: './store-products.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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

  constructor(private apiService: ApiService, public appData: AppData) {
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
        // Store products are non-critical home-page content: fail quietly and let
        // the template show its "No products available" empty state instead of a growl.
        console.error('Failed to load store products', error);
        this.appData.products.set([]);
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
