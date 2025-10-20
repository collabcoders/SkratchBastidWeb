import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  user = signal({
    name: 'Johnny Arguelles',
    email: 'johnnyja78@gmail.com',
    memberNumber: '#2030',
    memberSince: 'October 2025',
  });

  onBack() {
    window.history.back();
  }
}
