import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    {
      title: 'OBEYxBastid - Hoodie  - Limited Capsule Drop',
      price: '110.0 USD',
      image: 'https://cdn.shopify.com/s/files/1/0275/0188/7533/files/IMG_5598-4.png?v=1744376896',
      link: 'https://shop.skratchbastid.com/products/obeyxbastid-hoodie-limited-capsule-drop',
      zigzag: '/img/zigzag/zigzag1.png'
    },
    {
      title: 'OBEYxBastid - Tee  - Limited Capsule Drop',
      price: '60.0 USD',
      image: 'https://cdn.shopify.com/s/files/1/0275/0188/7533/files/IMG_5584-4.png?v=1744378292',
      link: 'https://shop.skratchbastid.com/products/obeyxbastid-tee-limited-capsule-drop-copy',
      zigzag: '/img/zigzag/zigzag2.png'
    },
    {
      title: 'OBEYxBastid - Hat - Limited Capsule Drop',
      price: '45.0 USD',
      image: 'https://cdn.shopify.com/s/files/1/0275/0188/7533/files/ScreenShot2025-05-07at7.19.37PM.png?v=1746670789',
      link: 'https://shop.skratchbastid.com/products/obeyxbastid-hat-limited-capsule-drop',
      zigzag: '/img/zigzag/zigzag3.png'
    }
  ];
}
