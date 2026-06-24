import { Component, signal, WritableSignal, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';

import { LegendsProductsService } from '@shared/services/legends/products.service';
import { AppData } from 'src/app/app.data';

// Shape returned by GET /api/products
interface ApiProduct {
  productId: number;
  title: string;
  description: string;
  price: string;
  image: string;
  url: string;
  category: string;
  order: number;
}

@Component({
  selector: 'app-store-products',
  imports: [],
  templateUrl: './store-products.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './store-products.component.scss'
})
export class StoreProductsComponent {
  isLoadingProducts: WritableSignal<boolean> = signal(false);
  @ViewChild('storeCarousel') storeCarousel!: ElementRef<HTMLDivElement>;

  constructor(private productsService: LegendsProductsService, public appData: AppData) {
    this.isLoadingProducts.set(true);
    this.productsService.getProducts().subscribe((data) => {
      const zigzags = [
        '/img/zigzag/zigzag1.png',
        '/img/zigzag/zigzag2.png',
        '/img/zigzag/zigzag3.png',
        '/img/zigzag/zigzag4.png',
      ];

      // The API returns the curated, order-sorted set; map its fields onto the
      // shape the template expects (url -> link) and cycle the zigzag accents.
      const mapped = (data?.data || [])
        .slice()
        .sort((a: ApiProduct, b: ApiProduct) => (a.order ?? 0) - (b.order ?? 0))
        .map((p: ApiProduct, index: number) => ({
          title: p.title,
          price: p.price,
          image: p.image,
          link: p.url,
          zigzag: zigzags[index % zigzags.length],
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
