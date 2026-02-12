import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { SafePipe } from '@shared/pipes/safe.pipe';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ApiService } from '@shared/services/api.service';
import { User } from '@shared/models/user';
import '@mux/mux-player';
import { environment } from '@env/environment';
import { Config } from '@shared/config';

@Component({
  selector: 'app-stream',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, SafePipe],
  templateUrl: './stream.component.html',
  styleUrl: './stream.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StreamComponent implements OnInit {
  stream = '';
  chat?: string;

  offline_livestream_placehoder = Config.offline_livestream_placehoder;
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    console.log("getItem");
    this.api.getItem('user', 0).subscribe((data: any) => {
      const user = data?.data as User | undefined;
      console.log("getItem", user);
      if (!user) {
        return;
      }

      if (user.hlsUrl?.length > 10) {
        const url = user.hlsUrl.substring(0, user.hlsUrl.lastIndexOf('.'));
        this.stream = url.split('/').pop() || '';
      }

      const chatUrl = (user.memberChatUrl?.length > 10 ? user.memberChatUrl : user.chatUrl);
      if (chatUrl) {
        this.chat = chatUrl;
      }
    });
  }
}
