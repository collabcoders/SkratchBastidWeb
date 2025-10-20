import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor() {

  }
  
  ngOnInit(): void {
      console.log("FROM APP COMPONENT");
  }
}