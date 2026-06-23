import { Component, ChangeDetectionStrategy } from '@angular/core';

import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
  selector: 'app-payment-success',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentSuccessComponent {}
