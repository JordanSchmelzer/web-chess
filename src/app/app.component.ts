import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppRoutingModule } from './routes/app.routing';
import { NavMenuComponent } from "./modules/nav-menu/nav-menu.component";
import { BoardComponent } from "./modules/board/board.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    //RouterOutlet,
    //AppRoutingModule,
    NavMenuComponent,
    BoardComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'web-chess';
}
