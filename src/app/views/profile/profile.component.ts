import { Component, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { ApiService } from '@shared/services/api.service';
import { LegendsMemberService } from '@shared/services/legends/member.service';
import { Router } from '@angular/router';
import { TokenService } from '@shared/services/token.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  user = signal({
    name: '',
    email: '',
    memberNumber: '',
    memberSince: '',
  });
  memberProfile: any = { memberId: null };

  constructor(private apiService: ApiService, private router: Router, private token: TokenService, private legendsMember: LegendsMemberService) {}

  loading = signal(false);
  ngOnInit() {
    const member = this.token.getMember();
    this.memberProfile.memberId = member?.memberId;
    if (this.memberProfile?.memberId) {
      this.loading.set(true);
      this.legendsMember.getMember().subscribe((data: any) => {
        console.log('get member', data);
        this.loading.set(false);
        this.memberProfile = data.data;
        if (this.memberProfile) {
          this.user.set({
            name: `${this.memberProfile.firstName} ${this.memberProfile.lastName}`,
            email: this.memberProfile.email,
            memberNumber: this.memberProfile.memberNumber || '',
            memberSince: this.memberProfile.memberSince || this.memberProfile.dateAdded || ''
          });
        } else {
          this.router.navigate(['/']);
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  onBack() {
    window.history.back();
  }
}
