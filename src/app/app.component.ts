import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavMenuComponent } from "./modules/nav-menu/nav-menu.component";
import { BoardComponent } from "./modules/board/board.component";
import { ComputerModeComponent } from './modules/computer-mode/computer-mode.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavMenuComponent,
    BoardComponent,
    ComputerModeComponent,
    RouterLink,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'web-chess';
}
