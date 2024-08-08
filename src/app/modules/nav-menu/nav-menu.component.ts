import { Component } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from '@angular/router';
import { BoardComponent } from "../board/board.component";

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterModule, BoardComponent],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent {

}
