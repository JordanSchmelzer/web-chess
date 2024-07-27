import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './modules/game/game.component';
import { ToolBarComponent } from './modules/tool-bar/tool-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameComponent, ToolBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'web-chess';
}
