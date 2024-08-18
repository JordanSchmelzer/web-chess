import { Component } from '@angular/core';
import { NavMenuComponent } from "./modules/nav-menu/nav-menu.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavMenuComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'web-chess';
}
